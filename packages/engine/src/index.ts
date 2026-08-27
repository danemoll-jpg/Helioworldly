// Public entry point for @helioworldly/engine — everything the client package imports.
export * from './types.js';
export * from './geometry.js';
export * from './matching.js';
export * from './stats.js';
export * from './weighting.js';
export * from './dailyChallenge.js';
export * from './session.js';

import { PLANETS, PLANETS_IMAGE_URL, PLANETS_VIEWBOX } from './planets.js';
import {
  ALL_MOONS,
  COLLECTIONS,
  MOONS_EARTH_IMAGE_URL,
  MOONS_EARTH_VIEWBOX,
  MOONS_JUPITER_IMAGE_URL,
  MOONS_JUPITER_VIEWBOX,
  MOONS_MARS_IMAGE_URL,
  MOONS_MARS_VIEWBOX,
  MOONS_NEPTUNE_IMAGE_URL,
  MOONS_NEPTUNE_VIEWBOX,
  MOONS_SATURN_IMAGE_URL,
  MOONS_SATURN_VIEWBOX,
  MOONS_URANUS_IMAGE_URL,
  MOONS_URANUS_VIEWBOX,
} from './moons.js';
import { CelestialBodyDef, CelestialSystem, ViewBox } from './types.js';

export { PLANETS, PLANETS_IMAGE_URL, PLANETS_VIEWBOX };
export * from './moons.js';

// All bodies across every system, aggregated.
export const ALL_BODIES: CelestialBodyDef[] = [...PLANETS, ...ALL_MOONS];

export const BODY_BY_ID: Record<string, CelestialBodyDef> = Object.fromEntries(
  ALL_BODIES.map((body) => [body.id, body]),
);

// Each view's own module exports its IMAGE_URL/VIEWBOX constants — these two helpers just pick
// the right pair, so VIEWS below can be built generically off COLLECTIONS instead of repeating
// one map entry per view by hand.
function viewImageUrl(view: CelestialBodyDef['view']): string {
  switch (view) {
    case 'planets':
      return PLANETS_IMAGE_URL;
    case 'moons-earth':
      return MOONS_EARTH_IMAGE_URL;
    case 'moons-mars':
      return MOONS_MARS_IMAGE_URL;
    case 'moons-jupiter':
      return MOONS_JUPITER_IMAGE_URL;
    case 'moons-saturn':
      return MOONS_SATURN_IMAGE_URL;
    case 'moons-uranus':
      return MOONS_URANUS_IMAGE_URL;
    case 'moons-neptune':
      return MOONS_NEPTUNE_IMAGE_URL;
  }
}

function viewViewBox(view: CelestialBodyDef['view']): ViewBox {
  switch (view) {
    case 'planets':
      return PLANETS_VIEWBOX;
    case 'moons-earth':
      return MOONS_EARTH_VIEWBOX;
    case 'moons-mars':
      return MOONS_MARS_VIEWBOX;
    case 'moons-jupiter':
      return MOONS_JUPITER_VIEWBOX;
    case 'moons-saturn':
      return MOONS_SATURN_VIEWBOX;
    case 'moons-uranus':
      return MOONS_URANUS_VIEWBOX;
    case 'moons-neptune':
      return MOONS_NEPTUNE_VIEWBOX;
  }
}

export const VIEWS: Record<string, { imageUrl: string; viewBox: ViewBox }> = Object.fromEntries(
  COLLECTIONS.map((c) => [c.view, { imageUrl: viewImageUrl(c.view), viewBox: viewViewBox(c.view) }]),
);

export const BODIES_BY_VIEW: Record<string, CelestialBodyDef[]> = ALL_BODIES.reduce(
  (acc, body) => {
    (acc[body.view] ??= []).push(body);
    return acc;
  },
  {} as Record<string, CelestialBodyDef[]>,
);

// Grouped by system rather than view — used as the multipleChoice distractor pool so a small
// view (e.g. Neptune's single moon) still has enough real wrong answers to offer.
export const BODIES_BY_SYSTEM: Record<CelestialSystem, CelestialBodyDef[]> = ALL_BODIES.reduce(
  (acc, body) => {
    (acc[body.system] ??= []).push(body);
    return acc;
  },
  {} as Record<CelestialSystem, CelestialBodyDef[]>,
);
