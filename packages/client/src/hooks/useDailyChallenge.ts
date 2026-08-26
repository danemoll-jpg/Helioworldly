// One shared question a day, same body for every player (Wordle-style) — see engine's
// dailyChallenge.ts for why. Tier 1 draws only from the planets; later tiers widen the pool.
import { useMemo, useState } from 'react';
import { CelestialBodyDef, PLANETS, dailyBodyId, dailyDateKey, isCloseMatch } from '@helioworldly/engine';

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
    const id = dailyBodyId(PLANETS.map((p) => p.id), today);
    return PLANETS.find((p) => p.id === id) ?? PLANETS[0];
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
