import { NoteLength, NoteType, PaletteNoteSpec } from '../types/NoteTypes';
export const PALETTE_NOTES = [
  {
    kind: 'note',
    id: 'DOUBLE_WHOLE',
    type: NoteType.TONE,
    length: NoteLength.DOUBLEWHOLE,
    x: 0,
    y: 40,
    isPlaying: false,
    tooltip: 'Double whole (8)'
  } as PaletteNoteSpec,
  {
    kind: 'note',
    id: 'WHOLE',
    type: NoteType.TONE,
    length: NoteLength.WHOLE,
    x: 3,
    y: 80,
    isPlaying: false,
    tooltip: 'Whole (4)'
  } as PaletteNoteSpec,
  {
    kind: 'note',
    id: 'HALF',
    type: NoteType.TONE,
    length: NoteLength.HALF,
    x: 0,
    y: 160,
    isPlaying: false,
    tooltip: 'Half (2)'
  } as PaletteNoteSpec,
  {
    kind: 'note',
    id: 'QUARTER',
    type: NoteType.TONE,
    length: NoteLength.QUARTER,
    x: 0,
    y: 230,
    isPlaying: false,
    tooltip: 'Quarter (1)'
  } as PaletteNoteSpec,
  {
    kind: 'note',
    id: 'EIGHTH',
    type: NoteType.TONE,
    length: NoteLength.EIGHTH,
    x: 0,
    y: 310,
    isPlaying: false,
    tooltip: 'Eighth (1/2)'
  } as PaletteNoteSpec,
  {
    kind: 'note',
    id: 'SIXTEENTH',
    type: NoteType.TONE,
    length: NoteLength.SIXTEENTH,
    x: 0,
    y: 390,
    isPlaying: false,
    tooltip: 'Sixteenth (1/4)'
  } as PaletteNoteSpec,

  {
    kind: 'note',
    id: 'REST_DOUBLEWHOLE',
    type: NoteType.REST,
    length: NoteLength.DOUBLEWHOLE,
    x: 0,
    y: 420,
    isPlaying: false,
    tooltip: 'Double whole rest (8)'
  } as PaletteNoteSpec,
  {
    kind: 'note',
    id: 'REST_WHOLE',
    type: NoteType.REST,
    length: NoteLength.WHOLE,
    x: 0,
    y: 460,
    isPlaying: false,
    tooltip: 'Whole rest (4)'
  } as PaletteNoteSpec,
  {
    kind: 'note',
    id: 'REST_HALF',
    type: NoteType.REST,
    length: NoteLength.HALF,
    x: 0,
    y: 500,
    isPlaying: false,
    tooltip: 'Half rest (2)'
  } as PaletteNoteSpec,
  {
    kind: 'note',
    id: 'REST_QUARTER',
    type: NoteType.REST,
    length: NoteLength.QUARTER,
    x: 0,
    y: 550,
    isPlaying: false,
    tooltip: 'Quarter rest (1)'
  } as PaletteNoteSpec,
  {
    kind: 'note',
    id: 'REST_EIGHTH',
    type: NoteType.REST,
    length: NoteLength.EIGHTH,
    x: 10,
    y: 610,
    isPlaying: false,
    tooltip: 'Eighth rest (1/2)'
  } as PaletteNoteSpec,
  {
    kind: 'note',
    id: 'REST_SIXTEENTH',
    type: NoteType.REST,
    length: NoteLength.SIXTEENTH,
    x: 10,
    y: 670,
    isPlaying: false,
    tooltip: 'Sixteenth rest (1/16)'
  } as PaletteNoteSpec
];
