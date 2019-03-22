import { action, computed, observable } from 'mobx';
import { createTransformer } from 'mobx-utils';
import { CHORD_GUIDELINE_WIDTH } from '../constants';
import {
  AccidentalId,
  AccidentalSpec,
  AccidentalType
} from '../types/AccidentalTypes';
import { ChordId, ChordSpec } from '../types/ChordTypes';
import { ClefType } from '../types/ClefTypes';
import { NoteId, NoteSpec } from '../types/NoteTypes';
import {
  ElementId,
  StaffElement,
  StaffIndex,
  StaffSpec
} from '../types/StaffTypes';

export class ProjectStore {
  @observable bpm = 100;
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
  @observable elementList: StaffElement[] = [];
  @observable chordList: ChordSpec[] = [];

  @action
  addElement(newElement: StaffElement, chord?: ChordSpec) {
    this.elementList.push(newElement);
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

  @computed get getElementsForStaff() {
    return createTransformer(staffIndex =>
      this.elementList.filter(el => {
        if (el.kind === 'note') {
          const chord = this.getChordById(el.chordId);
          if (chord) {
            return chord.staffIndex === staffIndex;
          }
        } else {
          return el.staffIndex === staffIndex;
        }
      })
    );
  }

  getOctaveForNote(noteId: NoteId) {
    const { chordId } = this.getElementById(noteId)! as NoteSpec;
    const { staffIndex } = this.getChordById(chordId)!;
    const staff = this.staffList[staffIndex];
    return staff.octave;
  }

  getOctaveForAccidental(accidentalId: AccidentalId) {
    const { staffIndex } = this.getElementById(accidentalId) as AccidentalSpec;
    const staff = this.staffList[staffIndex!];
    return staff.octave;
  }

  getAccidentalForNote(id: NoteId) {
    const note = this.getElementById(id);
    if (!note || note.kind !== 'note') {
      return AccidentalType.NATURAL;
    }
    const chord = this.getChordById(note.chordId);
    if (!chord) {
      return AccidentalType.NATURAL;
    }
    const accidentals = this.elementList.filter(
      element =>
        element.y === note.y &&
        element.kind === 'accidental' &&
        element.staffIndex === chord.staffIndex &&
        element.x < chord.x
    ) as AccidentalSpec[];
    accidentals.sort((a, b) => b.x - a.x);
    if (accidentals.length > 0) {
      return accidentals[0].type;
    }
    return AccidentalType.NATURAL;
  }

  getChordsForStaff(staffIndex: StaffIndex) {
    return this.chordList.filter(chord => chord.staffIndex === staffIndex);
  }

  @computed get getElementById() {
    return createTransformer(elementId =>
      this.elementList.find(element => element.id === elementId)
    );
  }

  getNotesForChord(id: ChordId) {
    return this.elementList.filter(
      note => note.kind === 'note' && note.chordId === id
    ) as NoteSpec[];
  }

  getChordById(id?: ChordId) {
    return this.chordList.find(chord => chord.id === id);
  }

  @action setElementPosition(
    id: ElementId,
    x: number,
    y: number,
    staffIndex?: StaffIndex
  ) {
    const el = this.getElementById(id);
    if (!el) {
      throw new Error(`Could not find element ${id} in setNotePosition.`);
    }
    const dy = y - el.y;
    if (el.kind === 'note') {
      const chord = this.getChordById(el.chordId)!;
      chord.x = x;
      if (staffIndex !== undefined) {
        chord.staffIndex = staffIndex;
      }
      for (let chordNote of this.getNotesForChord(el.chordId!)) {
        chordNote.y += dy;
      }
    } else {
      el.x = x;
      el.y = y;
      if (staffIndex !== undefined) {
        el.staffIndex = staffIndex;
      }
    }
  }

  @action setOctave(staffIndex: StaffIndex, newOctave: number) {
    this.staffList[staffIndex].octave = newOctave;
  }

  @action updateNoteChord(id: NoteId, newChord: ChordId) {
    const spec = this.getElementById(id)!;
    if (spec.kind === 'note' && newChord && spec.chordId) {
      spec.chordId = newChord;
    }
    this.dropEmptyChords();
  }

  dropEmptyChords() {
    this.chordList = this.chordList.filter(chord =>
      this.elementList.find(el => el.kind === 'note' && el.chordId === chord.id)
    );
  }

  @action deleteElement(id: ElementId) {
    const spec = this.getElementById(id);
    if (spec && spec.kind === 'note') {
      const notes = this.getNotesForChord(spec.chordId!);
      notes.forEach(note => this.spliceElement(note.id));
      this.dropEmptyChords();
    } else {
      this.spliceElement(id);
    }
  }

  @action spliceElement(id: ElementId) {
    const note = this.getElementById(id);
    if (!note) {
      throw new Error(`Could not find element ${id} in deleteElement.`);
    }
    this.elementList.splice(this.elementList.indexOf(note), 1);
  }

  @action setNotePlaying(id: NoteId, isPlaying: boolean) {
    const note = this.getElementById(id);
    if (!note || note.kind !== 'note') {
      return;
    }
    note.isPlaying = isPlaying;
  }
}
