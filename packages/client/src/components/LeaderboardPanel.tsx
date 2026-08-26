import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { QuizMode } from '@helioworldly/engine';
import { formatDuration, formatPercent } from '../lib/format.js';
import { getStoredPlayerName, isValidPlayerName, setStoredPlayerName } from '../lib/playerName.js';
import { isFirebaseConfigured } from '../network/firebase.js';
import { LeaderboardRecord, comboKey, fetchLeaderboard, submitScore, topScores } from '../network/globalLeaderboard.js';

export interface LeaderboardPanelProps {
  mode: QuizMode;
  system: string;
  view: string;
  currentRun?: { percentCorrect: number; totalElapsedMs: number };
  title?: string;
}

export function LeaderboardPanel({ mode, system, view, currentRun, title = 'Global leaderboard' }: LeaderboardPanelProps) {
  const key = comboKey(mode, system, view);
  const [records, setRecords] = useState<LeaderboardRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState(getStoredPlayerName());
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchLeaderboard()
      .then((all) => {
        if (!cancelled) setRecords(topScores(all, key, 10));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!currentRun || !isValidPlayerName(playerName)) return;
    setStoredPlayerName(playerName);
    try {
      await submitScore({
        comboKey: key,
        playerName: playerName.trim(),
        percentCorrect: currentRun.percentCorrect,
        totalElapsedMs: currentRun.totalElapsedMs,
        date: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch {
      setError(true);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="leaderboard-panel">
        <h3>{title}</h3>
        <p className="leaderboard-note">Not live yet — this turns on once the app is published.</p>
      </div>
    );
  }

  return (
    <div className="leaderboard-panel">
      <h3>{title}</h3>
      {loading && <p>Loading…</p>}
      {error && <p className="leaderboard-note">Couldn't reach the leaderboard right now.</p>}
      {!loading && !error && records.length === 0 && (
        <p className="leaderboard-note">No scores yet — be the first!</p>
      )}
      {!loading && records.length > 0 && (
        <ol className="leaderboard-list">
          {records.map((r, i) => (
            <li key={i}>
              <span className="leaderboard-rank">{i + 1}</span>
              <span className="leaderboard-name">{r.playerName}</span>
              <span>{formatPercent(r.percentCorrect)}</span>
              <span>{formatDuration(r.totalElapsedMs)}</span>
            </li>
          ))}
        </ol>
      )}
      {currentRun && !submitted && (
        <form className="leaderboard-submit" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={24}
          />
          <button type="submit" className="btn-primary" disabled={!isValidPlayerName(playerName)}>
            Submit score
          </button>
        </form>
      )}
      {submitted && <p className="leaderboard-note">Score submitted!</p>}
    </div>
  );
}
