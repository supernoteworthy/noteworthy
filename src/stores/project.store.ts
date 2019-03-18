import { action, computed, observable } from 'mobx';
import { createTransformer } from 'mobx-utils';
import { CHORD_GUIDELINE_WIDTH } from '../constants';
import { ChordId, ChordSpec } from '../types/ChordTypes';
import { ClefType } from '../types/ClefTypes';
import { NoteId, NoteSpec } from '../types/NoteTypes';
import { StaffIndex, StaffSpec } from '../types/StaffTypes';

export class ProjectStore {
  @observable staffList: StaffSpec[] = [
    { index: 0, clef: ClefType.TREBLE, octave: 4 },
    { index: 1, octave: 4 },
    { index: 2, octave: 4 },
    { index: 3, octave: 4 },
    { index: 4, octave: 4 },
    { index: 5, octave: 4 },
    { index: 6, octave: 4 },
    { index: 7, octave: 4 }
  ];
  @observable noteList: NoteSpec[] = [];
  @observable chordList: ChordSpec[] = [];

  @action
  addNote(newNote: NoteSpec, chord?: ChordSpec) {
    this.noteList.push(newNote);
    if (chord) {
      this.chordList.push(chord);
    }
  }

  findAdjacentChord(x: number, staffIndex: StaffIndex, excludeChord?: ChordId) {
    const staffChords = this.chordList.filter(
      chord => chord.staffIndex === staffIndex
    );
    return staffChords.find(
      chord =>
        chord.id !== excludeChord &&
        x > chord.x - CHORD_GUIDELINE_WIDTH / 2 &&
        x < chord.x + CHORD_GUIDELINE_WIDTH / 2
    );
  }

  @computed get getNotesForStaff() {
    return createTransformer(staffIndex =>
      this.noteList.filter(note => {
        const chord = this.getChordById(note.chordId);
        if (chord) {
          return chord.staffIndex === staffIndex;
        }
      })
    );
  }

  getOctaveForNote(noteId: NoteId) {
    const { chordId } = this.getNoteById(noteId)!;
    const { staffIndex } = this.getChordById(chordId)!;
    const staff = this.staffList[staffIndex];
    return staff.octave;
  }

  getChordsForStaff(staffIndex: StaffIndex) {
    return this.chordList.filter(chord => chord.staffIndex === staffIndex);
  }

  @computed get getNoteById() {
    return createTransformer(noteId =>
      this.noteList.find(note => note.id === noteId)
    );
  }

  getNotesForChord(id: ChordId) {
    return this.noteList.filter(note => note.chordId === id);
  }

  getChordById(id?: ChordId) {
    return this.chordList.find(chord => chord.id === id);
  }

  @action setNotePosition(
    id: NoteId,
    x: number,
    y: number,
    staffIndex?: StaffIndex
  ) {
    const note = this.getNoteById(id);
    if (!note) {
      throw new Error(`Could not find note ${id} in setNotePosition.`);
    }
    const chord = this.getChordById(note.chordId)!;
    chord.x = x;
    const dy = y - note.y;
    for (let chordNote of this.getNotesForChord(note.chordId!)) {
      chordNote.y += dy;
    }
    if (staffIndex !== undefined) {
      chord.staffIndex = staffIndex;
    }
  }

  @action setOctave(staffIndex: StaffIndex, newOctave: number) {
    this.staffList[staffIndex].octave = newOctave;
  }

  @action updateNoteChord(id: NoteId, newChord: ChordId) {
    const note = this.getNoteById(id)!;
    if (newChord && note.chordId) {
      note.chordId = newChord;
    }
    this.dropEmptyChords();
  }

  dropEmptyChords() {
    this.chordList = this.chordList.filter(chord =>
      this.noteList.find(note => note.chordId === chord.id)
    );
  }

  @action deleteChord(id: ChordId) {
    const notes = this.getNotesForChord(id);
    notes.forEach(note => this.deleteNote(note.id));
    this.dropEmptyChords();
  }

  @action deleteNote(id: NoteId) {
    const note = this.getNoteById(id);
    if (!note) {
      throw new Error(`Could not find note ${id} in deleteNote.`);
    }
    this.noteList.splice(this.noteList.indexOf(note), 1);
  }

  @action setNotePlaying(id: NoteId, isPlaying: boolean) {
    const note = this.getNoteById(id);
    if (!note) {
      return;
    }
    note.isPlaying = isPlaying;
  }
}
