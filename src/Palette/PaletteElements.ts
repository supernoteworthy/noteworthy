import { AccidentalType } from '../types/AccidentalTypes';
import { NoteLength, NoteType } from '../types/NoteTypes';
import { MatchType } from '../types/RepeatTypes';
import { SetterType } from '../types/SetterTypes';
import { ElementId } from '../types/StaffTypes';

interface PaletteElementSpec {
  kind: string;
  id: ElementId;
  type?: NoteType | AccidentalType | MatchType | SetterType;
  length?: NoteLength;
  x: number;
  yOffset?: number;
  height: number;
  tooltip: string;
  category: string;
}

export const PALETTE_ELEMENTS: PaletteElementSpec[] = [
  {
    kind: 'note',
    id: 'DOUBLE_WHOLE',
    type: NoteType.TONE,
    length: NoteLength.DOUBLEWHOLE,
    x: 0,
    height: 50,
    tooltip: 'Double whole (8)',
    category: 'Notes'
  },
  {
    kind: 'note',
    id: 'WHOLE',
    type: NoteType.TONE,
    length: NoteLength.WHOLE,
    x: 3,
    height: 50,
    yOffset: 25,
    tooltip: 'Whole (4)',
    category: 'Notes'
  },
  {
    kind: 'note',
    id: 'HALF',
    type: NoteType.TONE,
    length: NoteLength.HALF,
    x: 0,
    yOffset: 50,
    height: 50,
    tooltip: 'Half (2)',
    category: 'Notes'
  },
  {
    kind: 'note',
    id: 'QUARTER',
    type: NoteType.TONE,
    length: NoteLength.QUARTER,
    x: 0,
    yOffset: 50,
    height: 50,
    tooltip: 'Quarter (1)',
    category: 'Notes'
  },
  {
    kind: 'note',
    id: 'EIGHTH',
    type: NoteType.TONE,
    length: NoteLength.EIGHTH,
    x: 0,
    yOffset: 50,
    height: 50,
    tooltip: 'Eighth (1/2)',
    category: 'Notes'
  },
  {
    kind: 'note',
    id: 'SIXTEENTH',
    type: NoteType.TONE,
    length: NoteLength.SIXTEENTH,
    x: 0,
    yOffset: 50,
    height: 50,
    tooltip: 'Sixteenth (1/4)',
    category: 'Notes'
  },
  {
    kind: 'note',
    id: 'REST_DOUBLEWHOLE',
    type: NoteType.REST,
    length: NoteLength.DOUBLEWHOLE,
    x: 0,
    height: 40,
    tooltip: 'Double whole rest (8)',
    category: 'Rests'
  },
  {
    kind: 'note',
    id: 'REST_WHOLE',
    type: NoteType.REST,
    length: NoteLength.WHOLE,
    x: 0,
    height: 40,
    yOffset: 30,
    tooltip: 'Whole rest (4)',
    category: 'Rests'
  },
  {
    kind: 'note',
    id: 'REST_HALF',
    type: NoteType.REST,
    length: NoteLength.HALF,
    x: 0,
    height: 40,
    yOffset: 30,
    tooltip: 'Half rest (2)',
    category: 'Rests'
  },
  {
    kind: 'note',
    id: 'REST_QUARTER',
    type: NoteType.REST,
    length: NoteLength.QUARTER,
    x: 0,
    height: 45,
    yOffset: 40,
    tooltip: 'Quarter rest (1)',
    category: 'Rests'
  },
  {
    kind: 'note',
    id: 'REST_EIGHTH',
    type: NoteType.REST,
    length: NoteLength.EIGHTH,
    x: 5,
    height: 35,
    yOffset: 40,
    tooltip: 'Eighth rest (1/2)',
    category: 'Rests'
  },
  {
    kind: 'note',
    id: 'REST_SIXTEENTH',
    type: NoteType.REST,
    length: NoteLength.SIXTEENTH,
    x: 5,
    height: 50,
    yOffset: 40,
    tooltip: 'Sixteenth rest (1/16)',
    category: 'Rests'
  },
  {
    kind: 'repeat',
    id: 'REPEAT_START',
    type: MatchType.START,
    x: 5,
    height: 80,
    tooltip: 'Repeat start',
    category: 'Flow'
  },
  {
    kind: 'repeat',
    id: 'REPEAT_END',
    type: MatchType.END,
    x: 5,
    height: 80,
    yOffset: 30,
    tooltip: 'Repeat end',
    category: 'Flow'
  },
  {
    kind: 'accidental',
    id: 'SHARP',
    x: 5,
    height: 40,
    type: AccidentalType.SHARP,
    tooltip: 'Sharp',
    category: 'Accidentals'
  },
  {
    kind: 'accidental',
    id: 'FLAT',
    x: 10,
    height: 40,
    yOffset: 50,
    type: AccidentalType.FLAT,
    tooltip: 'Flat',
    category: 'Accidentals'
  },
  {
    kind: 'accidental',
    id: 'NATURAL',
    x: 10,
    height: 40,
    yOffset: 30,
    type: AccidentalType.NATURAL,
    tooltip: 'Natural',
    category: 'Accidentals'
  },
  {
    kind: 'setter',
    id: 'SET_OCTAVE',
    x: 0,
    height: 40,
    type: SetterType.OCTAVE,
    tooltip: 'Set octave',
    category: 'Modifiers'
  },
  {
    kind: 'setter',
    id: 'SET_VOLUME',
    x: 0,
    height: 40,
    yOffset: 30,
    type: SetterType.VOLUME,
    tooltip: 'Set volume',
    category: 'Modifiers'
  },
  {
    kind: 'setter',
    id: 'SET_BPM',
    x: 0,
    height: 40,
    yOffset: 30,
    type: SetterType.BPM,
    tooltip: 'Set beats per minute',
    category: 'Modifiers'
  },
  {
    kind: 'setter',
    id: 'SET_INSTRUMENT',
    x: 0,
    height: 40,
    yOffset: 30,
    type: SetterType.INSTRUMENT,
    tooltip: 'Set instrument',
    category: 'Modifiers'
  }
];
