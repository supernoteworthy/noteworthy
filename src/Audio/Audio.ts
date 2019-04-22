import { ProjectStore } from '../stores/project.store';
import { UiStore } from '../stores/ui.store';
import { AccidentalId, AccidentalType } from '../types/AccidentalTypes';
import { ChordId, ChordSpec } from '../types/ChordTypes';
import { NoteId, NoteSpec } from '../types/NoteTypes';
import { staffPositionToMidi } from './AudioMath';
import { Piano } from './Instruments/Piano';
import { Sawtooth } from './Instruments/Sawtooth';
import { Sine } from './Instruments/Sine';
import { Snare } from './Instruments/Snare';
import PlayHead, { EndCondition } from './PlayHead';
import SampleLibrary from './SampleLibrary';
import Scheduler from './Scheduler';

class Audio {
  private context: AudioContext;
  private instruments: { [instrumentName: string]: SampleLibrary };
  private projectStore?: ProjectStore;
  private uiStore?: UiStore;
  private scheduler: Scheduler;
  private previousFeedbackNotes: NoteId[] = [];

  constructor() {
    this.context = new window.AudioContext();
    this.instruments = {
      Piano: new SampleLibrary(this.context, Piano),
      Sine: new SampleLibrary(this.context, Sine),
      Sawtooth: new SampleLibrary(this.context, Sawtooth),
      Snare: new SampleLibrary(this.context, Snare)
    };
    this.scheduler = new Scheduler(this.context, this.onUpdateFeedback);
  }

  public async load() {
    for (let instrument of Object.values(this.instruments)) {
      await instrument.decodeToAudioBuffers();
    }
  }

  public connectToStores(projectStore: ProjectStore, uiStore: UiStore) {
    this.projectStore = projectStore;
    this.uiStore = uiStore;
  }

  public playSheet() {
    if (!this.projectStore || !this.uiStore) {
      throw new Error('Must call connectToStores before other Audio methods.');
    }
    const firstElement = this.projectStore.getFirstElementId(
      this.uiStore.activeSheet
    );
    if (!firstElement) {
      return;
    }

    const playHead = new PlayHead(
      this.context,
      this.projectStore,
      this.instruments,
      EndCondition.END_OF_SHEET,
      firstElement,
      this.uiStore.activeSheet
    );
    this.scheduler.pushPlayHead(playHead);
    this.scheduler.start();
  }

  public playChord(chordId: ChordId) {
    if (!this.projectStore || !this.uiStore) {
      throw new Error('Must call connectToStores before other Audio methods.');
    }
    const playHead = new PlayHead(
      this.context,
      this.projectStore,
      this.instruments,
      EndCondition.SAMPLE_ELEMENT,
      chordId,
      this.uiStore.activeSheet
    );
    this.scheduler.pushPlayHead(playHead);
    this.scheduler.start();
  }

  public playAccidentalSample(accidentalId: AccidentalId) {
    if (!this.projectStore || !this.uiStore) {
      throw new Error('Must call connectToStores before other Audio methods.');
    }
    const playHead = new PlayHead(
      this.context,
      this.projectStore,
      this.instruments,
      EndCondition.SAMPLE_ELEMENT,
      accidentalId,
      this.uiStore.activeSheet
    );
    this.scheduler.pushPlayHead(playHead);
    this.scheduler.start();
  }

  public playNoteSample(
    note: NoteSpec,
    accidental: AccidentalType,
    octave: number
  ) {
    const source = this.context.createBufferSource();
    const midiNote = staffPositionToMidi(note.y, octave, accidental);
    const {
      buffer,
      playbackRate
    } = this.instruments.Piano.getBufferAndRateForMidi(midiNote);
    source.buffer = buffer;
    source.playbackRate.value = playbackRate;
    const start = this.context.currentTime;
    const stop = this.context.currentTime + 1;
    source.start(start);
    source.stop(stop);
    const gain = this.context.createGain();
    source.connect(gain);
    gain.gain.setValueAtTime(1, start + (stop - start) * 0.7);
    gain.gain.linearRampToValueAtTime(0.000001, stop);
    gain.connect(this.context.destination);
  }

  public stopChord(chordId: ChordId) {
    this.scheduler.stopChord(chordId);
  }

  public stopAll() {
    this.scheduler.stop();
  }

  private onUpdateFeedback = (playingChords: ChordSpec[]) => {
    if (!this.projectStore || !this.uiStore) {
      return;
    }
    const sheet = this.uiStore.activeSheet;
    const currentFeedbackNotes: NoteId[] = [];
    for (let chord of playingChords) {
      const notes = this.projectStore.getNotesForChord(sheet, chord.id);
      notes.forEach(note => {
        currentFeedbackNotes.push(note.id);
        this.projectStore!.setNotePlaying(sheet, note.id, true);
      });
    }
    const turnOff = this.previousFeedbackNotes.filter(
      noteId => !currentFeedbackNotes.includes(noteId)
    );
    turnOff.forEach(noteId =>
      this.projectStore!.setNotePlaying(sheet, noteId, false)
    );
    this.previousFeedbackNotes = currentFeedbackNotes;
  };
}

export default new Audio();
