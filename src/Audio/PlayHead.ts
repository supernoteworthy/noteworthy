import { ProjectStore } from '../stores/project.store';
import { AccidentalSpec } from '../types/AccidentalTypes';
import { ChordSpec } from '../types/ChordTypes';
import { NoteSpec, NoteType } from '../types/NoteTypes';
import {
  beatsToSeconds,
  noteLengthToBeats,
  staffPositionToMidi
} from './AudioMath';
import SampleLibrary from './SampleLibrary';

export enum PlayHeadType {
  CHORD,
  SAMPLE_NOTE
}

export enum EndCondition {
  END_OF_CHORD,
  END_OF_STAFF,
  END_OF_SHEET
}

const BPM = 100;

export default class PlayHead {
  private context: AudioContext;
  private gain?: GainNode;
  private source?: AudioBufferSourceNode;
  private projectStore: ProjectStore;
  private type: PlayHeadType;
  private instrument: SampleLibrary;
  public currentChord?: ChordSpec;
  private sampleSpec?: NoteSpec | AccidentalSpec;
  public endTime?: number;
  public endCondition: EndCondition;

  constructor(
    context: AudioContext,
    projectStore: ProjectStore,
    instrument: SampleLibrary,
    endCondition: EndCondition,
    type: PlayHeadType,
    currentChord?: ChordSpec,
    sampleSpec?: NoteSpec | AccidentalSpec
  ) {
    this.context = context;
    this.projectStore = projectStore;
    this.type = type;
    this.currentChord = currentChord;
    this.sampleSpec = sampleSpec;
    this.instrument = instrument;
    this.endCondition = endCondition;
  }

  start() {
    if (this.type === PlayHeadType.CHORD) {
      this.playChord(this.currentChord!, this.context.currentTime);
    }
    if (this.type === PlayHeadType.SAMPLE_NOTE) {
      const spec = this.sampleSpec!;
      let time = 0.5;
      if (spec.kind === 'note') {
        time = beatsToSeconds(noteLengthToBeats(spec.length), BPM);
      }
      this.playElement(
        this.sampleSpec!,
        this.context.currentTime,
        this.context.currentTime + time
      );
      this.endTime = this.context.currentTime + time;
    }
  }

  scheduleNextChord() {
    if (this.type !== PlayHeadType.CHORD) {
      return false;
    }
    if (this.endCondition === EndCondition.END_OF_CHORD) {
      return false;
    }
    const nextChord = this.projectStore.getNextChord(this.currentChord!.id);
    if (!nextChord) {
      return false;
    }
    if (
      this.endCondition === EndCondition.END_OF_STAFF &&
      nextChord.staffIndex !== this.currentChord!.staffIndex
    ) {
      return false;
    }
    this.currentChord = nextChord;
    this.playChord(this.currentChord, this.endTime!);
    return true;
  }

  playChord(chord: ChordSpec, startTime: number) {
    const notes = this.projectStore.getNotesForChord(chord.id);
    const noteTimes = notes.map(note =>
      beatsToSeconds(noteLengthToBeats(note.length), BPM)
    );
    const chordTime = Math.max(...noteTimes);
    this.endTime = startTime + chordTime;
    notes.forEach(note => {
      const noteTime = beatsToSeconds(noteLengthToBeats(note.length), BPM);
      this.playElement(note, startTime, startTime + noteTime);
    });
  }

  playElement(spec: NoteSpec | AccidentalSpec, start: number, stop: number) {
    if (spec.kind === 'note' && spec.type === NoteType.REST) {
      return;
    }
    const source = this.context.createBufferSource();
    const midiNote = staffPositionToMidi(
      spec.y,
      this.projectStore.getOctaveForElement(spec.id),
      spec.kind === 'note'
        ? this.projectStore.getAccidentalForNote(spec.id)
        : spec.type
    );
    const { buffer, playbackRate } = this.instrument.getBufferAndRateForMidi(
      midiNote
    );
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;
    source.start(start);
    source.stop(stop);
    const gain = this.context.createGain();
    source.connect(gain);
    gain.gain.setValueAtTime(1, start + (stop - start) * 0.7);
    gain.gain.linearRampToValueAtTime(0.000001, stop);
    gain.connect(this.context.destination);
    this.source = source;
    this.gain = gain;
  }

  stop() {
    if (!this.gain || !this.source) {
      return;
    }
    const stopTime = this.context.currentTime + 0.1;
    if (this.endTime && stopTime > this.endTime) {
      return;
    }
    this.gain.gain.cancelScheduledValues(0);
    this.gain.gain.linearRampToValueAtTime(0.000001, stopTime);
    this.source.stop(stopTime);
  }
}
