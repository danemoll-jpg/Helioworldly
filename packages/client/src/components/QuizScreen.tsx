import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { BODIES_BY_SYSTEM, BODIES_BY_VIEW, CelestialSystem, BodyView, QuizMode, VIEWS } from '@helioworldly/engine';
import { useQuiz } from '../hooks/useQuiz.js';
import { CelestialDiagram } from './CelestialDiagram.js';

export interface QuizSummary {
  correct: number;
  total: number;
  percentCorrect: number;
  totalElapsedMs: number;
}

export interface QuizScreenProps {
  mode: QuizMode;
  system: CelestialSystem;
  view: BodyView;
  onFinish: (summary: QuizSummary) => void;
  onExit: () => void;
}

export function QuizScreen({ mode, system, view, onFinish, onExit }: QuizScreenProps) {
  const bodies = BODIES_BY_VIEW[view] ?? [];
  const { imageUrl, viewBox } = VIEWS[view];
  const choicePool = BODIES_BY_SYSTEM[system] ?? bodies;

  const quiz = useQuiz(bodies, mode, choicePool);
  const [feedback, setFeedback] = useState<{ bodyId: string; correct: boolean } | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');

  useEffect(() => {
    if (quiz.isComplete) {
      onFinish({ ...quiz.summary, totalElapsedMs: quiz.totalElapsedMs });
    }
    // Only re-run when completion actually flips — quiz.summary/totalElapsedMs are derived from
    // the same session and would otherwise re-trigger this every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.isComplete]);

  function showFeedback(bodyId: string, correct: boolean) {
    setFeedback({ bodyId, correct });
    window.setTimeout(() => setFeedback(null), 650);
  }

  function handleFindItClick(tappedId: string) {
    if (!quiz.currentBody) return;
    const correct = quiz.answerFindIt(tappedId);
    showFeedback(tappedId, correct);
  }

  function handleTypeItSubmit(e: FormEvent) {
    e.preventDefault();
    if (!quiz.currentBody || typedAnswer.trim().length === 0) return;
    const targetId = quiz.currentBody.id;
    const correct = quiz.answerTypeIt(typedAnswer);
    showFeedback(targetId, correct);
    setTypedAnswer('');
  }

  function handleMultipleChoiceClick(chosenId: string) {
    if (!quiz.currentBody) return;
    const targetId = quiz.currentBody.id;
    const correct = quiz.answerMultipleChoice(chosenId);
    showFeedback(targetId, correct);
  }

  if (quiz.isComplete) return null; // the effect above hands off to the summary screen

  return (
    <div className="screen quiz-screen">
      <header className="quiz-header">
        <button type="button" className="back-link" onClick={onExit}>
          Exit
        </button>
        <span>
          {quiz.session.index + 1} / {quiz.session.order.length}
        </span>
      </header>

      {mode === 'findIt' && quiz.currentBody && <h2 className="quiz-prompt">Find: {quiz.currentBody.name}</h2>}
      {mode !== 'findIt' && <h2 className="quiz-prompt">What is this?</h2>}

      <CelestialDiagram
        bodies={bodies}
        viewBox={viewBox}
        imageUrl={imageUrl}
        onBodyClick={mode === 'findIt' ? handleFindItClick : undefined}
        highlightedId={mode !== 'findIt' ? quiz.currentBody?.id : undefined}
        feedback={feedback}
        interactive={mode === 'findIt'}
      />

      {mode === 'typeIt' && (
        <form className="type-it-form" onSubmit={handleTypeItSubmit}>
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

      {mode === 'multipleChoice' && (
        <div className="choice-grid">
          {quiz.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="btn-choice"
              onClick={() => handleMultipleChoiceClick(choice.id)}
            >
              {choice.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
