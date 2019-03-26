import { ProjectStore } from '../stores/project.store';
import { AccidentalId, AccidentalSpec } from '../types/AccidentalTypes';
import { ChordId, ChordSpec } from '../types/ChordTypes';
import { NoteId } from '../types/NoteTypes';
import { StaffIndex } from '../types/StaffTypes';
import { Piano } from './Instruments/Piano';
import PlayHead, { EndCondition, PlayHeadType } from './PlayHead';
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

    const playHead = new PlayHead(
      this.context,
      this.projectStore,
      this.instruments.piano,
      EndCondition.END_OF_SHEET,
      PlayHeadType.CHORD,
      this.projectStore.getFirstChordForSheet()
    );
    this.scheduler.pushPlayHead(playHead);
    this.scheduler.start();
  }

  public playStaff(staffIndex: StaffIndex) {
    if (!this.projectStore) {
      throw new Error('Must call setProjectStore before other Audio methods.');
    }
    const chord = this.projectStore.getFirstChordForStaff(staffIndex);
    if (!chord) {
      return;
    }
    const playHead = new PlayHead(
      this.context,
      this.projectStore,
      this.instruments.piano,
      EndCondition.END_OF_STAFF,
      PlayHeadType.CHORD,
      chord
    );
    this.scheduler.pushPlayHead(playHead);
    this.scheduler.start();
  }

  public playChord(chordId: ChordId) {
    if (!this.projectStore) {
      throw new Error('Must call setProjectStore before other Audio methods.');
    }
    const chord = this.projectStore.getChordById(chordId);
    if (!chord) {
      return;
    }
    const playHead = new PlayHead(
      this.context,
      this.projectStore,
      this.instruments.piano,
      EndCondition.END_OF_CHORD,
      PlayHeadType.CHORD,
      chord
    );
    this.scheduler.pushPlayHead(playHead);
    this.scheduler.start();
  }

  public playAccidentalSample(accidentalId: AccidentalId) {
    if (!this.projectStore) {
      throw new Error('Must call setProjectStore before other Audio methods.');
    }
    const accidental = this.projectStore.getElementById(
      accidentalId
    )! as AccidentalSpec;
    const playHead = new PlayHead(
      this.context,
      this.projectStore,
      this.instruments.piano,
      EndCondition.END_OF_CHORD,
      PlayHeadType.SAMPLE_NOTE,
      undefined,
      accidental
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
