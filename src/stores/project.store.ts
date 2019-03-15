import { action, computed, observable } from 'mobx';
import { createTransformer } from 'mobx-utils';
import { CHORD_GUIDELINE_WIDTH } from '../constants';
import { CellId, CellSpec } from '../types/CellTypes';
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
  addNote(newNote: NoteSpec, cell?: CellSpec) {
    this.noteList.push(newNote);
    if (cell) {
      this.cellList.push(cell);
    }
  }

  findAdjacentCell(x: number, staffIndex: StaffIndex, excludeCell?: CellId) {
    const staffCells = this.cellList.filter(
      cell => cell.staffIndex === staffIndex
    );
    return staffCells.find(
      cell =>
        cell.id !== excludeCell &&
        x > cell.x - CHORD_GUIDELINE_WIDTH / 2 &&
        x < cell.x + CHORD_GUIDELINE_WIDTH / 2
    );
  }

  @computed get getNotesForStaff() {
    return createTransformer(staffIndex =>
      this.noteList.filter(note => {
        const cell = this.getCellById(note.cellId);
        if (cell) {
          return cell.staffIndex === staffIndex;
        }
      })
    );
  }

  getCellsForStaff(staffIndex: StaffIndex) {
    return this.cellList.filter(cell => cell.staffIndex === staffIndex);
  }

  @computed get getNoteById() {
    return createTransformer(noteId =>
      this.noteList.find(note => note.id === noteId)
    );
  }

  getNotesForCell(id: CellId) {
    return this.noteList.filter(note => note.cellId === id);
  }

  getCellById(id?: CellId) {
    return this.cellList.find(cell => cell.id === id);
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
    const cell = this.getCellById(note.cellId)!;
    cell.x = x;
    const dy = y - note.y;
    for (let cellNote of this.getNotesForCell(note.cellId!)) {
      cellNote.y += dy;
    }
    if (staffIndex !== undefined) {
      cell.staffIndex = staffIndex;
    }
  }

  @action updateNoteCell(id: NoteId, newCell: CellId) {
    const note = this.getNoteById(id)!;
    if (newCell && note.cellId) {
      note.cellId = newCell;
    }
    this.dropEmptyCells();
  }

  dropEmptyCells() {
    this.cellList = this.cellList.filter(cell =>
      this.noteList.find(note => note.cellId === cell.id)
    );
  }

  @action deleteCell(id: CellId) {
    const cell = this.getCellById(id);
    const notes = this.getNotesForCell(id);
    notes.forEach(note => this.deleteNote(note.id));
    this.dropEmptyCells();
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
