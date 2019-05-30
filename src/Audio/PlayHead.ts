import { ProjectStore } from '../stores/project.store';
import { AccidentalSpec, AccidentalType } from '../types/AccidentalTypes';
import { ChordSpec } from '../types/ChordTypes';
import { NoteSpec, NoteType } from '../types/NoteTypes';
import { MatchType, RepeatId, RepeatSpec } from '../types/RepeatTypes';
import { SetterSpec, SetterType } from '../types/SetterTypes';
import { SheetId } from '../types/SheetTypes';
import { ElementId } from '../types/StaffTypes';
import {
  beatsToSeconds,
  noteLengthToBeats,
  staffPositionToMidi
} from './AudioMath';
import SampleLibrary from './SampleLibrary';

export enum EndCondition {
  SAMPLE_ELEMENT,
  END_OF_STAFF,
  END_OF_SHEET
}

export default class PlayHead {
  public currentChord?: ChordSpec;
  public endTime?: number;
  public endCondition: EndCondition;

  private context: AudioContext;
  private gain?: GainNode;
  private source?: AudioBufferSourceNode;
  private projectStore: ProjectStore;
  private instruments: { [instrumentName: string]: SampleLibrary };
  private currentElement: ElementId;
  private sheetId: SheetId;
  private repeatCounters: { [counter: string]: number } = {};
  private workingAccidentals: { [y: number]: AccidentalType } = {};
  private workingSetterProperties: {
    [prop: string]: number | string | undefined;
  } = {};

  constructor(
    context: AudioContext,
    projectStore: ProjectStore,
    instruments: { [instrumentName: string]: SampleLibrary },
    endCondition: EndCondition,
    currentElement: ElementId,
    sheetId: SheetId
  ) {
    this.context = context;
    this.projectStore = projectStore;
    this.currentElement = currentElement;
    this.instruments = instruments;
    this.endCondition = endCondition;
    this.sheetId = sheetId;
  }

  // ----- Playhead sequencing -----
  // Handles anything we might encounter on the sheet until
  // we encounter a playable element (chord).
  // Output that chord to audio if we reach it.

  public proceedAndOutputNextSound() {
    const element = this.projectStore.getElementById(
      this.sheetId,
      this.currentElement
    );
    const handlers = {
      chord: this.handleCurrentChord,
      accidental: this.handleCurrentAccidental,
      note: this.handleCurrentNote,
      repeat: this.handleCurrentRepeat,
      setter: this.handleCurrentSetter
    };
    if (!element || !handlers[element.kind]) {
      return;
    }
    handlers[element.kind].bind(this)(element as any);
  }

  private handleCurrentChord(element: ChordSpec) {
    this.currentChord = element;
    this.chordToAudio(element, this.context.currentTime);
  }

  private handleCurrentAccidental(element: AccidentalSpec) {
    this.workingAccidentals[element.y] = element.type;
    if (this.endCondition === EndCondition.SAMPLE_ELEMENT) {
      let time = 0.5;
      this.noteToAudio(
        element,
        this.context.currentTime,
        this.context.currentTime + time
      );
      this.endTime = this.context.currentTime + time;
    }
    this.next();
  }

  private handleCurrentNote(element: NoteSpec) {
    if (this.endCondition === EndCondition.SAMPLE_ELEMENT) {
      const time = beatsToSeconds(noteLengthToBeats(element.length), 100);
      this.noteToAudio(
        element,
        this.context.currentTime,
        this.context.currentTime + time
      );
      this.endTime = this.context.currentTime + time;
    }
  }

  private handleCurrentRepeat(element: RepeatSpec) {
    if (element.type === MatchType.START) {
      // Start repeat -- go to next note.
      const isRepeatBlockEmpty = element.nextElement === element.matchElement;
      if (isRepeatBlockEmpty) {
        return;
      }
      this.next();
    } else {
      // End repeat -- go to start repeat if needed.
      this.incrementRepeatCounter(element.id);
      const isRepeatCounterAtLimit =
        element.nRepeats === undefined ||
        this.repeatCounters[element.id] >= element.nRepeats;
      if (isRepeatCounterAtLimit) {
        delete this.repeatCounters[element.id];
        return;
      }
      let startRepeat = element.matchElement;
      if (!startRepeat) {
        // If no matching start is present, use the start of sheet.
        startRepeat = this.projectStore.getFirstElementId(this.sheetId);
      }
      if (startRepeat) {
        this.currentElement = startRepeat;
        this.proceedAndOutputNextSound();
      }
    }
  }

  private handleCurrentSetter(element: SetterSpec) {
    this.workingSetterProperties[element.type] = element.value;
    this.next();
  }

  private incrementRepeatCounter(id: RepeatId) {
    if (this.repeatCounters[id] === undefined) {
      this.repeatCounters[id] = 1;
    } else {
      this.repeatCounters[id]++;
    }
  }

  public next() {
    if (this.endCondition === EndCondition.SAMPLE_ELEMENT) {
      return false;
    }
    const element = this.projectStore.getElementById(
      this.sheetId,
      this.currentElement
    );
    if (!element || !element.nextElement) {
      return false;
    }
    const nextElement = this.projectStore.getElementById(
      this.sheetId,
      element.nextElement
    );
    if (!nextElement) {
      return false;
    }
    this.currentElement = nextElement.id;
    this.proceedAndOutputNextSound();
    return true;
  }

  // ----- Audio handlers ------
  // Output the playhead state to the Web Audio API context.

  private getSetterProperty(type: SetterType, elementId: ElementId) {
    const workingValue = this.workingSetterProperties[type];
    if (workingValue) {
      return workingValue;
    }
    return this.projectStore.getBacktrackSetter(this.sheetId, type, elementId);
  }

  private chordToAudio(chord: ChordSpec, startTime: number) {
    const notes = this.projectStore.getNotesForChord(this.sheetId, chord.id);
    const bpm =
      (this.getSetterProperty(SetterType.BPM, chord.id) as number) || 100;
    const noteTimes = notes.map(note =>
      beatsToSeconds(noteLengthToBeats(note.length), bpm)
    );
    const chordTime = Math.max(...noteTimes);
    this.endTime = startTime + chordTime;
    notes.forEach(note => {
      const noteTime = beatsToSeconds(noteLengthToBeats(note.length), bpm);
      this.noteToAudio(note, startTime, startTime + noteTime);
    });
  }

  private noteToAudio(
    spec: NoteSpec | AccidentalSpec,
    start: number,
    stop: number
  ) {
    if (spec.kind === 'note' && spec.type === NoteType.REST) {
      return;
    }
    const source = this.context.createBufferSource();
    const accidental =
      this.workingAccidentals[spec.y] ||
      this.projectStore.getKeySignatureForNote(this.sheetId, spec.id);
    if (this.workingAccidentals[spec.y]) {
      // Accidentals are applied to only one note.
      delete this.workingAccidentals[spec.y];
    }
    const midiNote = staffPositionToMidi(
      spec.y,
      (this.getSetterProperty(SetterType.OCTAVE, spec.id) as number) || 0,
      spec.kind === 'note' ? accidental : spec.type
    );
    const instrument =
      this.getSetterProperty(SetterType.INSTRUMENT, spec.id) || 'Piano';
    const { buffer, playbackRate } = this.instruments[
      instrument
    ].getBufferAndRateForMidi(midiNote);
    if (!buffer) {
      return; // Audio buffer not yet loaded.
    }
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;
    source.start(start);
    source.stop(stop);

    const volume =
      ((this.getSetterProperty(SetterType.VOLUME, spec.id) as number) || 100) /
      100;

    const gain = this.context.createGain();
    source.connect(gain);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.setValueAtTime(volume, start + (stop - start) * 0.7);
    gain.gain.linearRampToValueAtTime(0.000001, stop);
    gain.connect(this.context.destination);
    this.source = source;
    this.gain = gain;
  }

  public stopAudio() {
    if (!this.gain || !this.source) {
      return;
    }
    const stopTime = this.context.currentTime + 0.1;
    if (this.endTime && stopTime > this.endTime) {
      return;
    }
    this.gain.gain.cancelScheduledValues(0);
    this.gain.gain.linearRampToValueAtTime(0.000001, stopTime);
  }
}
