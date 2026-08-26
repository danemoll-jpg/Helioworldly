// Weak-spots map: every planet, colored by how the player's actually done on it so far. Reads
// the same stats storage the quiz commits to after each answer (see hooks/useQuiz.ts).
import { MasteryLevel, PLANETS, masteryLevel } from '@helioworldly/engine';
import { loadStats } from '../lib/storage.js';

export interface MasteryScreenProps {
  onBack: () => void;
}

const LEVEL_LABEL: Record<MasteryLevel, string> = {
  new: 'Not yet quizzed',
  struggling: 'Struggling',
  shaky: 'Shaky',
  solid: 'Solid',
};

export function MasteryScreen({ onBack }: MasteryScreenProps) {
  const stats = loadStats();

  return (
    <div className="screen mastery-screen">
      <header className="quiz-header">
        <button type="button" className="btn-link" onClick={onBack}>
          Back
        </button>
        <span>Mastery</span>
      </header>

      <ul className="mastery-list">
        {PLANETS.map((p) => {
          const level = masteryLevel(stats[p.id]);
          return (
            <li key={p.id} className={`mastery-item mastery-${level}`}>
              <span className="mastery-name">{p.name}</span>
              <span className="mastery-badge">{LEVEL_LABEL[level]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
