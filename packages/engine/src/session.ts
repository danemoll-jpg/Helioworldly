// Quiz session state machine — pure data transitions, no rendering/persistence. A screen layer
// (packages/client/src/hooks/useQuiz.ts) owns wiring this to React state.
import { QuizMode, QuizResult, QuizSessionState, StatsMap } from './types.js';
import { weightedOrder } from './weighting.js';

export function startSession(
  ids: string[],
  mode: QuizMode,
  stats: StatsMap,
  rng: () => number = Math.random,
): QuizSessionState {
  return {
    mode,
    order: weightedOrder(ids, stats, rng),
    index: 0,
    results: [],
    startedAt: Date.now(),
  };
}

export function currentBodyId(session: QuizSessionState): string | undefined {
  return session.order[session.index];
}

export function isComplete(session: QuizSessionState): boolean {
  return session.index >= session.order.length;
}

export function recordAnswer(session: QuizSessionState, correct: boolean, timeMs: number): QuizSessionState {
  const bodyId = currentBodyId(session);
  if (bodyId === undefined) return session;

  const result: QuizResult = { bodyId, correct, timeMs };
  return {
    ...session,
    index: session.index + 1,
    results: [...session.results, result],
  };
}

export function scoreSummary(session: QuizSessionState): { correct: number; total: number; percentCorrect: number } {
  const total = session.results.length;
  const correct = session.results.filter((r) => r.correct).length;
  const percentCorrect = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, percentCorrect };
}

export function totalElapsedMs(session: QuizSessionState): number {
  return session.results.reduce((sum, r) => sum + r.timeMs, 0);
}
