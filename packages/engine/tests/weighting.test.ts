import { describe, expect, it } from 'vitest';
import { weightedOrder } from '../src/weighting.js';
import { StatsMap } from '../src/types.js';

describe('weightedOrder', () => {
  it('includes every id exactly once', () => {
    const ids = ['mercury', 'venus', 'earth', 'mars'];
    const order = weightedOrder(ids, {});
    expect(order.length).toBe(ids.length);
    expect(new Set(order)).toEqual(new Set(ids));
  });

  it('is deterministic given a fixed rng', () => {
    const ids = ['mercury', 'venus', 'earth', 'mars'];
    const rng = () => 0.5;
    expect(weightedOrder(ids, {}, rng)).toEqual(weightedOrder(ids, {}, rng));
  });

  it('handles an empty id list', () => {
    expect(weightedOrder([], {})).toEqual([]);
  });

  it('tends to place a heavily-missed id earlier than a perfect one', () => {
    const stats: StatsMap = {
      struggling: { seen: 10, missed: 10 },
      solid: { seen: 10, missed: 0 },
    };
    let strugglingFirstCount = 0;
    const trials = 200;
    for (let i = 0; i < trials; i++) {
      const order = weightedOrder(['struggling', 'solid'], stats, Math.random);
      if (order[0] === 'struggling') strugglingFirstCount++;
    }
    // Weight ratio is 5:1, so struggling should come first well more than half the time.
    expect(strugglingFirstCount).toBeGreaterThan(trials * 0.6);
  });
});
