import { describe, expect, it } from 'vitest';
import {
  currentBodyId,
  isComplete,
  recordAnswer,
  scoreSummary,
  startSession,
  totalElapsedMs,
} from '../src/session.js';

const ids = ['mercury', 'venus', 'earth'];

describe('startSession', () => {
  it('orders every id exactly once and starts at index 0', () => {
    const session = startSession(ids, 'findIt', {});
    expect(new Set(session.order)).toEqual(new Set(ids));
    expect(session.index).toBe(0);
    expect(session.results).toEqual([]);
  });
});

describe('currentBodyId / isComplete', () => {
  it('walks through the session and completes at the end', () => {
    let session = startSession(ids, 'findIt', {});
    for (let i = 0; i < ids.length; i++) {
      expect(isComplete(session)).toBe(false);
      expect(currentBodyId(session)).toBe(session.order[i]);
      session = recordAnswer(session, true, 1000);
    }
    expect(isComplete(session)).toBe(true);
    expect(currentBodyId(session)).toBeUndefined();
  });
});

describe('recordAnswer', () => {
  it('is a no-op past the end of the session', () => {
    let session = startSession(ids, 'findIt', {});
    for (let i = 0; i < ids.length; i++) session = recordAnswer(session, true, 1000);
    const after = recordAnswer(session, true, 1000);
    expect(after).toBe(session);
  });
});

describe('scoreSummary / totalElapsedMs', () => {
  it('computes correct count, total, and percent', () => {
    let session = startSession(ids, 'findIt', {});
    session = recordAnswer(session, true, 1000);
    session = recordAnswer(session, false, 2000);
    session = recordAnswer(session, true, 1500);
    const summary = scoreSummary(session);
    expect(summary).toEqual({ correct: 2, total: 3, percentCorrect: 67 });
    expect(totalElapsedMs(session)).toBe(4500);
  });

  it('reports 0% on an empty session', () => {
    const session = startSession(ids, 'findIt', {});
    expect(scoreSummary(session)).toEqual({ correct: 0, total: 0, percentCorrect: 0 });
  });
});
