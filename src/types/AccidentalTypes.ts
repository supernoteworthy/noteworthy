import { ElementId, StaffIndex } from './StaffTypes';

type AccidentalId = ElementId;

export enum AccidentalType {
  FLAT,
  SHARP,
  NATURAL
}

export interface AccidentalSpec {
  kind: 'accidental';
  id: AccidentalId;
  type: AccidentalType;
  x: number;
  y: number;
  staffIndex?: StaffIndex;
}
