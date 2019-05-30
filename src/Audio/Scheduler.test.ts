import { ChordSpec } from '../types/ChordTypes';
import PlayHead from './PlayHead';
import Scheduler from './Scheduler';

describe('Scheduler', () => {
  describe('start', () => {
    it('causes schedule to be called', () => {
      const context = {} as AudioContext;
      const updateFeedbackCallback = () => {};
      const scheduler = new Scheduler(context, updateFeedbackCallback);
      expect(scheduler._debugScheduleTime).toBeUndefined();
      scheduler.start();
      expect(scheduler._debugScheduleTime).not.toBeUndefined();
    });

    it('causes updateFeedbackCallback to be scheduled', () => {
      jest
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((cb: any) => cb());
      const context = {} as AudioContext;
      const updateFeedbackCallback = jest.fn();
      const scheduler = new Scheduler(context, updateFeedbackCallback);
      scheduler.start();
      expect(updateFeedbackCallback).toBeCalled();
      jest.restoreAllMocks();
    });

    it('causes playHeads to play', () => {
      jest.useFakeTimers();
      const context = {} as AudioContext;
      const updateFeedbackCallback = () => {};
      const scheduler = new Scheduler(context, updateFeedbackCallback);
      const proceedAndOutputNextSound = jest.fn();
      scheduler.pushPlayHead(({
        proceedAndOutputNextSound
      } as unknown) as PlayHead);
      scheduler.start();
      jest.advanceTimersByTime(10);
      expect(proceedAndOutputNextSound).toBeCalled();
    });
  });

  describe('stop', () => {
    it('causes schedule to stop being called', () => {
      jest.useFakeTimers();
      const context = {} as AudioContext;
      const updateFeedbackCallback = () => {};
      const scheduler = new Scheduler(context, updateFeedbackCallback);
      scheduler.pushPlayHead({
        proceedAndOutputNextSound: () => {},
        stopAudio: () => {}
      } as PlayHead);
      expect(scheduler._debugScheduleTime).toBeUndefined();
      scheduler.start();
      jest.advanceTimersByTime(10);
      const lastScheduled = scheduler._debugScheduleTime;
      expect(lastScheduled).not.toBeUndefined();
      scheduler.stop();
      jest.advanceTimersByTime(10);
      expect(lastScheduled).toEqual(scheduler._debugScheduleTime);
    });
    it('causes playHeads to stop', () => {
      const context = {} as AudioContext;
      const updateFeedbackCallback = () => {};
      const scheduler = new Scheduler(context, updateFeedbackCallback);
      const stopAudio = jest.fn();
      scheduler.pushPlayHead(({
        proceedAndOutputNextSound: () => {},
        stopAudio
      } as unknown) as PlayHead);
      scheduler.stop();
      expect(stopAudio).toBeCalled();
    });
  });

  describe('updateFeedback', () => {
    it('calls updateFeedbackCallback with a set of chord IDs', () => {
      let calledOnce = false;
      jest
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((cb: any) => {
          if (!calledOnce) {
            calledOnce = true;
            cb();
          }
          return 1;
        });
      const context = {
        currentTime: 0
      } as AudioContext;
      const updateFeedbackCallback = jest.fn();
      const scheduler = new Scheduler(context, updateFeedbackCallback);
      const currentChord = {} as ChordSpec;
      scheduler.pushPlayHead({
        proceedAndOutputNextSound: () => {},
        currentChord,
        endTime: 10
      } as PlayHead);
      scheduler.start();
      expect(updateFeedbackCallback).toBeCalledWith([currentChord]);
      jest.restoreAllMocks();
    });
  });
});
