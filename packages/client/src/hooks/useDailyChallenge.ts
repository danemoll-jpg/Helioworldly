// One shared question a day, same body for every player (Wordle-style) — see engine's
// dailyChallenge.ts for why. Draws from every body across every collection (planets and moons
// alike), so which collection today's pick belongs to varies day to day.
import { useMemo, useState } from 'react';
import { ALL_BODIES, CelestialBodyDef, dailyBodyId, dailyDateKey, isCloseMatch } from '@helioworldly/engine';

const COMPLETED_KEY = 'helioworldly.dailyChallenge.completedDate';

export interface UseDailyChallengeResult {
  body: CelestialBodyDef;
  answered: boolean | null;
  alreadyCompletedToday: boolean;
  answerFindIt: (tappedBodyId: string) => boolean;
  answerTypeIt: (typedText: string) => boolean;
  answerMultipleChoice: (chosenBodyId: string) => boolean;
}

export function useDailyChallenge(): UseDailyChallengeResult {
  const today = useMemo(() => new Date(), []);
  const dateKey = useMemo(() => dailyDateKey(today), [today]);

  const body = useMemo(() => {
    const id = dailyBodyId(ALL_BODIES.map((b) => b.id), today);
    return ALL_BODIES.find((b) => b.id === id) ?? ALL_BODIES[0];
  }, [today]);

  const [alreadyCompletedToday, setAlreadyCompletedToday] = useState(() => {
    try {
      return localStorage.getItem(COMPLETED_KEY) === dateKey;
    } catch {
      return false;
    }
  });
  const [answered, setAnswered] = useState<boolean | null>(null);

  function markCompleted(correct: boolean) {
    setAnswered(correct);
    setAlreadyCompletedToday(true);
    try {
      localStorage.setItem(COMPLETED_KEY, dateKey);
    } catch {
      // localStorage unavailable — the daily challenge just becomes replayable this session.
    }
  }

  return {
    body,
    answered,
    alreadyCompletedToday,
    answerFindIt: (tappedBodyId) => {
      const correct = tappedBodyId === body.id;
      markCompleted(correct);
      return correct;
    },
    answerTypeIt: (typedText) => {
      const correct = isCloseMatch(typedText, body.name);
      markCompleted(correct);
      return correct;
    },
    answerMultipleChoice: (chosenBodyId) => {
      const correct = chosenBodyId === body.id;
      markCompleted(correct);
      return correct;
    },
  };
}
