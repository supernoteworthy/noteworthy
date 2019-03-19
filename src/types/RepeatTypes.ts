import { ElementId, StaffIndex } from './StaffTypes';

export type RepeatId = ElementId;
export interface RepeatSpec {
  kind: 'repeat';
  id: RepeatId;
  x: number;
  y: 0;
  staffIndex: StaffIndex;
}
