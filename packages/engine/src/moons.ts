// Tier 2: one view per planet with notable moons (Mercury and Venus have none, so no view for
// them). Every image is a real NASA/JPL photo — see packages/client/assets-src/README.md for
// exact sources/credits. Jupiter, Saturn, and Uranus use official pre-composited "family
// portrait" montages directly (no cropping needed — the moons are already cleanly separated on
// a black background, unlike Tier 1's original planets montage). Neptune, Mars, and Earth
// needed compositing since no ready-made montage exists for them; Mars's two moons are placed
// apart on a plain background (no touching-neighbor masking risk, unlike Tier 1's problem case).
//
// Regions were measured directly off each shipped image — for the clean montages, via connected-
// component blob detection (reliable here since there's no grid-line interference and moons
// don't touch); for the composited views, from the placement coordinates themselves. Every
// region confirmed by rendering a semi-transparent overlay before trusting the numbers.
import { circleHull, circlePath, ellipseHull, ellipsePath } from './geometry.js';
import { CelestialBodyDef, ViewBox } from './types.js';

interface MoonSeed {
  id: string;
  name: string;
  blurb: string;
  view: CelestialBodyDef['view'];
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

function toBodyDef(seed: MoonSeed): CelestialBodyDef {
  const isEllipse = seed.rx !== seed.ry;
  return {
    id: seed.id,
    name: seed.name,
    blurb: seed.blurb,
    system: 'moons',
    view: seed.view,
    path: isEllipse ? ellipsePath(seed.cx, seed.cy, seed.rx, seed.ry) : circlePath(seed.cx, seed.cy, seed.rx),
    hull: isEllipse ? ellipseHull(seed.cx, seed.cy, seed.rx, seed.ry) : circleHull(seed.cx, seed.cy, seed.rx),
    centroid: { x: seed.cx, y: seed.cy },
  };
}

// ---------- Jupiter — PIA09352 "Jupiter's Moons: Family Portrait" ----------
export const MOONS_JUPITER_VIEWBOX: ViewBox = { width: 3000, height: 2025 };
export const MOONS_JUPITER_IMAGE_URL = '/assets/moons-jupiter.jpg';

export const MOONS_JUPITER: CelestialBodyDef[] = (
  [
    {
      id: 'io',
      name: 'Io',
      blurb: 'The most volcanically active body in the solar system, covered in sulfur that gives it a mottled yellow-orange color.',
      cx: 461,
      cy: 932.5,
      rx: 168,
      ry: 299.5,
    },
    {
      id: 'europa',
      name: 'Europa',
      blurb: 'An icy moon with a smooth, cracked shell hiding a liquid-water ocean underneath — a top candidate for finding life elsewhere.',
      cx: 1061.5,
      cy: 924.5,
      rx: 174.5,
      ry: 258.5,
    },
    {
      id: 'ganymede',
      name: 'Ganymede',
      blurb: "The largest moon in the solar system — bigger than the planet Mercury, and the only moon known to have its own magnetic field.",
      cx: 1738,
      cy: 927,
      rx: 311,
      ry: 435,
    },
    {
      id: 'callisto',
      name: 'Callisto',
      blurb: 'The most heavily cratered object known in the solar system, its ancient icy surface barely changed in billions of years.',
      cx: 2443.5,
      cy: 920,
      rx: 242.5,
      ry: 400,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-jupiter' }));

// ---------- Saturn — PIA01482 "Saturn System Montage" ----------
export const MOONS_SATURN_VIEWBOX: ViewBox = { width: 4000, height: 3428 };
export const MOONS_SATURN_IMAGE_URL = '/assets/moons-saturn.jpg';

export const MOONS_SATURN: CelestialBodyDef[] = (
  [
    {
      id: 'titan',
      name: 'Titan',
      blurb: "Saturn's largest moon — the only moon with a thick atmosphere, and the only other place with rivers, lakes, and rain (of liquid methane).",
      cx: 3625,
      cy: 219.5,
      rx: 77,
      ry: 84.5,
    },
    {
      id: 'dione',
      name: 'Dione',
      blurb: 'An icy, heavily cratered moon with bright wispy streaks on one side — cliffs left behind by ancient fracturing.',
      cx: 950,
      cy: 1950,
      rx: 850,
      ry: 850,
    },
    {
      id: 'tethys',
      name: 'Tethys',
      blurb: 'An icy moon almost entirely made of water ice, scarred by a giant canyon nearly as long as Tethys is wide.',
      cx: 2590.5,
      cy: 2613,
      rx: 121.5,
      ry: 143,
    },
    {
      id: 'mimas',
      name: 'Mimas',
      blurb: 'Nicknamed the "Death Star moon" for the huge crater that covers a third of its diameter.',
      cx: 3044,
      cy: 2285,
      rx: 73,
      ry: 79,
    },
    {
      id: 'enceladus',
      name: 'Enceladus',
      blurb: 'A small, brilliantly white icy moon that sprays geysers of water into space from its south pole, hinting at a hidden ocean.',
      cx: 1024.5,
      cy: 1013,
      rx: 58.5,
      ry: 62,
    },
    {
      id: 'rhea',
      name: 'Rhea',
      blurb: "Saturn's second-largest moon — a heavily cratered ball of ice and rock with a very thin oxygen atmosphere.",
      cx: 563.5,
      cy: 443.5,
      rx: 61.5,
      ry: 59.5,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-saturn' }));

// ---------- Uranus — PIA01361, five largest moons, left to right ----------
export const MOONS_URANUS_VIEWBOX: ViewBox = { width: 2537, height: 800 };
export const MOONS_URANUS_IMAGE_URL = '/assets/moons-uranus.jpg';

export const MOONS_URANUS: CelestialBodyDef[] = (
  [
    {
      id: 'oberon',
      name: 'Oberon',
      blurb: "Uranus's outermost large moon — an old, heavily cratered world with a mountain nearly as tall as Mount Everest.",
      cx: 151,
      cy: 397,
      rx: 57,
      ry: 60,
    },
    {
      id: 'titania',
      name: 'Titania',
      blurb: "The largest moon of Uranus, marked by huge canyons that stretch across its icy surface.",
      cx: 618.5,
      cy: 401,
      rx: 145.5,
      ry: 148,
    },
    {
      id: 'umbriel',
      name: 'Umbriel',
      blurb: "The darkest of Uranus's major moons, its ancient surface covered in a coating that reflects very little light.",
      cx: 1139,
      cy: 398,
      rx: 132,
      ry: 149,
    },
    {
      id: 'ariel',
      name: 'Ariel',
      blurb: "The brightest of Uranus's major moons, with a young surface crossed by valleys and fractures.",
      cx: 1675,
      cy: 398.5,
      rx: 181,
      ry: 201.5,
    },
    {
      id: 'miranda',
      name: 'Miranda',
      blurb: 'The smallest and innermost of the five, with a bizarre jumbled surface of canyons and ridges unlike anywhere else.',
      cx: 2205.5,
      cy: 395.5,
      rx: 162.5,
      ry: 193.5,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-uranus' }));

// ---------- Neptune — Triton alone (PIA00317) ----------
export const MOONS_NEPTUNE_VIEWBOX: ViewBox = { width: 1600, height: 1244 };
export const MOONS_NEPTUNE_IMAGE_URL = '/assets/moons-neptune.jpg';

export const MOONS_NEPTUNE: CelestialBodyDef[] = (
  [
    {
      id: 'triton',
      name: 'Triton',
      blurb: "Neptune's largest moon — it orbits backwards compared to Neptune's spin, and has active geysers of icy nitrogen.",
      cx: 800,
      cy: 670,
      rx: 795,
      ry: 570,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-neptune' }));

// ---------- Mars — Phobos and Deimos, composited (no ready-made montage exists) ----------
export const MOONS_MARS_VIEWBOX: ViewBox = { width: 1800, height: 1000 };
export const MOONS_MARS_IMAGE_URL = '/assets/moons-mars.jpg';

export const MOONS_MARS: CelestialBodyDef[] = (
  [
    {
      id: 'phobos',
      name: 'Phobos',
      blurb: "The larger and closer of Mars's two moons — a lumpy, cratered rock slowly spiraling inward, doomed to crash into Mars someday.",
      cx: 480,
      cy: 500,
      rx: 310,
      ry: 310,
    },
    {
      id: 'deimos',
      name: 'Deimos',
      blurb: "The smaller, more distant of Mars's two moons — likely a captured asteroid, like Phobos.",
      cx: 1300,
      cy: 500,
      rx: 190,
      ry: 190,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-mars' }));

// ---------- Earth — the Moon alone ----------
export const MOONS_EARTH_VIEWBOX: ViewBox = { width: 1400, height: 1400 };
export const MOONS_EARTH_IMAGE_URL = '/assets/moons-earth.jpg';

export const MOONS_EARTH: CelestialBodyDef[] = (
  [
    {
      id: 'moon',
      name: 'The Moon',
      blurb: "Earth's only natural satellite, and the only other world humans have ever walked on.",
      cx: 700,
      cy: 701,
      rx: 590,
      ry: 590,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-earth' }));

export const ALL_MOONS: CelestialBodyDef[] = [
  ...MOONS_EARTH,
  ...MOONS_MARS,
  ...MOONS_JUPITER,
  ...MOONS_SATURN,
  ...MOONS_URANUS,
  ...MOONS_NEPTUNE,
];

// Single source of truth for the UI's "which collection" pickers (Setup/Learn/Leaderboard) —
// planets first, then each moon view. Adding a body view later (surface features) just means
// adding one more entry here.
export interface CollectionMeta {
  system: CelestialBodyDef['system'];
  view: CelestialBodyDef['view'];
  label: string;
}

export const COLLECTIONS: CollectionMeta[] = [
  { system: 'planets', view: 'planets', label: 'Planets' },
  { system: 'moons', view: 'moons-earth', label: "Earth's Moon" },
  { system: 'moons', view: 'moons-mars', label: "Mars's moons" },
  { system: 'moons', view: 'moons-jupiter', label: "Jupiter's moons" },
  { system: 'moons', view: 'moons-saturn', label: "Saturn's moons" },
  { system: 'moons', view: 'moons-uranus', label: "Uranus's moons" },
  { system: 'moons', view: 'moons-neptune', label: "Neptune's moon" },
];
