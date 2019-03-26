import { midiToPlaybackRate } from './AudioMath';

export interface SampleSpec {
  midiBaseNote: number;
  buffer: ArrayBuffer;
}

export type InstrumentSamples = { [noteName: string]: SampleSpec };

export default class SampleLibrary {
  audioContext: AudioContext;
  instrumentSamples: InstrumentSamples = {};
  instrumentAudioBuffers: { [noteName: string]: AudioBuffer } = {};

  constructor(context: AudioContext, instrumentSamples: InstrumentSamples) {
    this.instrumentSamples = instrumentSamples;
    this.audioContext = context;
  }

  async decodeToAudioBuffers() {
    for (let key of Object.keys(this.instrumentSamples)) {
      this.instrumentAudioBuffers[
        key
      ] = await this.audioContext.decodeAudioData(
        this.instrumentSamples[key].buffer
      );
    }
  }

  getBufferAndRateForMidi(midi: number) {
    let bestDistance = Infinity;
    let bestSampleKey = Object.keys(this.instrumentSamples)[0];
    for (let sampleKey of Object.keys(this.instrumentSamples)) {
      const distance = midi - this.instrumentSamples[sampleKey].midiBaseNote;
      if (distance >= 0 && distance < bestDistance) {
        bestDistance = distance;
        bestSampleKey = sampleKey;
      }
    }
    return {
      buffer: this.instrumentAudioBuffers[bestSampleKey],
      playbackRate: midiToPlaybackRate(
        midi,
        this.instrumentSamples[bestSampleKey].midiBaseNote
      )
    };
  }
}
