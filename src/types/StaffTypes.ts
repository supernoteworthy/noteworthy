import { AccidentalSpec } from './AccidentalTypes';
import { ClefType } from './ClefTypes';
import { NoteSpec } from './NoteTypes';
import { RepeatSpec } from './RepeatTypes';

export type StaffIndex = number;

export interface StaffSpec {
  index: StaffIndex;
  clef?: ClefType;
  octave: number;
}

export type ElementId = string;
export type StaffElement = NoteSpec | AccidentalSpec | RepeatSpec;
