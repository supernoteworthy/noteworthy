import { InstrumentSamples } from '../SampleLibrary';

export const Snare: InstrumentSamples = {
  C4: {
    midiBaseNote: 60,
    buffer: require('!arraybuffer-loader!../../assets/Snare.wav')
  }
};
