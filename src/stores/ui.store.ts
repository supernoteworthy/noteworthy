import { computed, observable } from 'mobx';
import { ChordSpec } from '../types/ChordTypes';
import { NoteSpec } from '../types/NoteTypes';
import { StaffIndex } from '../types/StaffTypes';

export enum MouseMode {
  INSERT,
  DRAG,
  OCTAVE_SELECT
}

export class UiStore {
  @observable mouseMode = MouseMode.INSERT;
  @observable cursorSpec?: NoteSpec;
  @observable sheetWidth: number = 0;

  /* Drag mode */
  @observable dragNoteId?: string;
  @observable dragStartX?: number;
  @observable dragStartY?: number;
  @observable dragStartStaffIndex?: StaffIndex;
  @observable dragStartClientX?: number;
  @observable dragStartClientY?: number;
  @observable dragActiveStaffIndex?: StaffIndex;

  /* Insert mode */
  @observable insertX: number = 0;
  @observable insertY: number = 0;
  @observable insertStaffId: StaffIndex = 0;
  @observable insertStaffX: number = 0;
  @observable insertStaffY: number = 0;

  @observable activeChord?: ChordSpec;

  @computed get activeStaff() {
    if (this.mouseMode === MouseMode.INSERT) {
      return this.insertStaffId;
    }
    if (this.mouseMode === MouseMode.DRAG) {
      return this.dragActiveStaffIndex;
    }
  }
}
