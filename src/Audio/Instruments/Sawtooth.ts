import { InstrumentSamples } from '../SampleLibrary';

export const Sawtooth: InstrumentSamples = {
  C4: {
    midiBaseNote: 60,
    buffer: require('!arraybuffer-loader!../../assets/Sawtooth-C4.ogg')
  }
};
