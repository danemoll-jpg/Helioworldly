import { describe, expect, it } from 'vitest';
import { pointInPolygon } from '../src/geometry.js';
import {
  ALL_MOONS,
  COLLECTIONS,
  MOONS_EARTH,
  MOONS_EARTH_VIEWBOX,
  MOONS_JUPITER,
  MOONS_JUPITER_VIEWBOX,
  MOONS_MARS,
  MOONS_MARS_VIEWBOX,
  MOONS_NEPTUNE,
  MOONS_NEPTUNE_VIEWBOX,
  MOONS_SATURN,
  MOONS_SATURN_VIEWBOX,
  MOONS_URANUS,
  MOONS_URANUS_VIEWBOX,
} from '../src/moons.js';

const VIEW_GROUPS = [
  { name: 'earth', bodies: MOONS_EARTH, viewBox: MOONS_EARTH_VIEWBOX, view: 'moons-earth', count: 1 },
  { name: 'mars', bodies: MOONS_MARS, viewBox: MOONS_MARS_VIEWBOX, view: 'moons-mars', count: 2 },
  { name: 'jupiter', bodies: MOONS_JUPITER, viewBox: MOONS_JUPITER_VIEWBOX, view: 'moons-jupiter', count: 4 },
  { name: 'saturn', bodies: MOONS_SATURN, viewBox: MOONS_SATURN_VIEWBOX, view: 'moons-saturn', count: 6 },
  { name: 'uranus', bodies: MOONS_URANUS, viewBox: MOONS_URANUS_VIEWBOX, view: 'moons-uranus', count: 5 },
  { name: 'neptune', bodies: MOONS_NEPTUNE, viewBox: MOONS_NEPTUNE_VIEWBOX, view: 'moons-neptune', count: 1 },
];

describe.each(VIEW_GROUPS)('$name moons', ({ bodies, viewBox, view, count }) => {
  it(`has exactly ${count} bodies`, () => {
    expect(bodies).toHaveLength(count);
  });

  it("every body's hull contains its own centroid", () => {
    for (const body of bodies) {
      expect(pointInPolygon(body.centroid, body.hull), `${body.id} hull should contain its centroid`).toBe(true);
    }
  });

  it('every region stays within the image viewBox', () => {
    for (const body of bodies) {
      for (const point of body.hull) {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(viewBox.width);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(viewBox.height);
      }
    }
  });

  it('is tagged with the moons system and the right view', () => {
    for (const body of bodies) {
      expect(body.system).toBe('moons');
      expect(body.view).toBe(view);
    }
  });
});

describe('ALL_MOONS', () => {
  it('has no duplicate ids', () => {
    const ids = ALL_MOONS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('totals 19 moons across every view', () => {
    expect(ALL_MOONS).toHaveLength(19);
  });
});

describe('COLLECTIONS', () => {
  it('lists planets first, then one entry per moon view', () => {
    expect(COLLECTIONS[0]).toEqual({ system: 'planets', view: 'planets', label: 'Planets' });
    expect(COLLECTIONS).toHaveLength(7);
  });

  it('every non-planets collection actually has moon bodies backing it', () => {
    for (const c of COLLECTIONS) {
      if (c.view === 'planets') continue;
      const group = VIEW_GROUPS.find((g) => g.view === c.view);
      expect(group, `no moon data found for collection view "${c.view}"`).toBeDefined();
    }
  });
});
