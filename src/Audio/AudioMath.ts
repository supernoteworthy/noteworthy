/**
 * Utilities for calculating audio properties.
 */

import { LINE_DY } from '../constants';
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
  const OCTAVE_DY = 7 * (LINE_DY / 2);
  const MIDI_OCTAVE_INTERVAL = 12;
  let midi = (octave + 1) * MIDI_OCTAVE_INTERVAL;
  // TODO: Fix magic numbers 100 and 40.
  while (y > 100) {
    midi -= MIDI_OCTAVE_INTERVAL;
    y -= OCTAVE_DY;
  }
  while (y < 40) {
    midi += MIDI_OCTAVE_INTERVAL;
    y += OCTAVE_DY;
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
    // C sharp = + 1
    case 90: // D
      return midi + 2;
    // D sharp = + 3
    case 80: // E
      return midi + 4;
    case 70: // F
      return midi + 5;
    // F sharp = + 6
    case 60: // G
      return midi + 7;
    // G sharp = + 8
    case 50: // A
      return midi + 9;
    // B flat = + 10
    case 40: // B
      return midi + 11;
  }
  throw new Error('Could not convert y position to midi note');
}

export function playbackRateForMidiInterval(
  midi: number,
  midiBaseNote: number
) {
  return Math.pow(2, (midi - midiBaseNote) / 12);
}
