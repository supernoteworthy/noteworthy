import { ClefType } from './ClefTypes';

export type StaffIndex = number;

export interface StaffSpec {
  index: StaffIndex;
  clef?: ClefType;
  octave: number;
}
