// Pure functions for tracking per-body mastery from quiz results. The engine never touches
// persistence — the client's storage.ts owns reading/writing the StatsMap to localStorage.
import { BodyStats, MasteryLevel, QuizResult, StatsMap } from './types.js';

export function applyResultToStats(stats: StatsMap, result: QuizResult): StatsMap {
  const prev = stats[result.bodyId] ?? { seen: 0, missed: 0 };
  const next: BodyStats = {
    seen: prev.seen + 1,
    missed: prev.missed + (result.correct ? 0 : 1),
  };
  return { ...stats, [result.bodyId]: next };
}

export function applySessionToStats(stats: StatsMap, results: QuizResult[]): StatsMap {
  return results.reduce(applyResultToStats, stats);
}

// new: never quizzed. struggling: missed more than half the time it's been seen. shaky: missed
// between 15% and 50% of the time. solid: everything else (consistently correct).
export function masteryLevel(stats: BodyStats | undefined): MasteryLevel {
  if (!stats || stats.seen === 0) return 'new';
  const missRatio = stats.missed / stats.seen;
  if (missRatio > 0.5) return 'struggling';
  if (missRatio >= 0.15) return 'shaky';
  return 'solid';
}
