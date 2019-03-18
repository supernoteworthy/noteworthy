import { ProjectStore } from '../stores/project.store';
import { ChordId, ChordSpec } from '../types/ChordTypes';
import { NoteLength, NoteSpec, NoteType } from '../types/NoteTypes';

interface BufferSpec {
  midiBaseNote: number;
  buffer: ArrayBuffer;
}
const audioLibrary: { [i: string]: BufferSpec } = {
  A0: {
    midiBaseNote: 21,
    buffer: require('!arraybuffer-loader!../assets/A0.ogg')
  },
  A1: {
    midiBaseNote: 33,
    buffer: require('!arraybuffer-loader!../assets/A1.ogg')
  },
  A2: {
    midiBaseNote: 45,
    buffer: require('!arraybuffer-loader!../assets/A2.ogg')
  },
  A3: {
    midiBaseNote: 57,
    buffer: require('!arraybuffer-loader!../assets/A3.ogg')
  },
  A4: {
    midiBaseNote: 69,
    buffer: require('!arraybuffer-loader!../assets/A4.ogg')
  },
  A5: {
    midiBaseNote: 81,
    buffer: require('!arraybuffer-loader!../assets/A5.ogg')
  },
  A6: {
    midiBaseNote: 93,
    buffer: require('!arraybuffer-loader!../assets/A6.ogg')
  },
  A7: {
    midiBaseNote: 105,
    buffer: require('!arraybuffer-loader!../assets/A7.ogg')
  },
  C1: {
    midiBaseNote: 24,
    buffer: require('!arraybuffer-loader!../assets/C1.ogg')
  },
  C2: {
    midiBaseNote: 36,
    buffer: require('!arraybuffer-loader!../assets/C2.ogg')
  },
  C3: {
    midiBaseNote: 48,
    buffer: require('!arraybuffer-loader!../assets/C3.ogg')
  },
  C4: {
    midiBaseNote: 60,
    buffer: require('!arraybuffer-loader!../assets/C4.ogg')
  },
  C5: {
    midiBaseNote: 72,
    buffer: require('!arraybuffer-loader!../assets/C5.ogg')
  },
  C6: {
    midiBaseNote: 84,
    buffer: require('!arraybuffer-loader!../assets/C6.ogg')
  },
  C7: {
    midiBaseNote: 96,
    buffer: require('!arraybuffer-loader!../assets/C7.ogg')
  },
  C8: {
    midiBaseNote: 108,
    buffer: require('!arraybuffer-loader!../assets/C8.ogg')
  },
  Ds1: {
    midiBaseNote: 27,
    buffer: require('!arraybuffer-loader!../assets/Ds1.ogg')
  },
  Ds2: {
    midiBaseNote: 39,
    buffer: require('!arraybuffer-loader!../assets/Ds2.ogg')
  },
  Ds3: {
    midiBaseNote: 51,
    buffer: require('!arraybuffer-loader!../assets/Ds3.ogg')
  },
  Ds4: {
    midiBaseNote: 63,
    buffer: require('!arraybuffer-loader!../assets/Ds4.ogg')
  },
  Ds5: {
    midiBaseNote: 75,
    buffer: require('!arraybuffer-loader!../assets/Ds5.ogg')
  },
  Ds6: {
    midiBaseNote: 87,
    buffer: require('!arraybuffer-loader!../assets/Ds6.ogg')
  },
  Ds7: {
    midiBaseNote: 99,
    buffer: require('!arraybuffer-loader!../assets/Ds7.ogg')
  },
  Fs1: {
    midiBaseNote: 30,
    buffer: require('!arraybuffer-loader!../assets/Fs1.ogg')
  },
  Fs2: {
    midiBaseNote: 42,
    buffer: require('!arraybuffer-loader!../assets/Fs2.ogg')
  },
  Fs4: {
    midiBaseNote: 66,
    buffer: require('!arraybuffer-loader!../assets/Fs4.ogg')
  },
  Fs5: {
    midiBaseNote: 78,
    buffer: require('!arraybuffer-loader!../assets/Fs5.ogg')
  },
  Fs6: {
    midiBaseNote: 90,
    buffer: require('!arraybuffer-loader!../assets/Fs6.ogg')
  },
  Fs7: {
    midiBaseNote: 102,
    buffer: require('!arraybuffer-loader!../assets/Fs7.ogg')
  }
};

const effects: { [i: string]: ArrayBuffer } = {
  delete: require('!arraybuffer-loader!../assets/delete.ogg')
};

const EPSILON = 0.00001;

interface NotePlayer {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

class Audio {
  private context?: AudioContext;
  private bufferMap: { [b: string]: AudioBuffer } = {};
  private effectBufferMap: { [b: string]: AudioBuffer } = {};
  private sourcesForNoteId: { [b: string]: NotePlayer } = {};

  private BPM = 100;

  public projectStore?: ProjectStore;

  init() {
    try {
      this.context = new window.AudioContext();
    } catch (e) {
      throw new Error('Web Audio API is not supported in this browser');
    }
  }

  /**
   * For note-playing feedback.
   * XXX: Callback instead? Or should it be handled elsewhere?
   */
  setProjectStore(projectStore: ProjectStore) {
    this.projectStore = projectStore;
  }

  get audioContext() {
    if (!this.context) {
      this.init();
      return this.context!;
    }
    return this.context;
  }

  async loadSounds() {
    for (let key of Object.keys(audioLibrary)) {
      this.bufferMap[key] = await this.audioContext.decodeAudioData(
        audioLibrary[key].buffer
      );
    }

    for (let key of Object.keys(effects)) {
      this.effectBufferMap[key] = await this.audioContext.decodeAudioData(
        effects[key]
      );
    }
  }

  private beatsToSeconds(beats: number) {
    return (60 / this.BPM) * beats;
  }

  noteSpecLengthToBeats(noteLength: NoteLength) {
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

  private positionToMidi(y: number, octave: number) {
    // XXX: could be simplified a bit?
    let octaveMidi = 12 + octave * 12;
    while (y > 100) {
      octaveMidi -= 12;
      y -= 70;
    }
    while (y < 40) {
      octaveMidi += 12;
      y += 70;
    }
    switch (y) {
      case 100: // Middle C
        return octaveMidi;
      case 90: // D
        return octaveMidi + 2;
      case 80: // E
        return octaveMidi + 4;
      case 70: // F
        return octaveMidi + 5;
      case 60: // G
        return octaveMidi + 7;
      case 50: // A
        return octaveMidi + 9;
      case 40: // B
        return octaveMidi + 11;
    }
    return 1;
  }

  private midiToPlaybackRate(midi: number, midiBaseNote: number) {
    return Math.pow(2, (midi - midiBaseNote) / 12);
  }

  private closestLibrarySample(midi: number) {
    let bestDistance = Infinity;
    let bestSampleKey = null;
    for (let sampleKey of Object.keys(audioLibrary)) {
      const distance = midi - audioLibrary[sampleKey].midiBaseNote;
      if (distance >= 0 && distance < bestDistance) {
        bestDistance = distance;
        bestSampleKey = sampleKey;
      }
    }
    console.log(bestSampleKey);
    if (!bestSampleKey) {
      return Object.keys(audioLibrary)[0];
    }
    return bestSampleKey;
  }

  play(noteSpec: NoteSpec) {
    const { id, y, type, length } = noteSpec;
    const projectStore = this.projectStore!;
    const timeLength = this.beatsToSeconds(this.noteSpecLengthToBeats(length));

    if (type === NoteType.REST) {
      projectStore.setNotePlaying(id, true);
      setTimeout(() => {
        projectStore.setNotePlaying(id, false);
      }, timeLength * 1000);
      return;
    }

    if (this.sourcesForNoteId[id]) {
      this.sourcesForNoteId[id].gain.gain.exponentialRampToValueAtTime(
        EPSILON,
        this.audioContext.currentTime
      );
      projectStore.setNotePlaying(id, false);
    }

    const source = this.audioContext.createBufferSource();
    const midiNote = this.positionToMidi(y, projectStore.getOctaveForNote(id));
    const closestLibrarySample = this.closestLibrarySample(midiNote);
    if (!closestLibrarySample) {
      throw new Error(
        `Could not find appropriate buffer for midi note. ${midiNote}`
      );
    }
    source.buffer = this.bufferMap[closestLibrarySample];
    source.playbackRate.value = this.midiToPlaybackRate(
      midiNote,
      audioLibrary[closestLibrarySample].midiBaseNote
    );
    source.start();

    const gain = this.audioContext.createGain();

    // XXX: make this sound nicer?
    gain.gain.setValueAtTime(
      1,
      this.audioContext.currentTime + timeLength * 0.7
    );
    gain.gain.exponentialRampToValueAtTime(
      EPSILON,
      this.audioContext.currentTime + timeLength
    );

    source.connect(gain);
    gain.connect(this.audioContext.destination);

    this.sourcesForNoteId[id] = { source, gain };

    if (this.projectStore) {
      this.projectStore.setNotePlaying(id, true);
    }

    setTimeout(() => {
      source.stop();
      source.disconnect();
      gain.disconnect();
      delete this.sourcesForNoteId[id];
      if (this.projectStore) {
        this.projectStore.setNotePlaying(id, false);
      }
    }, timeLength * 1000);
  }

  playNoteList(list: NoteSpec[]) {
    let currentIndex = 0;
    const sorted = list.slice();

    sorted.sort((a, b) => {
      const chordA = this.projectStore!.getChordById(a.chordId!)!;
      const chordB = this.projectStore!.getChordById(b.chordId!)!;
      if (chordA.staffIndex < chordB.staffIndex) {
        return -1;
      }
      return chordA.x - chordB.x;
    });
    const playNextNote = () => {
      if (currentIndex < sorted.length) {
        const currentNote = sorted[currentIndex];
        this.play(currentNote);
        const timeLength = this.beatsToSeconds(
          this.noteSpecLengthToBeats(currentNote.length)
        );
        currentIndex++;
        setTimeout(playNextNote, timeLength * 1000);
      }
    };
    playNextNote();
  }

  playChord(chordId: ChordId) {
    const notesInChord = this.projectStore!.getNotesForChord(chordId);
    notesInChord.forEach(note => this.play(note)); // TODO: Optimize?
  }

  chordLength(chordId: ChordId) {
    const notesInChord = this.projectStore!.getNotesForChord(chordId);
    const lengths = notesInChord.map(note =>
      this.beatsToSeconds(this.noteSpecLengthToBeats(note.length))
    );
    return Math.max(...lengths);
  }

  playChordList(list: ChordSpec[]) {
    let currentIndex = 0;
    const sorted = list.slice();

    sorted.sort((a, b) => {
      return a.staffIndex * 10000 + a.x - (b.staffIndex * 10000 + b.x);
    });
    const playNextChord = () => {
      if (currentIndex < sorted.length) {
        const currentChord = sorted[currentIndex];
        this.playChord(currentChord.id);
        const timeLength = this.chordLength(currentChord.id);
        currentIndex++;
        setTimeout(playNextChord, timeLength * 1000);
      }
    };
    playNextChord();
  }

  playEffect(effect: string) {
    const source = this.audioContext.createBufferSource();
    source.buffer = this.effectBufferMap[effect];
    source.start();
    source.connect(this.audioContext.destination);

    source.onended = () => {
      source.stop();
      source.disconnect();
    };
  }
}

export default new Audio();
