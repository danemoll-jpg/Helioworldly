// Standalone way to browse top scores without needing to finish a quiz first — one panel per
// mode, since scores only make sense compared within the same setup (findIt/typeIt/
// multipleChoice have very different difficulty). Ranking itself (percent first, faster time as
// tiebreak) lives in network/globalLeaderboard.ts.
import { QUIZ_MODE_LABELS } from '../lib/quizConfig.js';
import { LeaderboardPanel } from './LeaderboardPanel.js';

export interface LeaderboardScreenProps {
  onBack: () => void;
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  return (
    <div className="screen leaderboard-screen">
      <header className="quiz-header">
        <button type="button" className="back-link" onClick={onBack}>
          Back
        </button>
        <span>Leaderboard</span>
      </header>

      {(Object.keys(QUIZ_MODE_LABELS) as Array<keyof typeof QUIZ_MODE_LABELS>).map((mode) => (
        <LeaderboardPanel key={mode} mode={mode} system="planets" view="planets" title={QUIZ_MODE_LABELS[mode]} />
      ))}
    </div>
  );
}
