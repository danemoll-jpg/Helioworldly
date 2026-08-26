// One shared question a day (see engine's dailyChallenge.ts). A single typed-answer round
// against a highlighted-but-unnamed region — same body for every player today.
import type { FormEvent } from 'react';
import { useState } from 'react';
import { PLANETS_IMAGE_URL, PLANETS_VIEWBOX } from '@helioworldly/engine';
import { useDailyChallenge } from '../hooks/useDailyChallenge.js';
import { CelestialDiagram } from './CelestialDiagram.js';

export interface DailyChallengeScreenProps {
  onBack: () => void;
}

export function DailyChallengeScreen({ onBack }: DailyChallengeScreenProps) {
  const daily = useDailyChallenge();
  const [typedAnswer, setTypedAnswer] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (typedAnswer.trim().length === 0) return;
    daily.answerTypeIt(typedAnswer);
  }

  const revealed = daily.answered !== null || daily.alreadyCompletedToday;

  return (
    <div className="screen daily-screen">
      <header className="quiz-header">
        <button type="button" className="btn-link" onClick={onBack}>
          Back
        </button>
        <span>Daily Challenge</span>
      </header>

      <h2 className="quiz-prompt">{revealed ? daily.body.name : 'What is this?'}</h2>

      <CelestialDiagram
        bodies={[daily.body]}
        viewBox={PLANETS_VIEWBOX}
        imageUrl={PLANETS_IMAGE_URL}
        highlightedId={daily.body.id}
        interactive={false}
      />

      {!revealed && (
        <form className="type-it-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            placeholder="Type the name…"
            autoFocus
          />
          <button type="submit" className="btn-primary">
            Submit
          </button>
        </form>
      )}

      {daily.answered !== null && (
        <p className={daily.answered ? 'feedback-correct' : 'feedback-wrong'}>
          {daily.answered ? 'Correct!' : `Not quite — it's ${daily.body.name}.`}
        </p>
      )}
      {revealed && <p className="learn-detail-blurb">{daily.body.blurb}</p>}
      {daily.alreadyCompletedToday && daily.answered === null && (
        <p className="leaderboard-note">You've already played today's challenge — come back tomorrow!</p>
      )}
    </div>
  );
}
