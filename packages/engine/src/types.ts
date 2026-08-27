// Core types for the framework-free Helioworldly quiz engine. Mirrors the shape Innerworldly's
// BodySystem/BodyView split uses, just for celestial bodies instead of anatomy — see the repo
// README's "Why it fits Innerworldly's architecture instead" section.

// Which tier a body belongs to. Planets ships first; moons and surface features are tracked in
// BACKLOG.md and slot into the same shape once built.
export type CelestialSystem = 'planets' | 'moons' | 'surface';

// A single diagram/photo a quiz can be played against. Tier 1 had exactly one view ('planets').
// Tier 2 adds one view per planet that has notable moons — same reason Innerworldly's organs
// system needed two views (digestive/urinary) instead of one: a single flat image can't show
// every body in a system at once. Mercury and Venus have no moons, so no view for them.
export type BodyView =
  | 'planets'
  | 'moons-earth'
  | 'moons-mars'
  | 'moons-jupiter'
  | 'moons-saturn'
  | 'moons-uranus'
  | 'moons-neptune';

export interface Point {
  x: number;
  y: number;
}

// The fixed pixel dimensions of the photo a view's hit regions are measured against.
export interface ViewBox {
  width: number;
  height: number;
}

// One celestial body: a name/blurb plus a hit-testable region positioned against its view's
// photo. `path` is an SVG path string (drawn for the quiz-feedback tint); `hull` is the same
// shape as a polygon, used for point-in-polygon hit testing (see geometry.ts); `centroid` is
// where labels/markers anchor.
export interface CelestialBodyDef {
  id: string;
  name: string;
  blurb: string;
  system: CelestialSystem;
  view: BodyView;
  path: string;
  hull: Point[];
  centroid: Point;
}

export type QuizMode = 'findIt' | 'typeIt' | 'multipleChoice';

export interface QuizResult {
  bodyId: string;
  correct: boolean;
  timeMs: number;
}

// The full session order is decided once at session start, so the total question count (and
// progress through it) is known immediately rather than discovered as the player goes.
export interface QuizSessionState {
  mode: QuizMode;
  order: string[]; // body ids, in play order
  index: number;
  results: QuizResult[];
  startedAt: number;
}

export interface BodyStats {
  seen: number;
  missed: number;
}

export type StatsMap = Record<string, BodyStats>;

export type MasteryLevel = 'new' | 'struggling' | 'shaky' | 'solid';
