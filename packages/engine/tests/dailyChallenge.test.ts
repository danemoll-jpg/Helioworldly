import { describe, expect, it } from 'vitest';
import { dailyBodyId, dailyDateKey } from '../src/dailyChallenge.js';

describe('dailyDateKey', () => {
  it('formats as YYYY-MM-DD using local calendar fields', () => {
    const date = new Date(2026, 7, 26); // August 26, 2026 (month is 0-indexed)
    expect(dailyDateKey(date)).toBe('2026-08-26');
  });

  it('pads single-digit months and days', () => {
    const date = new Date(2026, 0, 5); // January 5, 2026
    expect(dailyDateKey(date)).toBe('2026-01-05');
  });
});

describe('dailyBodyId', () => {
  const ids = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

  it('is deterministic for the same date', () => {
    const date = new Date(2026, 7, 26);
    expect(dailyBodyId(ids, date)).toBe(dailyBodyId(ids, date));
  });

  it('picks an id that is actually in the list', () => {
    const date = new Date(2026, 7, 26);
    expect(ids).toContain(dailyBodyId(ids, date));
  });

  it('throws on an empty list', () => {
    expect(() => dailyBodyId([], new Date())).toThrow();
  });

  it('varies across different dates (not always the same index)', () => {
    const picks = new Set<string>();
    for (let day = 1; day <= 20; day++) {
      picks.add(dailyBodyId(ids, new Date(2026, 7, day)));
    }
    expect(picks.size).toBeGreaterThan(1);
  });
});
