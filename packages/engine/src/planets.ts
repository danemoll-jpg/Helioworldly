// The 8 planets, hit-tested against NASA/JPL's "Solar System Montage" (PIA03153,
// https://photojournal.jpl.nasa.gov/catalog/PIA03153 — credit NASA/JPL, public domain US
// government work). The montage also includes Earth's Moon for scale/context; it's part of the
// image but intentionally NOT one of these regions — the Moon belongs to the "moons" tier (see
// BACKLOG.md), not the planets tier.
//
// Regions were measured off the downloaded image itself — same "verify against the real photo"
// approach Innerworldly used, but automated here (per-planet windowed non-black bounding-box
// detection, since several planets visually overlap/touch in the montage — see the script noted
// in BACKLOG.md) rather than hand-eyeballed. Each region is an ellipse (center + rx/ry) in the
// original image's pixel space, turned into a hit-testable polygon hull via geometry.ts's
// ellipseHull/ellipsePath. Confirmed by rendering a semi-transparent overlay on the actual photo
// (same check the rest of the series uses) before trusting these — see BACKLOG.md.
import { ellipseHull, ellipsePath } from './geometry.js';
import { CelestialBodyDef, ViewBox } from './types.js';

export const PLANETS_VIEWBOX: ViewBox = { width: 4500, height: 5600 };
export const PLANETS_IMAGE_URL = '/assets/planets-montage.jpg';

interface PlanetSeed {
  id: string;
  name: string;
  blurb: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

const PLANET_SEEDS: PlanetSeed[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    blurb: 'The smallest planet and the closest to the Sun — a single day there lasts longer than its whole year.',
    cx: 798,
    cy: 503,
    rx: 128,
    ry: 235,
  },
  {
    id: 'venus',
    name: 'Venus',
    blurb: "The hottest planet, thanks to a thick, crushing atmosphere that traps heat — hotter even than Mercury.",
    cx: 1584,
    cy: 804,
    rx: 486,
    ry: 496,
  },
  {
    id: 'earth',
    name: 'Earth',
    blurb: 'Our home — the only planet known to have liquid water on its surface and life.',
    cx: 2407,
    cy: 1175,
    rx: 517,
    ry: 517,
  },
  {
    id: 'mars',
    name: 'Mars',
    blurb: 'The "Red Planet", colored by iron oxide (rust) in its soil — home to the largest volcano in the solar system.',
    cx: 3009,
    cy: 1707,
    rx: 439,
    ry: 439,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    blurb: 'The largest planet by far — its Great Red Spot is a storm bigger than Earth that has raged for centuries.',
    cx: 3388,
    cy: 2757,
    rx: 834,
    ry: 862,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    blurb: 'Famous for its bright, wide ring system, made mostly of ice and rock — and light enough to float in water.',
    cx: 2911,
    cy: 3667,
    rx: 611,
    ry: 611,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    blurb: 'An ice giant that spins almost on its side — its poles take turns facing the Sun over its 84-year orbit.',
    cx: 2267,
    cy: 4710,
    rx: 611,
    ry: 450,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    blurb: 'The windiest planet — supersonic storms tear across its deep blue, distant atmosphere.',
    cx: 1303,
    cy: 4753,
    rx: 720,
    ry: 590,
  },
];

export const PLANETS: CelestialBodyDef[] = PLANET_SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  blurb: seed.blurb,
  system: 'planets',
  view: 'planets',
  path: ellipsePath(seed.cx, seed.cy, seed.rx, seed.ry),
  hull: ellipseHull(seed.cx, seed.cy, seed.rx, seed.ry),
  centroid: { x: seed.cx, y: seed.cy },
}));
