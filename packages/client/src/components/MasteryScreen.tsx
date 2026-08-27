// Weak-spots map: every collection, colored by how the player's actually done on it so far.
// One section per view rather than a picker — the whole map is visible at a glance, same
// "stack every BodyView's own section" precedent Innerworldly's mastery screen used. Reads the
// same stats storage the quiz commits to after each answer (see hooks/useQuiz.ts) — one shared
// map keyed by body id, covering every collection.
import { BODIES_BY_VIEW, COLLECTIONS, MasteryLevel, masteryLevel } from '@helioworldly/engine';
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
        <button type="button" className="back-link" onClick={onBack}>
          Back
        </button>
        <span>Mastery</span>
      </header>

      {COLLECTIONS.map((collection) => {
        const bodies = BODIES_BY_VIEW[collection.view] ?? [];
        return (
          <section key={collection.view} className="mastery-section">
            <h3 className="mastery-section-label">{collection.label}</h3>
            <ul className="mastery-list">
              {bodies.map((b) => {
                const level = masteryLevel(stats[b.id]);
                return (
                  <li key={b.id} className={`mastery-item mastery-${level}`}>
                    <span className="mastery-name">{b.name}</span>
                    <span className="mastery-badge">{LEVEL_LABEL[level]}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
