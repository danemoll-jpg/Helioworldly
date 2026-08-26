import { describe, expect, it } from 'vitest';
import { pointInPolygon } from '../src/geometry.js';
import { PLANETS, PLANETS_VIEWBOX } from '../src/planets.js';

describe('PLANETS data sanity', () => {
  it('has exactly the 8 official planets, no duplicates', () => {
    expect(PLANETS).toHaveLength(8);
    expect(new Set(PLANETS.map((p) => p.id)).size).toBe(8);
  });

  it("every planet's hull contains its own centroid", () => {
    for (const planet of PLANETS) {
      expect(pointInPolygon(planet.centroid, planet.hull), `${planet.id} hull should contain its centroid`).toBe(
        true,
      );
    }
  });

  it('every region stays within the image viewBox', () => {
    for (const planet of PLANETS) {
      for (const point of planet.hull) {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(PLANETS_VIEWBOX.width);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(PLANETS_VIEWBOX.height);
      }
    }
  });

  it('every planet is tagged with the planets system and view', () => {
    for (const planet of PLANETS) {
      expect(planet.system).toBe('planets');
      expect(planet.view).toBe('planets');
    }
  });
});
