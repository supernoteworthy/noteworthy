import { SCHEDULER_INTERVAL_MS, SCHEDULER_LOOKAHEAD_MS } from '../constants';
import { ChordId, ChordSpec } from '../types/ChordTypes';
import PlayHead, { EndCondition } from './PlayHead';

export default class Scheduler {
  private context: AudioContext;
  private scheduleInterval?: NodeJS.Timeout;
  private playHeads: PlayHead[] = [];
  private updateFeedbackCallback: (playingChords: ChordSpec[]) => void;
  public _debugScheduleTime?: Date;

  constructor(
    context: AudioContext,
    updateFeedbackCallback: (playingChords: ChordSpec[]) => void
  ) {
    this.context = context;
    this.updateFeedbackCallback = updateFeedbackCallback;
  }

  public start() {
    this.schedule();
    if (!this.scheduleInterval) {
      this.scheduleInterval = setInterval(this.schedule, SCHEDULER_INTERVAL_MS);
    }
    requestAnimationFrame(this.updateFeedback);
  }

  public stop() {
    if (this.scheduleInterval) {
      clearInterval(this.scheduleInterval);
      this.scheduleInterval = undefined;
    }
    this.playHeads.forEach(playHead => playHead.stopAudio());
    this.playHeads = [];
  }

  public stopChord(chordId: ChordId) {
    for (let playHead of this.playHeads) {
      if (
        playHead.currentChord &&
        playHead.currentChord.id === chordId &&
        playHead.endCondition === EndCondition.SAMPLE_ELEMENT
      ) {
        playHead.stopAudio();
        this.dropPlayHead(playHead);
      }
    }
  }

  public pushPlayHead(playHead: PlayHead) {
    this.playHeads.push(playHead);
  }

  private dropPlayHead(playHead: PlayHead) {
    this.playHeads.splice(this.playHeads.indexOf(playHead), 1);
  }

  private schedule = () => {
    this._debugScheduleTime = new Date();
    const startWindow = this.context.currentTime;
    const endWindow = this.context.currentTime + SCHEDULER_LOOKAHEAD_MS / 1000;

    for (let playHead of this.playHeads) {
      if (!playHead.endTime) {
        playHead.proceedAndOutputNextSound();
      } else if (
        playHead.endTime >= startWindow &&
        playHead.endTime <= endWindow
      ) {
        const scheduled = playHead.next();
        if (!scheduled) {
          this.dropPlayHead(playHead);
        }
      } else if (playHead.endTime < startWindow) {
        this.dropPlayHead(playHead);
      }
    }
    if (this.playHeads.length === 0) {
      this.stop();
    }
  };

  private updateFeedback = () => {
    const chordsPlaying = [];
    for (let playHead of this.playHeads) {
      if (
        playHead.currentChord &&
        playHead.endTime &&
        playHead.endTime >= this.context.currentTime
      ) {
        chordsPlaying.push(playHead.currentChord);
      }
    }
    this.updateFeedbackCallback(chordsPlaying);
    if (this.playHeads.length > 0) {
      requestAnimationFrame(this.updateFeedback);
    }
  };
}
