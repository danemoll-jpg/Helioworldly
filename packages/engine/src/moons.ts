// Tier 2: one view per planet with notable moons (Mercury and Venus have none, so no view for
// them). Every image is a real NASA/JPL photo of the moon itself (full-disk, not a cropped
// montage fragment) composited by hand onto a starfield: the planet sits in the middle (cropped
// from the same solar-system illustration Tier 1 uses, for a consistent look), its moons are
// placed at chosen points on hand-drawn tilted orbit rings around it. This replaced an earlier
// version that stitched together pre-made NASA "family portrait" montages, which read as
// obviously cropped/cheap once you looked closely.
//
// Regions are just the placement coordinates used when compositing each image (see
// packages/client/assets-src/build_moons.py) — every moon lands as a circle, so cx/cy/r is
// exact, not measured after the fact.
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

// ---------- Jupiter ----------
export const MOONS_JUPITER_VIEWBOX: ViewBox = { width: 2000, height: 1100 };
export const MOONS_JUPITER_IMAGE_URL = '/assets/moons-jupiter.jpg';

export const MOONS_JUPITER: CelestialBodyDef[] = (
  [
    {
      id: 'io',
      name: 'Io',
      blurb: 'The most volcanically active body in the solar system, covered in sulfur that gives it a mottled yellow-orange color.',
      cx: 1406,
      cy: 596,
      rx: 46,
      ry: 46,
    },
    {
      id: 'europa',
      name: 'Europa',
      blurb: 'An icy moon with a smooth, cracked shell hiding a liquid-water ocean underneath — a top candidate for finding life elsewhere.',
      cx: 815,
      cy: 763,
      rx: 41,
      ry: 41,
    },
    {
      id: 'ganymede',
      name: 'Ganymede',
      blurb: "The largest moon in the solar system — bigger than the planet Mercury, and the only moon known to have its own magnetic field.",
      cx: 380,
      cy: 455,
      rx: 56,
      ry: 56,
    },
    {
      id: 'callisto',
      name: 'Callisto',
      blurb: 'The most heavily cratered object known in the solar system, its ancient icy surface barely changed in billions of years.',
      cx: 1410,
      cy: 252,
      rx: 53,
      ry: 53,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-jupiter' }));

// ---------- Saturn ----------
export const MOONS_SATURN_VIEWBOX: ViewBox = { width: 2200, height: 1300 };
export const MOONS_SATURN_IMAGE_URL = '/assets/moons-saturn.jpg';

export const MOONS_SATURN: CelestialBodyDef[] = (
  [
    {
      id: 'titan',
      name: 'Titan',
      blurb: "Saturn's largest moon — the only moon with a thick atmosphere, and the only other place with rivers, lakes, and rain (of liquid methane).",
      cx: 1610,
      cy: 1021,
      rx: 55,
      ry: 55,
    },
    {
      id: 'dione',
      name: 'Dione',
      blurb: 'An icy, heavily cratered moon with bright wispy streaks on one side — cliffs left behind by ancient fracturing.',
      cx: 663,
      cy: 431,
      rx: 42,
      ry: 42,
    },
    {
      id: 'tethys',
      name: 'Tethys',
      blurb: 'An icy moon almost entirely made of water ice, scarred by a giant canyon nearly as long as Tethys is wide.',
      cx: 574,
      cy: 730,
      rx: 39,
      ry: 39,
    },
    {
      id: 'mimas',
      name: 'Mimas',
      blurb: 'Nicknamed the "Death Star moon" for the huge crater that covers a third of its diameter.',
      cx: 1438,
      cy: 702,
      rx: 23,
      ry: 23,
    },
    {
      id: 'enceladus',
      name: 'Enceladus',
      blurb: 'A small, brilliantly white icy moon that sprays geysers of water into space from its south pole, hinting at a hidden ocean.',
      cx: 1061,
      cy: 838,
      rx: 27,
      ry: 27,
    },
    {
      id: 'rhea',
      name: 'Rhea',
      blurb: "Saturn's second-largest moon — a heavily cratered ball of ice and rock with a very thin oxygen atmosphere.",
      cx: 1510,
      cy: 352,
      rx: 44,
      ry: 44,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-saturn' }));

// ---------- Uranus ----------
export const MOONS_URANUS_VIEWBOX: ViewBox = { width: 1900, height: 1050 };
export const MOONS_URANUS_IMAGE_URL = '/assets/moons-uranus.jpg';

export const MOONS_URANUS: CelestialBodyDef[] = (
  [
    {
      id: 'oberon',
      name: 'Oberon',
      blurb: "Uranus's outermost large moon — an old, heavily cratered world with a mountain nearly as tall as Mount Everest.",
      cx: 1702,
      cy: 410,
      rx: 48,
      ry: 48,
    },
    {
      id: 'titania',
      name: 'Titania',
      blurb: "The largest moon of Uranus, marked by huge canyons that stretch across its icy surface.",
      cx: 1065,
      cy: 252,
      rx: 50,
      ry: 50,
    },
    {
      id: 'umbriel',
      name: 'Umbriel',
      blurb: "The darkest of Uranus's major moons, its ancient surface covered in a coating that reflects very little light.",
      cx: 443,
      cy: 447,
      rx: 42,
      ry: 42,
    },
    {
      id: 'ariel',
      name: 'Ariel',
      blurb: "The brightest of Uranus's major moons, with a young surface crossed by valleys and fractures.",
      cx: 735,
      cy: 681,
      rx: 41,
      ry: 41,
    },
    {
      id: 'miranda',
      name: 'Miranda',
      blurb: 'The smallest and innermost of the five, with a bizarre jumbled surface of canyons and ridges unlike anywhere else.',
      cx: 1236,
      cy: 594,
      rx: 28,
      ry: 28,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-uranus' }));

// ---------- Neptune — Triton alone ----------
export const MOONS_NEPTUNE_VIEWBOX: ViewBox = { width: 1400, height: 720 };
export const MOONS_NEPTUNE_IMAGE_URL = '/assets/moons-neptune.jpg';

export const MOONS_NEPTUNE: CelestialBodyDef[] = (
  [
    {
      id: 'triton',
      name: 'Triton',
      blurb: "Neptune's largest moon — it orbits backwards compared to Neptune's spin, and has active geysers of icy nitrogen.",
      cx: 1068,
      cy: 490,
      rx: 65,
      ry: 65,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-neptune' }));

// ---------- Mars — Phobos and Deimos ----------
export const MOONS_MARS_VIEWBOX: ViewBox = { width: 1300, height: 600 };
export const MOONS_MARS_IMAGE_URL = '/assets/moons-mars.jpg';

export const MOONS_MARS: CelestialBodyDef[] = (
  [
    {
      id: 'phobos',
      name: 'Phobos',
      blurb: "The larger and closer of Mars's two moons — a lumpy, cratered rock slowly spiraling inward, doomed to crash into Mars someday.",
      cx: 903,
      cy: 389,
      rx: 40,
      ry: 40,
    },
    {
      id: 'deimos',
      name: 'Deimos',
      blurb: "The smaller, more distant of Mars's two moons — likely a captured asteroid, like Phobos.",
      cx: 246,
      cy: 238,
      rx: 32,
      ry: 32,
    },
  ] satisfies Omit<MoonSeed, 'view'>[]
).map((seed) => toBodyDef({ ...seed, view: 'moons-mars' }));

// ---------- Earth — the Moon alone ----------
export const MOONS_EARTH_VIEWBOX: ViewBox = { width: 1300, height: 700 };
export const MOONS_EARTH_IMAGE_URL = '/assets/moons-earth.jpg';

export const MOONS_EARTH: CelestialBodyDef[] = (
  [
    {
      id: 'moon',
      name: 'The Moon',
      blurb: "Earth's only natural satellite, and the only other world humans have ever walked on.",
      cx: 920,
      cy: 485,
      rx: 75,
      ry: 75,
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
