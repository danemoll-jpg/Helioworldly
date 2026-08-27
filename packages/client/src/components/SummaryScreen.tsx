import { BodyView, CelestialSystem, QuizMode } from '@helioworldly/engine';
import { formatDuration, formatPercent } from '../lib/format.js';
import { LeaderboardPanel } from './LeaderboardPanel.js';

export interface QuizSummary {
  correct: number;
  total: number;
  percentCorrect: number;
  totalElapsedMs: number;
}

export interface SummaryScreenProps {
  summary: QuizSummary;
  mode: QuizMode;
  system: CelestialSystem;
  view: BodyView;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function SummaryScreen({ summary, mode, system, view, onPlayAgain, onHome }: SummaryScreenProps) {
  return (
    <div className="screen summary-screen">
      <h2>Session complete</h2>
      <p className="summary-score">
        {summary.correct} / {summary.total} correct ({formatPercent(summary.percentCorrect)})
      </p>
      <p className="summary-time">Time: {formatDuration(summary.totalElapsedMs)}</p>

      <LeaderboardPanel
        mode={mode}
        system={system}
        view={view}
        currentRun={{ percentCorrect: summary.percentCorrect, totalElapsedMs: summary.totalElapsedMs }}
      />

      <div className="summary-actions">
        <button type="button" className="btn-secondary" onClick={onHome}>
          Home
        </button>
        <button type="button" className="btn-primary" onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    </div>
  );
}
