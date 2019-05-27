import { action, observable } from 'mobx';
import uuid from 'uuid/v4';
import {
  CHORD_GUIDELINE_WIDTH,
  KEY_SIGNATURE_GUIDELINE_X,
  MINIMUM_STAFF_COUNT
} from '../constants';
import { AccidentalSpec, AccidentalType } from '../types/AccidentalTypes';
import { ChordId, ChordSpec } from '../types/ChordTypes';
import { NoteId, NoteSpec } from '../types/NoteTypes';
import { MatchType, RepeatSpec } from '../types/RepeatTypes';
import { SetterSpec, SetterType } from '../types/SetterTypes';
import { SheetId, SheetSpec } from '../types/SheetTypes';
import { ElementId, StaffElement, StaffIndex } from '../types/StaffTypes';

export class ProjectStore {
  @observable sheetList: SheetSpec[] = [
    {
      id: 'abc',
      label: 'Piano',
      instrumentName: 'Piano',
      staffCount: 10,
      elementList: [],
      chordList: []
    }
  ];

  @action addSheet(instrumentName: string) {
    const id = uuid();
    this.sheetList.push({
      id,
      label: this.getUniqueLabelForSheet(instrumentName),
      instrumentName,
      staffCount: MINIMUM_STAFF_COUNT,
      elementList: [],
      chordList: []
    });
    return id;
  }

  @action removeSheet(sheetId: SheetId) {
    this.sheetList = this.sheetList.filter(sheet => sheet.id !== sheetId);
  }

  private getUniqueLabelForSheet(instrumentName: string) {
    const instrumentCount = this.sheetList.filter(
      sheet => sheet.instrumentName === instrumentName
    ).length;
    if (instrumentCount === 0) {
      return instrumentName;
    }
    return `${instrumentName} ${instrumentCount + 1}`;
  }

  public getSheet(sheetId: SheetId) {
    return this.sheetList.find(sheet => sheet.id === sheetId);
  }

  public getAdjacentSheets(
    sheetId: SheetId
  ): { prevSheet: SheetId | null; nextSheet: SheetId | null } {
    let prevSheet = null;
    let nextSheet = null;

    for (let i = 0; i < this.sheetList.length; i++) {
      if (this.sheetList[i].id === sheetId) {
        if (i !== 0) {
          prevSheet = this.sheetList[i - 1].id;
        }
        if (i + 1 !== this.sheetList.length) {
          nextSheet = this.sheetList[i + 1].id;
        }
        break;
      }
    }

    return { prevSheet, nextSheet };
  }

  getFirstElementId(sheetId: SheetId) {
    const sheet = this.getSheet(sheetId);
    if (sheet) {
      return sheet.firstElement;
    }
  }

  @action
  addElement(sheetId: SheetId, newElement: StaffElement, chord?: ChordSpec) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return;
    }
    sheet.elementList.push(newElement);
    if (chord) {
      sheet.chordList.push(chord);
    }
    this.updateNextElements(sheetId);
    this.updateMatchElements(sheetId);
  }

  findAdjacentChord(
    sheetId: SheetId,
    x: number,
    staffIndex: StaffIndex,
    excludeChord?: ChordId
  ) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return;
    }
    const staffChords = sheet.chordList.filter(
      chord => chord.staffIndex === staffIndex
    );
    return staffChords.find(
      chord =>
        chord.id !== excludeChord &&
        x > chord.x - CHORD_GUIDELINE_WIDTH / 2 &&
        x < chord.x + CHORD_GUIDELINE_WIDTH / 2
    );
  }

  getElementsForStaff(sheetId: SheetId, staffIndex: StaffIndex) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return [];
    }
    return sheet.elementList.filter(el => {
      if (el.kind === 'note') {
        const chord = this.getChordById(sheetId, el.chordId);
        if (chord) {
          return chord.staffIndex === staffIndex;
        }
      } else {
        return el.staffIndex === staffIndex;
      }
      return false;
    });
  }

  getGreatestStaffIndexForSheet(sheetId: SheetId) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return -1;
    }
    let greatestStaffIndex = -1;
    for (let element of sheet.elementList) {
      if (
        element.kind !== 'note' &&
        element.staffIndex !== undefined &&
        element.staffIndex > greatestStaffIndex
      ) {
        greatestStaffIndex = element.staffIndex;
      }
    }
    for (let chord of sheet.chordList) {
      if (
        chord.staffIndex !== undefined &&
        chord.staffIndex > greatestStaffIndex
      ) {
        greatestStaffIndex = chord.staffIndex;
      }
    }
    return greatestStaffIndex;
  }

  getKeySignatureForNote(sheetId: SheetId, id: NoteId) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return AccidentalType.NATURAL;
    }
    const note = this.getElementById(sheetId, id);
    if (!note || note.kind !== 'note') {
      return AccidentalType.NATURAL;
    }
    const accidentals = sheet.elementList.filter(
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

  getElementById(sheetId: SheetId, elementId: ElementId) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return undefined;
    }
    return (
      sheet.elementList.find(
        (element: StaffElement) => element.id === elementId
      ) || sheet.chordList.find(chord => chord.id === elementId)
    );
  }

  getNotesForChord(sheetId: SheetId, id: ChordId) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return [];
    }
    return sheet.elementList.filter(
      note => note.kind === 'note' && note.chordId === id
    ) as NoteSpec[];
  }

  getChordById(sheetId: SheetId, id?: ChordId) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return undefined;
    }
    return sheet.chordList.find(chord => chord.id === id);
  }

  @action setElementPosition(
    sheetId: SheetId,
    id: ElementId,
    x: number,
    y: number,
    staffIndex?: StaffIndex
  ) {
    const el = this.getElementById(sheetId, id);
    if (!el) {
      throw new Error(`Could not find element ${id} in setNotePosition.`);
    }
    if (el.kind === 'chord') {
      throw new Error('Unimplemented: set chord position');
    }
    const dy = y - el.y;
    if (el.kind === 'note') {
      const chord = this.getChordById(sheetId, el.chordId)!;
      chord.x = x;
      if (staffIndex !== undefined) {
        chord.staffIndex = staffIndex;
      }
      for (let chordNote of this.getNotesForChord(sheetId, el.chordId!)) {
        chordNote.y += dy;
      }
    } else {
      el.x = x;
      el.y = y;
      if (staffIndex !== undefined) {
        el.staffIndex = staffIndex;
      }
    }
    this.updateNextElements(sheetId);
    this.updateMatchElements(sheetId);
  }

  @action updateNoteChord(sheetId: SheetId, id: NoteId, newChord: ChordId) {
    const spec = this.getElementById(sheetId, id)!;
    if (spec.kind === 'note' && newChord && spec.chordId) {
      spec.chordId = newChord;
    }
    this.dropEmptyChords(sheetId);
    this.updateNextElements(sheetId);
    this.updateMatchElements(sheetId);
  }

  dropEmptyChords(sheetId: SheetId) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return;
    }
    sheet.chordList = sheet.chordList.filter(chord =>
      sheet.elementList.find(
        el => el.kind === 'note' && el.chordId === chord.id
      )
    );
  }

  @action deleteElement(sheetId: SheetId, id: ElementId) {
    const spec = this.getElementById(sheetId, id);
    if (spec && spec.kind === 'note') {
      const notes = this.getNotesForChord(sheetId, spec.chordId!);
      notes.forEach(note => this.spliceElement(sheetId, note.id));
      this.dropEmptyChords(sheetId);
    } else {
      this.spliceElement(sheetId, id);
    }
    this.updateNextElements(sheetId);
    this.updateMatchElements(sheetId);
  }

  @action spliceElement(sheetId: SheetId, id: ElementId) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return;
    }
    const element = this.getElementById(sheetId, id);
    if (!element) {
      throw new Error(`Could not find element ${id} in spliceElement.`);
    }
    sheet.elementList.splice(sheet.elementList.indexOf(element), 1);
  }

  @action setNotePlaying(sheetId: SheetId, id: NoteId, isPlaying: boolean) {
    const note = this.getElementById(sheetId, id);
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

  private updateNextElements(sheetId: SheetId) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return;
    }
    type Sortable = ChordSpec | AccidentalSpec | RepeatSpec;
    const inOrder: Sortable[] = [
      ...sheet.chordList,
      ...sheet.elementList.filter(el => el.kind !== 'note')
    ] as Sortable[];

    if (inOrder.length === 0) {
      return;
    }

    inOrder.sort(this.elementCompare);

    sheet.firstElement = inOrder[0].id;
    let previous = inOrder[0];
    inOrder.forEach(item => {
      if (item.id !== sheet.firstElement) {
        previous.nextElement = item.id;
      }
      previous = item;
    });
    inOrder[inOrder.length - 1].nextElement = undefined;
  }

  private updateMatchElements(sheetId: SheetId) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return;
    }
    type Matchable = RepeatSpec;
    const inOrder: Matchable[] = sheet.elementList.filter(
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

  public getBacktrackSetter(
    sheetId: SheetId,
    type: SetterType,
    elementId: ElementId
  ) {
    const sheet = this.getSheet(sheetId);
    if (!sheet) {
      return;
    }
    let element = this.getElementById(sheetId, elementId) as
      | ChordSpec
      | AccidentalSpec;
    const setters = sheet.elementList.filter(setter => {
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
          return sheet.instrumentName;
        case SetterType.OCTAVE:
          return 4;
        case SetterType.VOLUME:
          return 100;
      }
    }
    return setters[setters.length - 1].value;
  }
}
