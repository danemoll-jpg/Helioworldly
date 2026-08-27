// Thin localStorage wrapper — everything about the player's own progress is local-only (no
// account, no server) except the opt-in global leaderboard submission (see network/).
// One shared map keyed by body id, covering every system/view — body ids are unique across the
// whole engine (see engine tests), so there's no need for a per-collection key, and it means the
// Mastery screen can show every collection's progress in one place without stitching maps.
import { StatsMap } from '@helioworldly/engine';

const STATS_KEY = 'helioworldly.stats';

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
