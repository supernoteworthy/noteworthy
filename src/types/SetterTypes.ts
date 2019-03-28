import { ElementId, StaffIndex } from './StaffTypes';

export type SetterId = ElementId;

export enum SetterType {
  VOLUME,
  OCTAVE,
  INSTRUMENT,
  BPM
}

export interface SetterSpec {
  kind: 'setter';
  id: SetterId;
  type: SetterType;
  x: number;
  y: 0;
  staffIndex?: StaffIndex;
  nextElement?: ElementId;
  value?: number | string;
}

export const setterDefaults = {
  [SetterType.VOLUME]: 100,
  [SetterType.OCTAVE]: 3,
  [SetterType.INSTRUMENT]: 'Piano',
  [SetterType.BPM]: 120
};
