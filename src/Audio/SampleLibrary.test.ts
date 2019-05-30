import SampleLibrary, { InstrumentSamples } from './SampleLibrary';

describe('SampleLibrary', () => {
  describe('decodeToAudioBuffers', () => {
    it('decodes each sample', () => {
      const decodeAudioData = jest.fn();
      const context = ({
        decodeAudioData
      } as unknown) as AudioContext;
      const fakeInstrument = {
        A0: {
          midiBaseNote: 21,
          buffer: {} as any
        },
        G4: {
          midiBaseNote: 67,
          buffer: {} as any
        }
      } as InstrumentSamples;
      const sampleLibrary = new SampleLibrary(context, fakeInstrument);
      sampleLibrary.decodeToAudioBuffers();
      expect(decodeAudioData).toBeCalledTimes(
        Object.keys(fakeInstrument).length
      );
    });
  });
  describe('getBufferAndRateForMidi', () => {
    it('chooses buffers with lower midi values and an appropriate playback rate', () => {
      // Note: this is NOT how the Web Audio API buffer really works,
      // (it will create a new decoded buffer), but this version
      // can help us usefully test that notes are mapped correctly.
      const decodeAudioData = jest.fn((buffer, cb) => {
        cb(buffer);
      });

      const context = ({ decodeAudioData } as unknown) as AudioContext;
      const fakeInstrument = {
        A0: {
          midiBaseNote: 21,
          buffer: {} as any
        },
        G4: {
          midiBaseNote: 67,
          buffer: {} as any
        }
      } as InstrumentSamples;
      const sampleLibrary = new SampleLibrary(context, fakeInstrument);
      sampleLibrary.decodeToAudioBuffers();
      expect(sampleLibrary.getBufferAndRateForMidi(60)).toEqual({
        buffer: fakeInstrument.A0.buffer,
        playbackRate: 9.513656920021768
      });
    });
  });
});
