/**
 * Utilities for calculating audio properties.
 */

import { AccidentalType } from '../types/AccidentalTypes';
import { NoteLength } from '../types/NoteTypes';

export function beatsToSeconds(beats: number, bpm: number) {
  return (60 / bpm) * beats;
}

export function noteLengthToBeats(noteLength: NoteLength) {
  switch (noteLength) {
    case NoteLength.DOUBLEWHOLE:
      return 8;
    case NoteLength.WHOLE:
      return 4;
    case NoteLength.HALF:
      return 2;
    case NoteLength.QUARTER:
      return 1;
    case NoteLength.SIXTEENTH:
      return 0.25;
    case NoteLength.EIGHTH:
      return 0.5;
  }
}

export function staffPositionToMidi(
  y: number,
  octave: number,
  accidentalType: AccidentalType
) {
  // XXX: Could be simplified a bit?
  let midi = 12 + octave * 12;
  while (y > 100) {
    midi -= 12;
    y -= 70;
  }
  while (y < 40) {
    midi += 12;
    y += 70;
  }
  if (accidentalType === AccidentalType.SHARP) {
    midi += 1;
  }
  if (accidentalType === AccidentalType.FLAT) {
    midi -= 1;
  }
  switch (y) {
    case 100: // Middle C
      return midi;
    case 90: // D
      return midi + 2;
    case 80: // E
      return midi + 4;
    case 70: // F
      return midi + 5;
    case 60: // G
      return midi + 7;
    case 50: // A
      return midi + 9;
    case 40: // B
      return midi + 11;
  }
  return 1;
}

export function playbackRateForMidiInterval(
  midi: number,
  midiBaseNote: number
) {
  return Math.pow(2, (midi - midiBaseNote) / 12);
}
