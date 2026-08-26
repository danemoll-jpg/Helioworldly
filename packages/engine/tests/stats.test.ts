import { describe, expect, it } from 'vitest';
import { applyResultToStats, applySessionToStats, masteryLevel } from '../src/stats.js';
import { StatsMap } from '../src/types.js';

describe('applyResultToStats', () => {
  it('creates a fresh entry on first result', () => {
    const stats = applyResultToStats({}, { bodyId: 'mars', correct: true, timeMs: 1000 });
    expect(stats.mars).toEqual({ seen: 1, missed: 0 });
  });

  it('increments missed on a wrong answer', () => {
    const stats = applyResultToStats({}, { bodyId: 'mars', correct: false, timeMs: 1000 });
    expect(stats.mars).toEqual({ seen: 1, missed: 1 });
  });

  it('accumulates across calls without mutating the input', () => {
    const first: StatsMap = { mars: { seen: 1, missed: 1 } };
    const second = applyResultToStats(first, { bodyId: 'mars', correct: true, timeMs: 500 });
    expect(second.mars).toEqual({ seen: 2, missed: 1 });
    expect(first.mars).toEqual({ seen: 1, missed: 1 });
  });
});

describe('applySessionToStats', () => {
  it('folds every result in order', () => {
    const stats = applySessionToStats({}, [
      { bodyId: 'mars', correct: true, timeMs: 1 },
      { bodyId: 'mars', correct: false, timeMs: 1 },
      { bodyId: 'venus', correct: true, timeMs: 1 },
    ]);
    expect(stats.mars).toEqual({ seen: 2, missed: 1 });
    expect(stats.venus).toEqual({ seen: 1, missed: 0 });
  });
});

describe('masteryLevel', () => {
  it('is new when never seen', () => {
    expect(masteryLevel(undefined)).toBe('new');
    expect(masteryLevel({ seen: 0, missed: 0 })).toBe('new');
  });

  it('is struggling when missed more than half the time', () => {
    expect(masteryLevel({ seen: 4, missed: 3 })).toBe('struggling');
  });

  it('is shaky between 15% and 50% miss rate', () => {
    expect(masteryLevel({ seen: 10, missed: 2 })).toBe('shaky');
  });

  it('is solid under 15% miss rate', () => {
    expect(masteryLevel({ seen: 20, missed: 1 })).toBe('solid');
  });
});
