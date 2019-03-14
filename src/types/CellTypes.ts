import { StaffIndex } from './StaffTypes';

export type CellId = string;

export interface CellSpec {
  id: CellId;
  staffIndex: StaffIndex;
  x: number;
}
