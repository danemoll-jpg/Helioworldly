// Shared global leaderboard: one Firestore document ("leaderboard/global") holding an array of
// records, one per distinct combo actually played (quiz mode + system/view), each holding only
// its single best-ever run across all players. No accounts — just a display name typed in
// (see lib/playerName.ts). Same shape as Worldly/Outworldly/Innerworldly's leaderboard wiring.
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { QuizMode } from '@helioworldly/engine';
import { db, isFirebaseConfigured } from './firebase.js';

const LEADERBOARD_DOC = 'leaderboard/global';
const MAX_RECORDS = 200; // generous headroom for future systems/views; matches firestore.rules.

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

// Higher percent wins; ties broken by faster time.
function isBetter(a: LeaderboardRecord, b: LeaderboardRecord): boolean {
  if (a.percentCorrect !== b.percentCorrect) return a.percentCorrect > b.percentCorrect;
  return a.totalElapsedMs < b.totalElapsedMs;
}

export async function fetchLeaderboard(): Promise<LeaderboardRecord[]> {
  if (!isFirebaseConfigured) return [];
  const snap = await getDoc(doc(db, LEADERBOARD_DOC));
  const data = snap.data();
  const records = Array.isArray(data?.records) ? data!.records : [];
  return records.filter(isValidRecord);
}

// Submits a run; only actually writes if it beats (or creates) the best record for this combo.
// Wrapped in a transaction so two simultaneous submissions can't race each other into an
// inconsistent state.
export async function submitScore(record: LeaderboardRecord): Promise<void> {
  if (!isFirebaseConfigured) return;
  if (!isValidRecord(record)) throw new Error('submitScore: invalid record');

  const ref = doc(db, LEADERBOARD_DOC);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const existing: LeaderboardRecord[] = Array.isArray(snap.data()?.records)
      ? snap.data()!.records.filter(isValidRecord)
      : [];

    const existingIndex = existing.findIndex((r) => r.comboKey === record.comboKey);
    let next: LeaderboardRecord[];

    if (existingIndex === -1) {
      next = [...existing, record];
    } else if (isBetter(record, existing[existingIndex])) {
      next = [...existing];
      next[existingIndex] = record;
    } else {
      return; // existing record stands
    }

    if (next.length > MAX_RECORDS) next = next.slice(0, MAX_RECORDS);
    tx.set(ref, { records: next });
  });
}
