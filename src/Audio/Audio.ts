import { ProjectStore } from '../stores/project.store';
import { CellId, CellSpec } from '../types/CellTypes';
import { NoteLength, NoteSpec, NoteType } from '../types/NoteTypes';

const audioLibrary: { [i: string]: ArrayBuffer } = {
  B3: require('!arraybuffer-loader!../assets/B3.ogg'),
  C4: require('!arraybuffer-loader!../assets/C4.ogg'),
  D4: require('!arraybuffer-loader!../assets/D4.ogg'),
  E4: require('!arraybuffer-loader!../assets/E4.ogg'),
  F4: require('!arraybuffer-loader!../assets/F4.ogg'),
  G4: require('!arraybuffer-loader!../assets/G4.ogg'),
  A4: require('!arraybuffer-loader!../assets/A4.ogg'),
  B4: require('!arraybuffer-loader!../assets/B4.ogg'),
  C5: require('!arraybuffer-loader!../assets/C5.ogg'),
  D5: require('!arraybuffer-loader!../assets/D5.ogg'),
  E5: require('!arraybuffer-loader!../assets/E5.ogg'),
  F5: require('!arraybuffer-loader!../assets/F5.ogg'),
  G5: require('!arraybuffer-loader!../assets/G5.ogg'),
  A5: require('!arraybuffer-loader!../assets/A5.ogg'),
  B5: require('!arraybuffer-loader!../assets/B5.ogg'),
  C6: require('!arraybuffer-loader!../assets/C6.ogg')
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
        audioLibrary[key]
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

  /** XXX: Replace this with something smarter! */
  private yToNote(y: number) {
    if (y === 110) {
      return 'B3';
    }
    if (y === 100) {
      return 'C4';
    }
    if (y === 90) {
      return 'D4';
    }
    if (y === 80) {
      return 'E4';
    }
    if (y === 70) {
      return 'F4';
    }
    if (y === 60) {
      return 'G4';
    }
    if (y === 50) {
      return 'A4';
    }
    if (y === 40) {
      return 'B4';
    }
    if (y === 30) {
      return 'C5';
    }
    if (y == 20) {
      return 'D5';
    }
    if (y == 10) {
      return 'E5';
    }
    if (y == 0) {
      return 'F5';
    }
    if (y == -10) {
      return 'G5';
    }
    if (y == -20) {
      return 'A5';
    }
    if (y == -30) {
      return 'B5';
    }
    if (y == -40) {
      return 'C6';
    }
  }

  play(noteSpec: NoteSpec) {
    const { id, y, type, length } = noteSpec;
    console.log(id, y, type, length);
    const timeLength = this.beatsToSeconds(this.noteSpecLengthToBeats(length));

    if (type === NoteType.REST) {
      if (this.projectStore) {
        this.projectStore.setNotePlaying(id, true);
      }
      setTimeout(() => {
        if (this.projectStore) {
          this.projectStore.setNotePlaying(id, false);
        }
      }, timeLength * 1000);
      return;
    }

    if (this.sourcesForNoteId[id]) {
      this.sourcesForNoteId[id].gain.gain.exponentialRampToValueAtTime(
        EPSILON,
        this.audioContext.currentTime
      );
      if (this.projectStore) {
        this.projectStore.setNotePlaying(id, false);
      }
    }

    const source = this.audioContext.createBufferSource();
    const note = this.yToNote(y);
    if (!note) {
      console.warn(`Could not find note for ${y}`);
      return;
    }
    source.buffer = this.bufferMap[note];
    source.start();

    const gain = this.audioContext.createGain();

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
      const cellA = this.projectStore!.getCellById(a.cellId!)!;
      const cellB = this.projectStore!.getCellById(b.cellId!)!;
      if (cellA.staffIndex < cellB.staffIndex) {
        return -1;
      }
      return cellA.x - cellB.x;
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

  playCell(cellId: CellId) {
    const notesInCell = this.projectStore!.getNotesForCell(cellId);
    notesInCell.forEach(note => this.play(note)); // TODO: Optimize?
  }

  cellLength(cellId: CellId) {
    const notesInCell = this.projectStore!.getNotesForCell(cellId);
    const lengths = notesInCell.map(note =>
      this.beatsToSeconds(this.noteSpecLengthToBeats(note.length))
    );
    return Math.max(...lengths);
  }

  playCellList(list: CellSpec[]) {
    let currentIndex = 0;
    const sorted = list.slice();

    sorted.sort((a, b) => {
      return a.staffIndex * 10000 + a.x - (b.staffIndex * 10000 + b.x);
    });
    const playNextCell = () => {
      if (currentIndex < sorted.length) {
        const currentCell = sorted[currentIndex];
        this.playCell(currentCell.id);
        const timeLength = this.cellLength(currentCell.id);
        currentIndex++;
        setTimeout(playNextCell, timeLength * 1000);
      }
    };
    playNextCell();
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
