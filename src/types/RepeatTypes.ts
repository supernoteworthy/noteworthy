import { ElementId, StaffIndex } from './StaffTypes';

export type RepeatId = ElementId;
export enum RepeatType {
  START,
  END
}
export interface RepeatSpec {
  kind: 'repeat';
  id: RepeatId;
  x: number;
  y: 0;
  type: RepeatType;
  staffIndex?: StaffIndex;
  nRepeats: string;
}
