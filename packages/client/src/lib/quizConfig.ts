// What the Setup screen collects before a quiz session starts. Tier 1 has just one system/view
// to choose ("planets"), so `system`/`view` are fixed for now — kept as explicit fields so
// Moons/Surface (BACKLOG.md) slot in as more choices without reshaping this type.
import { BodyView, CelestialSystem, QuizMode } from '@helioworldly/engine';

export interface QuizConfig {
  mode: QuizMode;
  system: CelestialSystem;
  view: BodyView;
}

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  mode: 'findIt',
  system: 'planets',
  view: 'planets',
};

export const QUIZ_MODE_LABELS: Record<QuizMode, string> = {
  findIt: 'Find it',
  typeIt: 'Type its name',
  multipleChoice: 'Multiple choice',
};
