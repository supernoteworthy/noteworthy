import { AccidentalType } from '../types/AccidentalTypes';
import { NoteLength } from '../types/NoteTypes';
import {
  beatsToSeconds,
  noteLengthToBeats,
  playbackRateForMidiInterval,
  staffPositionToMidi
} from './AudioMath';

describe('AudioMath', () => {
  describe('beatsToSeconds', () => {
    it('returns 1 second for 1 beat at 60 bpm', () => {
      expect(beatsToSeconds(1, 60)).toEqual(1);
    });
    it('returns a correct value where beats > 1', () => {
      expect(beatsToSeconds(60, 60)).toEqual(60);
    });
    it('returns 0 when beats = 0', () => {
      expect(beatsToSeconds(0, 100)).toEqual(0);
    });
  });
  describe('noteLengthToBeats', () => {
    it('returns 1 beat for a quarter note', () => {
      expect(noteLengthToBeats(NoteLength.QUARTER)).toEqual(1);
    });
  });
  describe('staffPositionToMidi', () => {
    it('works for C4', () => {
      expect(staffPositionToMidi(100, 4, AccidentalType.NATURAL)).toEqual(60);
    });

    it('works for C5', () => {
      expect(staffPositionToMidi(100, 5, AccidentalType.NATURAL)).toEqual(72);
    });

    it('works for F5', () => {
      expect(staffPositionToMidi(0, 4, AccidentalType.NATURAL)).toEqual(77);
    });

    it('works for Cs4', () => {
      expect(staffPositionToMidi(100, 4, AccidentalType.SHARP)).toEqual(61);
    });

    it('works for Cb4', () => {
      expect(staffPositionToMidi(100, 4, AccidentalType.FLAT)).toEqual(59);
    });

    it('handles negative y', () => {
      expect(staffPositionToMidi(-10, 4, AccidentalType.NATURAL)).toEqual(79);
    });
  });
  describe('playbackRateForMidiInterval', () => {
    const TWELFTH_ROOT_OF_TWO = 1.0594630943592953;
    it('doubles playback rate for increasing by an octave', () => {
      expect(playbackRateForMidiInterval(72, 60)).toEqual(2);
    });
    it('halves playback rate for increasing by an octave', () => {
      expect(playbackRateForMidiInterval(60, 72)).toEqual(0.5);
    });
    it('sets playback rate to correct number for one step', () => {
      expect(playbackRateForMidiInterval(61, 60)).toEqual(TWELFTH_ROOT_OF_TWO);
    });
    it('sets playback rate to correct number for two steps', () => {
      expect(playbackRateForMidiInterval(2, 0)).toEqual(
        Math.pow(TWELFTH_ROOT_OF_TWO, 2)
      );
    });
    it('sets playback rate to correct number for zero steps', () => {
      expect(playbackRateForMidiInterval(30, 30)).toEqual(1);
    });
  });
});
