import { describe, expect, it } from 'vitest';
import { circleHull, circlePath, ellipseHull, pointInPolygon, polygonArea } from '../src/geometry.js';

describe('pointInPolygon', () => {
  it('detects a point inside a square', () => {
    const square = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    expect(pointInPolygon({ x: 5, y: 5 }, square)).toBe(true);
    expect(pointInPolygon({ x: 15, y: 5 }, square)).toBe(false);
  });

  it('detects points inside a circle hull', () => {
    const hull = circleHull(100, 100, 50);
    expect(pointInPolygon({ x: 100, y: 100 }, hull)).toBe(true);
    expect(pointInPolygon({ x: 100, y: 40 }, hull)).toBe(false);
  });
});

describe('polygonArea', () => {
  it('computes area of a square', () => {
    const square = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ];
    expect(polygonArea(square)).toBe(100);
  });

  it('gives a bigger hull a bigger area', () => {
    expect(polygonArea(circleHull(0, 0, 100))).toBeGreaterThan(polygonArea(circleHull(0, 0, 10)));
  });
});

describe('ellipseHull / circleHull', () => {
  it('circleHull is a special case of ellipseHull', () => {
    expect(circleHull(0, 0, 25)).toEqual(ellipseHull(0, 0, 25, 25));
  });
});

describe('circlePath', () => {
  it('produces a non-empty SVG path string', () => {
    expect(circlePath(10, 10, 5)).toMatch(/^M /);
  });
});
