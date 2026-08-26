// A non-personalized "one shared question a day" pick, Wordle-style — the same body for every
// player on a given calendar day, so it's something to compare notes on rather than just another
// private drill. Deterministic from the date alone, no server round-trip needed.

// Simple deterministic string hash (djb2 variant) — good enough for picking an index
// reproducibly, nothing security-sensitive here.
function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

// YYYY-MM-DD in the player's own local calendar (not UTC), so the challenge rolls over at each
// player's own midnight rather than globally at once.
export function dailyDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dailyBodyId(ids: string[], date: Date = new Date()): string {
  if (ids.length === 0) throw new Error('dailyBodyId: ids must be non-empty');
  const key = dailyDateKey(date);
  const index = hashString(key) % ids.length;
  return ids[index];
}
