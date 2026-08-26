// Decides quiz session order: every body appears exactly once per session, but ones the player
// has historically missed more often are weighted to be more likely to appear earlier — an
// adaptive nudge toward practicing weak spots, without ever skipping a body entirely.
import { BodyStats, StatsMap } from './types.js';

// 0-1: how often this id has been missed when seen before. Unseen ids default to 0.5 (neither
// deprioritized nor overweighted for lack of history).
function missRatio(stats: StatsMap, id: string): number {
  const s: BodyStats | undefined = stats[id];
  if (!s || s.seen === 0) return 0.5;
  return s.missed / s.seen;
}

// Weight 1 (never missed) up to 5 (always missed) — baseline plus up to a 4x multiplier.
function weightFor(stats: StatsMap, id: string): number {
  return 1 + missRatio(stats, id) * 4;
}

// Weighted random sampling without replacement: repeatedly pick one remaining id, probability
// proportional to its weight, remove it, repeat until every id has been placed exactly once.
export function weightedOrder(ids: string[], stats: StatsMap, rng: () => number = Math.random): string[] {
  const remaining = [...ids];
  const order: string[] = [];

  while (remaining.length > 0) {
    const weights = remaining.map((id) => weightFor(stats, id));
    const total = weights.reduce((sum, w) => sum + w, 0);
    let roll = rng() * total;
    let chosenIndex = remaining.length - 1;
    for (let i = 0; i < weights.length; i++) {
      roll -= weights[i];
      if (roll <= 0) {
        chosenIndex = i;
        break;
      }
    }
    order.push(remaining[chosenIndex]);
    remaining.splice(chosenIndex, 1);
  }

  return order;
}
