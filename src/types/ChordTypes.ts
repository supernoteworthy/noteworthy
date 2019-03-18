import { StaffIndex } from './StaffTypes';

export type ChordId = string;

export interface ChordSpec {
  id: ChordId;
  staffIndex: StaffIndex;
  x: number;
}
