import { ProjectStore } from '../stores/project.store';
import { AccidentalId } from '../types/AccidentalTypes';
import { ChordId, ChordSpec } from '../types/ChordTypes';
import { NoteId } from '../types/NoteTypes';
import { Piano } from './Instruments/Piano';
import PlayHead, { EndCondition } from './PlayHead';
import SampleLibrary from './SampleLibrary';
import Scheduler from './Scheduler';

class Audio {
  private context: AudioContext;
  private instruments: { [instrumentName: string]: SampleLibrary };
  private projectStore?: ProjectStore;
  private scheduler: Scheduler;
  private previousFeedbackNotes: NoteId[] = [];

  constructor() {
    this.context = new window.AudioContext();
    this.instruments = {
      piano: new SampleLibrary(this.context, Piano)
    };
    this.scheduler = new Scheduler(this.context, this.onUpdateFeedback);
  }

  public async load() {
    for (let instrument of Object.values(this.instruments)) {
      await instrument.decodeToAudioBuffers();
    }
  }

  public setProjectStore(projectStore: ProjectStore) {
    this.projectStore = projectStore;
  }

  public playSheet() {
    if (!this.projectStore) {
      throw new Error('Must call setProjectStore before other Audio methods.');
    }
    const firstElement = this.projectStore.firstElement;
    if (!firstElement) {
      return;
    }

    const playHead = new PlayHead(
      this.context,
      this.projectStore,
      this.instruments.piano,
      EndCondition.END_OF_SHEET,
      firstElement
    );
    this.scheduler.pushPlayHead(playHead);
    this.scheduler.start();
  }

  public playChord(chordId: ChordId) {
    if (!this.projectStore) {
      throw new Error('Must call setProjectStore before other Audio methods.');
    }
    const playHead = new PlayHead(
      this.context,
      this.projectStore,
      this.instruments.piano,
      EndCondition.SAMPLE_ELEMENT,
      chordId
    );
    this.scheduler.pushPlayHead(playHead);
    this.scheduler.start();
  }

  public playAccidentalSample(accidentalId: AccidentalId) {
    if (!this.projectStore) {
      throw new Error('Must call setProjectStore before other Audio methods.');
    }
    const playHead = new PlayHead(
      this.context,
      this.projectStore,
      this.instruments.piano,
      EndCondition.SAMPLE_ELEMENT,
      accidentalId
    );
    this.scheduler.pushPlayHead(playHead);
    this.scheduler.start();
  }

  public stopChord(chordId: ChordId) {
    this.scheduler.stopChord(chordId);
  }

  public stopAll() {
    this.scheduler.stop();
  }

  private onUpdateFeedback = (playingChords: ChordSpec[]) => {
    if (!this.projectStore) {
      return;
    }
    const currentFeedbackNotes: NoteId[] = [];
    for (let chord of playingChords) {
      const notes = this.projectStore.getNotesForChord(chord.id);
      notes.forEach(note => {
        currentFeedbackNotes.push(note.id);
        this.projectStore!.setNotePlaying(note.id, true);
      });
    }
    const turnOff = this.previousFeedbackNotes.filter(
      noteId => !currentFeedbackNotes.includes(noteId)
    );
    turnOff.forEach(noteId => this.projectStore!.setNotePlaying(noteId, false));
    this.previousFeedbackNotes = currentFeedbackNotes;
  };
}

export default new Audio();
