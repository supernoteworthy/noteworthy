import { ChordSpec } from './ChordTypes';
import { ElementId, StaffElement } from './StaffTypes';

export type SheetId = string;

export interface SheetSpec {
  id: SheetId;
  label: string;
  instrumentName: string;
  staffCount: number;
  elementList: StaffElement[];
  chordList: ChordSpec[];
  firstElement?: ElementId;
}
