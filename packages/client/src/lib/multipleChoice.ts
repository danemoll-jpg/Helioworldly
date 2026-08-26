// Builds the 4-button option set for multipleChoice mode: the correct body plus 3 random
// distractors from the same view (so options are visually/thematically comparable), shuffled.
import { CelestialBodyDef } from '@helioworldly/engine';

export function buildChoices(
  correct: CelestialBodyDef,
  pool: CelestialBodyDef[],
  count = 4,
  rng: () => number = Math.random,
): CelestialBodyDef[] {
  const distractorPool = pool.filter((body) => body.id !== correct.id);
  const distractors: CelestialBodyDef[] = [];
  const remaining = [...distractorPool];

  while (distractors.length < count - 1 && remaining.length > 0) {
    const index = Math.floor(rng() * remaining.length);
    distractors.push(remaining[index]);
    remaining.splice(index, 1);
  }

  const choices = [correct, ...distractors];
  // Fisher-Yates shuffle.
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return choices;
}
