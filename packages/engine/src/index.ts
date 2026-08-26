// Public entry point for @helioworldly/engine — everything the client package imports.
export * from './types.js';
export * from './geometry.js';
export * from './matching.js';
export * from './stats.js';
export * from './weighting.js';
export * from './dailyChallenge.js';
export * from './session.js';

import { PLANETS, PLANETS_IMAGE_URL, PLANETS_VIEWBOX } from './planets.js';
import { CelestialBodyDef, ViewBox } from './types.js';

export { PLANETS, PLANETS_IMAGE_URL, PLANETS_VIEWBOX };

// All bodies across every system, aggregated. Currently just planets (Tier 1) — moons and
// surface features (see BACKLOG.md) fold into this the same way once built.
export const ALL_BODIES: CelestialBodyDef[] = [...PLANETS];

export const BODY_BY_ID: Record<string, CelestialBodyDef> = Object.fromEntries(
  ALL_BODIES.map((body) => [body.id, body]),
);

export const VIEWS: Record<string, { imageUrl: string; viewBox: ViewBox }> = {
  planets: { imageUrl: PLANETS_IMAGE_URL, viewBox: PLANETS_VIEWBOX },
};

export const BODIES_BY_VIEW: Record<string, CelestialBodyDef[]> = ALL_BODIES.reduce(
  (acc, body) => {
    (acc[body.view] ??= []).push(body);
    return acc;
  },
  {} as Record<string, CelestialBodyDef[]>,
);
