import { ChordId } from './ChordTypes';
import { ElementId } from './StaffTypes';

export type NoteId = ElementId;

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
  kind: 'note';
  id: NoteId;
  type: NoteType;
  length: NoteLength;
  chordId?: ChordId;
  y: number;
  isPlaying: boolean;
  nextElement: undefined; // Note's next is set in chord.
}
