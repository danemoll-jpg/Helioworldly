import { QuizMode } from '@helioworldly/engine';
import { QUIZ_MODE_LABELS } from '../lib/quizConfig.js';

export interface SetupScreenProps {
  mode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
  onStart: () => void;
  onBack: () => void;
}

const MODES: QuizMode[] = ['findIt', 'typeIt', 'multipleChoice'];

export function SetupScreen({ mode, onModeChange, onStart, onBack }: SetupScreenProps) {
  return (
    <div className="screen setup-screen">
      <h2>Choose a mode</h2>
      <div className="mode-options">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            className={`mode-option ${mode === m ? 'mode-option-selected' : ''}`}
            onClick={() => onModeChange(m)}
          >
            {QUIZ_MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div className="setup-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn-primary" onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  );
}
