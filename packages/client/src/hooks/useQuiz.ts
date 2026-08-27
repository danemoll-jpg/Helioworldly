// Drives one quiz session (any of the three modes) against a given list of bodies. Owns the
// engine session state, persists per-body stats to localStorage after every answer (so progress
// survives a mid-session reload), and exposes one `answer*` function per mode for the screen to
// call — the screen doesn't need to know how correctness is decided for its mode.
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  BODY_BY_ID,
  CelestialBodyDef,
  QuizMode,
  QuizSessionState,
  StatsMap,
  applyResultToStats,
  currentBodyId as engineCurrentBodyId,
  isCloseMatch,
  isComplete as engineIsComplete,
  recordAnswer,
  scoreSummary,
  startSession,
  totalElapsedMs as engineTotalElapsedMs,
} from '@helioworldly/engine';
import { buildChoices } from '../lib/multipleChoice.js';
import { loadStats, saveStats } from '../lib/storage.js';

export interface UseQuizResult {
  session: QuizSessionState;
  currentBody: CelestialBodyDef | undefined;
  choices: CelestialBodyDef[];
  isComplete: boolean;
  summary: { correct: number; total: number; percentCorrect: number };
  totalElapsedMs: number;
  answerFindIt: (tappedBodyId: string) => boolean;
  answerTypeIt: (typedText: string) => boolean;
  answerMultipleChoice: (chosenBodyId: string) => boolean;
  restart: () => void;
}

function buildSession(bodies: CelestialBodyDef[], mode: QuizMode, stats: StatsMap): QuizSessionState {
  return startSession(bodies.map((b) => b.id), mode, stats);
}

export function useQuiz(
  bodies: CelestialBodyDef[],
  mode: QuizMode,
  choicePool: CelestialBodyDef[] = bodies,
): UseQuizResult {
  const statsRef = useRef<StatsMap>(loadStats());
  const questionStartRef = useRef<number>(Date.now());

  const [session, setSession] = useState<QuizSessionState>(() => buildSession(bodies, mode, statsRef.current));

  const currentId = engineCurrentBodyId(session);
  const currentBody = currentId ? BODY_BY_ID[currentId] : undefined;

  // Distractors come from choicePool, not necessarily `bodies` — a small view (e.g. Neptune's
  // one moon) wouldn't have enough of its own bodies to fill 4 choices otherwise.
  const choices = useMemo(() => {
    if (mode !== 'multipleChoice' || !currentBody) return [];
    return buildChoices(currentBody, choicePool);
  }, [mode, currentBody, choicePool]);

  const commit = useCallback(
    (correct: boolean) => {
      if (!currentId) return correct;
      const timeMs = Date.now() - questionStartRef.current;
      statsRef.current = applyResultToStats(statsRef.current, { bodyId: currentId, correct, timeMs });
      saveStats(statsRef.current);
      setSession((prev) => recordAnswer(prev, correct, timeMs));
      questionStartRef.current = Date.now();
      return correct;
    },
    [currentId],
  );

  const answerFindIt = useCallback(
    (tappedBodyId: string) => (currentBody ? commit(tappedBodyId === currentBody.id) : false),
    [currentBody, commit],
  );

  const answerTypeIt = useCallback(
    (typedText: string) => (currentBody ? commit(isCloseMatch(typedText, currentBody.name)) : false),
    [currentBody, commit],
  );

  const answerMultipleChoice = useCallback(
    (chosenBodyId: string) => (currentBody ? commit(chosenBodyId === currentBody.id) : false),
    [currentBody, commit],
  );

  const restart = useCallback(() => {
    questionStartRef.current = Date.now();
    setSession(buildSession(bodies, mode, statsRef.current));
  }, [bodies, mode]);

  return {
    session,
    currentBody,
    choices,
    isComplete: engineIsComplete(session),
    summary: scoreSummary(session),
    totalElapsedMs: engineTotalElapsedMs(session),
    answerFindIt,
    answerTypeIt,
    answerMultipleChoice,
    restart,
  };
}
