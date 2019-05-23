import { computed, observable } from 'mobx';
import { ChordSpec } from '../types/ChordTypes';
import { SheetId } from '../types/SheetTypes';
import { ElementId, StaffElement, StaffIndex } from '../types/StaffTypes';

export enum MouseMode {
  INSERT,
  DRAG,
  POPOVER
}

export class UiStore {
  @observable mouseMode = MouseMode.INSERT;
  @observable cursorSpec?: StaffElement;
  @observable sheetWidth: number = 0;
  @observable sheetScroll: number = 0;

  /* Drag mode */
  @observable dragElementId?: ElementId;
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

  @observable activeSheet: SheetId = 'abc'; /// XXX

  @computed get activeStaff() {
    if (this.mouseMode === MouseMode.INSERT) {
      return this.insertStaffId;
    }
    if (this.mouseMode === MouseMode.DRAG) {
      return this.dragActiveStaffIndex;
    }
    return undefined;
  }
}
