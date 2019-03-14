import { action, computed, observable } from 'mobx';
import { createTransformer } from 'mobx-utils';
import { CellSpec } from '../types/CellTypes';
import { ClefType } from '../types/ClefTypes';
import { NoteId, NoteSpec } from '../types/NoteTypes';
import { StaffIndex, StaffSpec } from '../types/StaffTypes';

export class ProjectStore {
  @observable staffList: StaffSpec[] = [
    { index: 0, clef: ClefType.TREBLE },
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 4 },
    { index: 5 },
    { index: 6 }
  ];
  @observable noteList: NoteSpec[] = [];
  @observable cellList: CellSpec[] = [];

  @action
  addNote(newNote: NoteSpec) {
    this.noteList.push(newNote);
  }

  @computed get getNotesForStaff() {
    return createTransformer(staffIndex =>
      this.noteList.filter(note => note.staffIndex === staffIndex)
    );
  }

  @computed get getNoteById() {
    return createTransformer(noteId =>
      this.noteList.find(note => note.id === noteId)
    );
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
    note.x = x;
    note.y = y;
    if (staffIndex !== undefined) {
      note.staffIndex = staffIndex;
    }
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
