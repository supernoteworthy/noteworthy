import { AccidentalSpec } from './AccidentalTypes';
import { BlockSpec } from './BlockTypes';
import { ChordSpec } from './ChordTypes';
import { ClefType } from './ClefTypes';
import { NoteSpec } from './NoteTypes';
import { RepeatSpec } from './RepeatTypes';
import { SetterSpec } from './SetterTypes';

export type StaffIndex = number;

export interface StaffSpec {
  index: StaffIndex;
  clef?: ClefType;
  octave: number;
}

export type ElementId = string;
export type StaffElement =
  | NoteSpec
  | AccidentalSpec
  | RepeatSpec
  | ChordSpec
  | SetterSpec
  | BlockSpec;
