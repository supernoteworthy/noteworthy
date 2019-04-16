import { AccidentalSpec } from './AccidentalTypes';
import { ChordSpec } from './ChordTypes';
import { NoteSpec } from './NoteTypes';
import { RepeatSpec } from './RepeatTypes';
import { SetterSpec } from './SetterTypes';

export type StaffIndex = number;

export type ElementId = string;
export type StaffElement =
  | NoteSpec
  | AccidentalSpec
  | RepeatSpec
  | ChordSpec
  | SetterSpec;
