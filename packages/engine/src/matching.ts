// Typo-tolerant name matching for typeIt mode — a player who types "jupitor" or "urnaus" should
// still be marked correct. Same approach as the rest of the series: normalize, then allow a
// small edit-distance budget that scales with word length.
export function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

// Classic Levenshtein edit distance (insert/delete/substitute), iterative DP.
export function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array<number>(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

// Nothing security-sensitive here — just "close enough" for a casual typed quiz answer. Short
// names (<=4 chars, e.g. "Mars") require an exact match; longer names tolerate roughly one typo
// per five characters.
export function isCloseMatch(input: string, target: string): boolean {
  const a = normalize(input);
  const b = normalize(target);
  if (a.length === 0) return false;
  if (a === b) return true;

  const budget = b.length <= 4 ? 0 : Math.max(1, Math.floor(b.length / 5));
  return editDistance(a, b) <= budget;
}
