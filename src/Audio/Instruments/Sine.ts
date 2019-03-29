import { InstrumentSamples } from '../SampleLibrary';

export const Sine: InstrumentSamples = {
  C4: {
    midiBaseNote: 60,
    buffer: require('!arraybuffer-loader!../../assets/Sine-C4.ogg')
  }
};
