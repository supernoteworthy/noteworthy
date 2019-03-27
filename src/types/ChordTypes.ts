import { ElementId, StaffIndex } from './StaffTypes';

export type ChordId = ElementId;

export interface ChordSpec {
  kind: 'chord';
  id: ChordId;
  staffIndex: StaffIndex;
  x: number;
  y: 0;
  nextElement?: ElementId;
}
