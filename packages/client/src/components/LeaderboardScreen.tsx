// Standalone way to browse top scores without needing to finish a quiz first — pick a
// collection, then see one panel per mode, since scores only make sense compared within the
// same setup (findIt/typeIt/multipleChoice have very different difficulty). Ranking itself
// (percent first, faster time as tiebreak) lives in network/globalLeaderboard.ts.
import { useState } from 'react';
import { CollectionMeta } from '@helioworldly/engine';
import { CollectionPicker } from './CollectionPicker.js';
import { LeaderboardPanel } from './LeaderboardPanel.js';
import { QUIZ_MODE_LABELS } from '../lib/quizConfig.js';

export interface LeaderboardScreenProps {
  onBack: () => void;
}

const DEFAULT_COLLECTION: CollectionMeta = { system: 'planets', view: 'planets', label: 'Planets' };

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [collection, setCollection] = useState<CollectionMeta>(DEFAULT_COLLECTION);

  return (
    <div className="screen leaderboard-screen">
      <header className="quiz-header">
        <button type="button" className="back-link" onClick={onBack}>
          Back
        </button>
        <span>Leaderboard</span>
      </header>

      <CollectionPicker system={collection.system} view={collection.view} onChange={setCollection} />

      {(Object.keys(QUIZ_MODE_LABELS) as Array<keyof typeof QUIZ_MODE_LABELS>).map((mode) => (
        <LeaderboardPanel
          key={mode}
          mode={mode}
          system={collection.system}
          view={collection.view}
          title={QUIZ_MODE_LABELS[mode]}
        />
      ))}
    </div>
  );
}
