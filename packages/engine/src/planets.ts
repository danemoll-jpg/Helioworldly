// The 8 planets, arranged heliocentrically — the Sun at the center, each planet on its own
// orbit ring, matching what "Helioworldly" actually implies (v1 used a NASA family-portrait
// side-by-side layout that never showed the Sun at all — fixed after feedback). Orbit radii and
// planet sizes are deliberately compressed/non-uniform, not to real scale — a true-to-scale
// solar system can't fit on one screen (Neptune orbits ~30x farther out than Earth). Earth's
// Moon is intentionally NOT in this image — it belongs to the "moons" tier (see BACKLOG.md).
//
// Every planet (and the Sun) is a real NASA/JPL photo, not an illustration: each planet is
// cropped from the "Solar System Montage" (PIA03153); the Sun is a Solar Dynamics Observatory
// photo (PIA26681) — see packages/client/assets-src/README.md for exact sources/credits. Only
// the orbit rings, starfield, and Saturn's ring graphic are drawn, not photographed. Composited
// with a one-time Python/Pillow script (not committed, see assets-src/README.md); regions here
// are simple circles (center + radius) matching where each cropped photo landed in the final
// 2400x2400 image, confirmed by eye against the actual rendered composite.
import { circleHull, circlePath } from './geometry.js';
import { CelestialBodyDef, ViewBox } from './types.js';

export const PLANETS_VIEWBOX: ViewBox = { width: 2400, height: 2400 };
export const PLANETS_IMAGE_URL = '/assets/planets-heliocentric.jpg';

interface PlanetSeed {
  id: string;
  name: string;
  blurb: string;
  cx: number;
  cy: number;
  r: number; // hit-region radius — a bit more generous than the drawn thumbnail for easy tapping
}

const PLANET_SEEDS: PlanetSeed[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    blurb: 'The smallest planet and the closest to the Sun — a single day there lasts longer than its whole year.',
    cx: 1574,
    cy: 1226,
    r: 46,
  },
  {
    id: 'venus',
    name: 'Venus',
    blurb: "The hottest planet, thanks to a thick, crushing atmosphere that traps heat — hotter even than Mercury.",
    cx: 1475,
    cy: 1357,
    r: 63,
  },
  {
    id: 'earth',
    name: 'Earth',
    blurb: 'Our home — the only planet known to have liquid water on its surface and life.',
    cx: 1149,
    cy: 1431,
    r: 67,
  },
  {
    id: 'mars',
    name: 'Mars',
    blurb: 'The "Red Planet", colored by iron oxide (rust) in its soil — home to the largest volcano in the solar system.',
    cx: 679,
    cy: 1374,
    r: 55,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    blurb: 'The largest planet by far — its Great Red Spot is a storm bigger than Earth that has raged for centuries.',
    cx: 393,
    cy: 1171,
    r: 137,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    blurb: 'Famous for its bright, wide ring system, made mostly of ice and rock — and light enough to float in water.',
    cx: 660,
    cy: 891,
    r: 170, // generous enough to cover the drawn ring graphic, not just the body
  },
  {
    id: 'uranus',
    name: 'Uranus',
    blurb: 'An ice giant that spins almost on its side — its poles take turns facing the Sun over its 84-year orbit.',
    cx: 1291,
    cy: 781,
    r: 92,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    blurb: 'The windiest planet — supersonic storms tear across its deep blue, distant atmosphere.',
    cx: 2080,
    cy: 904,
    r: 94,
  },
];

export const PLANETS: CelestialBodyDef[] = PLANET_SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  blurb: seed.blurb,
  system: 'planets',
  view: 'planets',
  path: circlePath(seed.cx, seed.cy, seed.r),
  hull: circleHull(seed.cx, seed.cy, seed.r),
  centroid: { x: seed.cx, y: seed.cy },
}));
