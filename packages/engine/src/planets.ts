// The 8 planets, positioned against NASA/JPL's own official solar-system illustration
// (PIA11800, https://science.nasa.gov/photojournal/our-solar-system-features-eight-planets/ —
// credit NASA/JPL, public domain US government work). v1 tried compositing planet cutouts into
// a from-scratch heliocentric layout; several planets came out visibly rough at the crop edges,
// so this replaces that with NASA's own clean, pre-composited illustration instead — same
// heliocentric idea (Sun at the center, planets on drawn orbit rings), just professionally made.
// NASA's own caption: "intentionally fanciful, as the planets are depicted far closer together
// than they really are" — scale and spacing are deliberately compressed, not astronomically
// accurate, same tradeoff v1 already made. Earth's Moon is NOT one of these regions — it's
// visible in the image but belongs to the "moons" tier (see BACKLOG.md). The image also
// includes a comet, the asteroid belt, and a distant dwarf planet (Pluto); none of those are
// interactive either — this tier is just the 8 planets.
//
// Regions were measured directly off the shipped image (a resize of the source — see
// packages/client/assets-src/README.md) using labeled coordinate-grid crops, confirmed by
// rendering a semi-transparent overlay on the actual image before trusting these numbers.
// Saturn is the one ellipse (its rings make it visibly wider than tall); every other region is
// a circle, sized a bit more generously than the drawn planet for easy tapping.
import { circleHull, circlePath, ellipseHull, ellipsePath } from './geometry.js';
import { CelestialBodyDef, ViewBox } from './types.js';

export const PLANETS_VIEWBOX: ViewBox = { width: 3600, height: 2261 };
export const PLANETS_IMAGE_URL = '/assets/solar-system.jpg';

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
    cx: 2634,
    cy: 1393,
    rx: 55,
    ry: 55,
  },
  {
    id: 'venus',
    name: 'Venus',
    blurb: "The hottest planet, thanks to a thick, crushing atmosphere that traps heat — hotter even than Mercury.",
    cx: 2850,
    cy: 1325,
    rx: 78,
    ry: 78,
  },
  {
    id: 'earth',
    name: 'Earth',
    blurb: 'Our home — the only planet known to have liquid water on its surface and life.',
    cx: 3079,
    cy: 1191,
    rx: 80,
    ry: 80,
  },
  {
    id: 'mars',
    name: 'Mars',
    blurb: 'The "Red Planet", colored by iron oxide (rust) in its soil — home to the largest volcano in the solar system.',
    cx: 3365,
    cy: 999,
    rx: 75,
    ry: 75,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    blurb: 'The largest planet by far — its Great Red Spot is a storm bigger than Earth that has raged for centuries.',
    cx: 1378,
    cy: 486,
    rx: 122,
    ry: 122,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    blurb: 'Famous for its bright, wide ring system, made mostly of ice and rock — and light enough to float in water.',
    cx: 991,
    cy: 330,
    rx: 145,
    ry: 78,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    blurb: 'An ice giant that spins almost on its side — its poles take turns facing the Sun over its 84-year orbit.',
    cx: 749,
    cy: 277,
    rx: 68,
    ry: 68,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    blurb: 'The windiest planet — supersonic storms tear across its deep blue, distant atmosphere.',
    cx: 577,
    cy: 249,
    rx: 75,
    ry: 75,
  },
];

export const PLANETS: CelestialBodyDef[] = PLANET_SEEDS.map((seed) => {
  const isEllipse = seed.rx !== seed.ry;
  return {
    id: seed.id,
    name: seed.name,
    blurb: seed.blurb,
    system: 'planets',
    view: 'planets',
    path: isEllipse ? ellipsePath(seed.cx, seed.cy, seed.rx, seed.ry) : circlePath(seed.cx, seed.cy, seed.rx),
    hull: isEllipse ? ellipseHull(seed.cx, seed.cy, seed.rx, seed.ry) : circleHull(seed.cx, seed.cy, seed.rx),
    centroid: { x: seed.cx, y: seed.cy },
  };
});
