// Thin localStorage wrapper — everything about the player's own progress is local-only (no
// account, no server) except the opt-in global leaderboard submission (see network/).
import { StatsMap } from '@helioworldly/engine';

const STATS_KEY = 'helioworldly.stats.planets';

export function loadStats(): StatsMap {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? (JSON.parse(raw) as StatsMap) : {};
  } catch {
    return {};
  }
}

export function saveStats(stats: StatsMap): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage unavailable (private browsing, storage full, etc.) — progress just won't
    // persist across reloads this session; nothing else in the app depends on it succeeding.
  }
}
