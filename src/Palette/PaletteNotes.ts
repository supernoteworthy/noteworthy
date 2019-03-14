import { NoteLength, NoteType } from '../types/NoteTypes';
export const PALETTE_NOTES = [
  {
    id: 'DOUBLE_WHOLE',
    type: NoteType.TONE,
    length: NoteLength.DOUBLEWHOLE,
    x: 30,
    y: 40,
    isPlaying: false
  },
  {
    id: 'WHOLE',
    type: NoteType.TONE,
    length: NoteLength.WHOLE,
    x: 90,
    y: 40,
    isPlaying: false
  },
  {
    id: 'HALF',
    type: NoteType.TONE,
    length: NoteLength.HALF,
    x: 30,
    y: 120,
    isPlaying: false
  },
  {
    id: 'QUARTER',
    type: NoteType.TONE,
    length: NoteLength.QUARTER,
    x: 90,
    y: 120,
    isPlaying: false
  },
  {
    id: 'EIGHTH',
    type: NoteType.TONE,
    length: NoteLength.EIGHTH,
    x: 30,
    y: 200,
    isPlaying: false
  },
  {
    id: 'SIXTEENTH',
    type: NoteType.TONE,
    length: NoteLength.SIXTEENTH,
    x: 90,
    y: 200,
    isPlaying: false
  },

  {
    id: 'REST_DOUBLEWHOLE',
    type: NoteType.REST,
    length: NoteLength.DOUBLEWHOLE,
    x: 30,
    y: 280,
    isPlaying: false
  },
  {
    id: 'REST_WHOLE',
    type: NoteType.REST,
    length: NoteLength.WHOLE,
    x: 90,
    y: 280,
    isPlaying: false
  },
  {
    id: 'REST_HALF',
    type: NoteType.REST,
    length: NoteLength.HALF,
    x: 150,
    y: 280,
    isPlaying: false
  },
  {
    id: 'REST_QUARTER',
    type: NoteType.REST,
    length: NoteLength.QUARTER,
    x: 30,
    y: 360,
    isPlaying: false
  },
  {
    id: 'REST_EIGHTH',
    type: NoteType.REST,
    length: NoteLength.EIGHTH,
    x: 90,
    y: 360,
    isPlaying: false
  },
  {
    id: 'REST_SIXTEENTH',
    type: NoteType.REST,
    length: NoteLength.SIXTEENTH,
    x: 150,
    y: 360,
    isPlaying: false
  }
];
