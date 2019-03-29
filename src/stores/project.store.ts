import { action, computed, observable } from 'mobx';
import { createTransformer } from 'mobx-utils';
import { CHORD_GUIDELINE_WIDTH, KEY_SIGNATURE_GUIDELINE_X } from '../constants';
import { AccidentalSpec, AccidentalType } from '../types/AccidentalTypes';
import { ChordId, ChordSpec } from '../types/ChordTypes';
import { ClefType } from '../types/ClefTypes';
import { NoteId, NoteSpec } from '../types/NoteTypes';
import { MatchType, RepeatSpec } from '../types/RepeatTypes';
import { SetterSpec, SetterType } from '../types/SetterTypes';
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
  firstElement?: ElementId;

  @action
  addElement(newElement: StaffElement, chord?: ChordSpec) {
    this.elementList.push(newElement);
    if (chord) {
      this.chordList.push(chord);
    }
    this.updateNextElements();
    this.updateMatchElements();
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

  getOctaveForElement(elementId: ElementId) {
    const element = this.getElementById(elementId)!;
    let staffIndex;
    if (element.kind === 'note') {
      staffIndex = this.getChordById(element.chordId)!.staffIndex;
    } else if (element.kind === 'accidental') {
      staffIndex = element.staffIndex;
    }
    if (staffIndex === undefined) {
      return 0;
    }
    const staff = this.staffList[staffIndex];
    return staff.octave;
  }

  getKeySignatureForNote(id: NoteId) {
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
        element.kind === 'accidental' &&
        element.y === note.y &&
        element.x <= KEY_SIGNATURE_GUIDELINE_X
    ) as AccidentalSpec[];
    accidentals.sort(this.elementCompare);
    if (accidentals.length > 0) {
      return accidentals[accidentals.length - 1].type;
    }
    return AccidentalType.NATURAL;
  }

  @computed get getElementById() {
    return createTransformer(
      (elementId: ElementId) =>
        this.elementList.find(
          (element: StaffElement) => element.id === elementId
        ) || this.chordList.find(chord => chord.id === elementId)
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
    if (el.kind === 'chord') {
      throw new Error('Unimplemented: set chord position');
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
    this.updateNextElements();
    this.updateMatchElements();
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
    this.updateNextElements();
    this.updateMatchElements();
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
    this.updateNextElements();
    this.updateMatchElements();
  }

  @action spliceElement(id: ElementId) {
    const element = this.getElementById(id);
    if (!element) {
      throw new Error(`Could not find element ${id} in spliceElement.`);
    }
    this.elementList.splice(this.elementList.indexOf(element), 1);
  }

  @action setNotePlaying(id: NoteId, isPlaying: boolean) {
    const note = this.getElementById(id);
    if (!note || note.kind !== 'note') {
      return;
    }
    note.isPlaying = isPlaying;
  }

  private elementCompare(
    a: ChordSpec | AccidentalSpec | RepeatSpec | SetterSpec,
    b: ChordSpec | AccidentalSpec | RepeatSpec | SetterSpec
  ) {
    if (a.staffIndex === undefined || b.staffIndex === undefined) {
      throw new Error('Element in project list without staff index');
    }
    if (a.staffIndex < b.staffIndex) {
      return -1;
    } else if (b.staffIndex < a.staffIndex) {
      return 1;
    }
    return a.x - b.x;
  }

  private updateNextElements() {
    type Sortable = ChordSpec | AccidentalSpec | RepeatSpec;
    const inOrder: Sortable[] = [
      ...this.chordList,
      ...this.elementList.filter(el => el.kind !== 'note')
    ] as Sortable[];

    if (inOrder.length === 0) {
      return;
    }

    inOrder.sort(this.elementCompare);

    this.firstElement = inOrder[0].id;
    let previous = inOrder[0];
    inOrder.forEach(item => {
      if (item.id !== this.firstElement) {
        previous.nextElement = item.id;
      }
      previous = item;
    });
    inOrder[inOrder.length - 1].nextElement = undefined;
  }

  private updateMatchElements() {
    type Matchable = RepeatSpec;
    const inOrder: Matchable[] = this.elementList.filter(
      el => el.kind === 'repeat'
    ) as RepeatSpec[];

    if (inOrder.length === 0) {
      return;
    }

    inOrder.sort(this.elementCompare);

    const stack = [];
    for (let el of inOrder) {
      if (el.type === MatchType.START) {
        stack.push(el);
      } else {
        if (stack.length > 0) {
          const match = stack.pop()!;
          match.matchElement = el.id;
          el.matchElement = match.id;
        } else {
          el.matchElement = undefined;
        }
      }
    }
  }

  public getBacktrackSetter(type: SetterType, elementId: ElementId) {
    let element = this.getElementById(elementId) as ChordSpec | AccidentalSpec;
    const setters = this.elementList.filter(setter => {
      if (
        setter.kind !== 'setter' ||
        setter.type !== type ||
        setter.staffIndex! > element.staffIndex!
      ) {
        return false;
      }
      if (setter.staffIndex! === element.staffIndex && setter.x > element.x) {
        return false;
      }
      return true;
    }) as SetterSpec[];
    setters.sort(this.elementCompare);
    if (setters.length === 0) {
      switch (type) {
        case SetterType.BPM:
          return 100;
        case SetterType.INSTRUMENT:
          return 'Piano';
        case SetterType.OCTAVE:
          return 4;
        case SetterType.VOLUME:
          return 100;
      }
    }
    return setters[setters.length - 1].value;
  }
}
