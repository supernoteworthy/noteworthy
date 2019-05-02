import { InstrumentSamples } from '../SampleLibrary';

export const Moog: InstrumentSamples = {
  Ds4: {
    midiBaseNote: 63,
    buffer: require('!arraybuffer-loader!../../assets/Moog-Ds4.wav')
  }
};
