// Shared global leaderboard: one Firestore document ("leaderboard/global") holding an array of
// records, one per (quiz mode+system/view combo, player name) — each player's own personal best
// run for that setup. A screen displays the top N per combo, ranked by percent correct (ties
// broken by faster time). No accounts — just a display name typed in (see lib/playerName.ts).
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { QuizMode } from '@helioworldly/engine';
import { db, isFirebaseConfigured } from './firebase.js';

const LEADERBOARD_DOC = 'leaderboard/global';
const MAX_PER_COMBO = 50; // top scores actually shown is much smaller; this just bounds storage.
const MAX_RECORDS = 200; // matches firestore.rules — hard ceiling across every combo combined.

export interface LeaderboardRecord {
  comboKey: string; // `${mode}:${system}:${view}`
  playerName: string;
  percentCorrect: number;
  totalElapsedMs: number;
  date: string; // ISO
}

export function comboKey(mode: QuizMode, system: string, view: string): string {
  return `${mode}:${system}:${view}`;
}

function isValidRecord(value: unknown): value is LeaderboardRecord {
  if (typeof value !== 'object' || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.comboKey === 'string' &&
    typeof r.playerName === 'string' &&
    r.playerName.trim().length > 0 &&
    typeof r.percentCorrect === 'number' &&
    Number.isFinite(r.percentCorrect) &&
    r.percentCorrect >= 0 &&
    r.percentCorrect <= 100 &&
    typeof r.totalElapsedMs === 'number' &&
    Number.isFinite(r.totalElapsedMs) &&
    r.totalElapsedMs > 0 &&
    typeof r.date === 'string'
  );
}

// Ranking used everywhere: higher percent wins; ties broken by faster time.
export function isBetter(a: LeaderboardRecord, b: LeaderboardRecord): boolean {
  if (a.percentCorrect !== b.percentCorrect) return a.percentCorrect > b.percentCorrect;
  return a.totalElapsedMs < b.totalElapsedMs;
}

function rank(records: LeaderboardRecord[]): LeaderboardRecord[] {
  return [...records].sort((a, b) => (isBetter(a, b) ? -1 : isBetter(b, a) ? 1 : 0));
}

// Top N records for one combo, best first.
export function topScores(records: LeaderboardRecord[], key: string, limit = 10): LeaderboardRecord[] {
  return rank(records.filter((r) => r.comboKey === key)).slice(0, limit);
}

export async function fetchLeaderboard(): Promise<LeaderboardRecord[]> {
  if (!isFirebaseConfigured) return [];
  const snap = await getDoc(doc(db, LEADERBOARD_DOC));
  const data = snap.data();
  const records = Array.isArray(data?.records) ? data!.records : [];
  return records.filter(isValidRecord);
}

// Submits a run as this player's personal best for this combo — only actually writes if it beats
// (or creates) their existing entry. Wrapped in a transaction so two simultaneous submissions
// can't race each other into an inconsistent state.
export async function submitScore(record: LeaderboardRecord): Promise<void> {
  if (!isFirebaseConfigured) return;
  if (!isValidRecord(record)) throw new Error('submitScore: invalid record');

  const ref = doc(db, LEADERBOARD_DOC);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const existing: LeaderboardRecord[] = Array.isArray(snap.data()?.records)
      ? snap.data()!.records.filter(isValidRecord)
      : [];

    const existingIndex = existing.findIndex(
      (r) => r.comboKey === record.comboKey && r.playerName === record.playerName,
    );

    let next: LeaderboardRecord[];
    if (existingIndex === -1) {
      next = [...existing, record];
    } else if (isBetter(record, existing[existingIndex])) {
      next = [...existing];
      next[existingIndex] = record;
    } else {
      return; // this player's existing entry for this combo already stands
    }

    // Keep each combo bounded to its own top N (not just an overall cap) so one popular combo
    // can't crowd out another's entries entirely.
    const byCombo = new Map<string, LeaderboardRecord[]>();
    for (const r of next) {
      const list = byCombo.get(r.comboKey) ?? [];
      list.push(r);
      byCombo.set(r.comboKey, list);
    }
    next = [...byCombo.values()].flatMap((list) => rank(list).slice(0, MAX_PER_COMBO));

    if (next.length > MAX_RECORDS) next = next.slice(0, MAX_RECORDS);
    tx.set(ref, { records: next });
  });
}
