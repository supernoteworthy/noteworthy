import { StaffIndex } from './StaffTypes';

export type NoteId = string;

export enum NoteLength {
  SIXTEENTH,
  EIGHTH,
  QUARTER,
  HALF,
  WHOLE,
  DOUBLEWHOLE
}

export enum NoteType {
  TONE,
  REST
}

export enum NoteOrientation {
  UP,
  DOWN
}

export interface NoteSpec {
  id: NoteId;
  type: NoteType;
  length: NoteLength;
  staffIndex?: StaffIndex;
  x: number;
  y: number;
  isPlaying: boolean;
}
