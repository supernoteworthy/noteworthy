import { AccidentalType } from '../types/AccidentalTypes';
import { NoteLength, NoteType } from '../types/NoteTypes';
import { RepeatType } from '../types/RepeatTypes';
import { ElementId } from '../types/StaffTypes';

interface PaletteNoteSpec {
  kind: string;
  id: ElementId;
  type?: NoteType | AccidentalType | RepeatType;
  length?: NoteLength;
  x: number;
  y: number;
  tooltip: string;
}

export const PALETTE_NOTES: PaletteNoteSpec[] = [
  {
    kind: 'note',
    id: 'DOUBLE_WHOLE',
    type: NoteType.TONE,
    length: NoteLength.DOUBLEWHOLE,
    x: 0,
    y: 40,
    tooltip: 'Double whole (8)'
  },
  {
    kind: 'note',
    id: 'WHOLE',
    type: NoteType.TONE,
    length: NoteLength.WHOLE,
    x: 3,
    y: 80,
    tooltip: 'Whole (4)'
  },
  {
    kind: 'note',
    id: 'HALF',
    type: NoteType.TONE,
    length: NoteLength.HALF,
    x: 0,
    y: 160,
    tooltip: 'Half (2)'
  },
  {
    kind: 'note',
    id: 'QUARTER',
    type: NoteType.TONE,
    length: NoteLength.QUARTER,
    x: 0,
    y: 230,
    tooltip: 'Quarter (1)'
  },
  {
    kind: 'note',
    id: 'EIGHTH',
    type: NoteType.TONE,
    length: NoteLength.EIGHTH,
    x: 0,
    y: 310,
    tooltip: 'Eighth (1/2)'
  },
  {
    kind: 'note',
    id: 'SIXTEENTH',
    type: NoteType.TONE,
    length: NoteLength.SIXTEENTH,
    x: 0,
    y: 390,
    tooltip: 'Sixteenth (1/4)'
  },

  {
    kind: 'note',
    id: 'REST_DOUBLEWHOLE',
    type: NoteType.REST,
    length: NoteLength.DOUBLEWHOLE,
    x: 0,
    y: 420,
    tooltip: 'Double whole rest (8)'
  },
  {
    kind: 'note',
    id: 'REST_WHOLE',
    type: NoteType.REST,
    length: NoteLength.WHOLE,
    x: 0,
    y: 460,
    tooltip: 'Whole rest (4)'
  },
  {
    kind: 'note',
    id: 'REST_HALF',
    type: NoteType.REST,
    length: NoteLength.HALF,
    x: 0,
    y: 500,
    tooltip: 'Half rest (2)'
  },
  {
    kind: 'note',
    id: 'REST_QUARTER',
    type: NoteType.REST,
    length: NoteLength.QUARTER,
    x: 0,
    y: 550,
    tooltip: 'Quarter rest (1)'
  },
  {
    kind: 'note',
    id: 'REST_EIGHTH',
    type: NoteType.REST,
    length: NoteLength.EIGHTH,
    x: 5,
    y: 610,
    tooltip: 'Eighth rest (1/2)'
  },
  {
    kind: 'note',
    id: 'REST_SIXTEENTH',
    type: NoteType.REST,
    length: NoteLength.SIXTEENTH,
    x: 5,
    y: 670,
    tooltip: 'Sixteenth rest (1/16)'
  },
  {
    kind: 'repeat',
    id: 'REPEAT_START',
    type: RepeatType.START,
    x: 5,
    y: 760,
    tooltip: 'Repeat start'
  },
  {
    kind: 'repeat',
    id: 'REPEAT_END',
    type: RepeatType.END,
    x: 5,
    y: 860,
    tooltip: 'Repeat end'
  },
  {
    kind: 'accidental',
    id: 'SHARP',
    x: 10,
    y: 960,
    type: AccidentalType.SHARP,
    tooltip: 'Sharp'
  },
  {
    kind: 'accidental',
    id: 'FLAT',
    x: 10,
    y: 1040,
    type: AccidentalType.FLAT,
    tooltip: 'Flat'
  },
  {
    kind: 'accidental',
    id: 'NATURAL',
    x: 10,
    y: 1080,
    type: AccidentalType.NATURAL,
    tooltip: 'Natural'
  }
];
