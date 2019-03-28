import { ElementId, StaffIndex } from './StaffTypes';

export type RepeatId = ElementId;
export enum MatchType {
  START,
  END
}
export interface RepeatSpec {
  kind: 'repeat';
  id: RepeatId;
  x: number;
  y: 0;
  type: MatchType;
  staffIndex?: StaffIndex;
  nRepeats?: number;
  nextElement?: ElementId;
  matchElement?: ElementId;
}
