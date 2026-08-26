// Pure hit-testing geometry — no rendering dependencies, shared by every quiz mode that needs
// to know "did the player tap inside this body's region". Ported from the pattern used across
// Worldly/Outworldly/Innerworldly's engine packages.
import { Point } from './types.js';

// Standard ray-casting point-in-polygon test (even-odd rule).
export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

// Given several candidate hulls a point falls inside, hand it to whichever has the smallest
// area — the same tiebreak Innerworldly's geometry.ts uses for nested regions (e.g. a small
// moon's region nested near a planet's edge). Not needed by Tier 1's non-overlapping planets,
// but kept so later tiers (nested surface features) can reuse it unchanged.
export function polygonArea(polygon: Point[]): number {
  let area = 0;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    area += polygon[j].x * polygon[i].y - polygon[i].x * polygon[j].y;
  }
  return Math.abs(area / 2);
}

// Approximates an ellipse (or, with rx === ry, a circle) as an n-point polygon hull, so a
// simple "center + radius" region (every planet in the montage image) still hit-tests through
// the same point-in-polygon path as an irregular hand-traced region (what future surface
// features will need). Same trick Innerworldly's organs.ts used for its ellipse-shaped organs.
export function ellipseHull(cx: number, cy: number, rx: number, ry: number, points = 20): Point[] {
  const hull: Point[] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    hull.push({ x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) });
  }
  return hull;
}

export function circleHull(cx: number, cy: number, r: number, points = 20): Point[] {
  return ellipseHull(cx, cy, r, r, points);
}

// SVG path string for a full ellipse (or circle, with rx === ry), drawn as two arcs — used for
// the quiz-feedback tint overlay.
export function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
}

export function circlePath(cx: number, cy: number, r: number): string {
  return ellipsePath(cx, cy, r, r);
}
