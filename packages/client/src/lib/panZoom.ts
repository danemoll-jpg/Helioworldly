// Generic pan/zoom over an SVG surface — pointer-drag to pan, wheel or pinch to zoom. No
// knowledge of what's being panned/zoomed (planets, stars, a skeleton); every app in this series
// uses the same shape of hook for its diagram surface.
import { useCallback, useMemo, useRef, useState } from 'react';
import { ViewBox } from '@helioworldly/engine';

export interface Transform {
  scale: number;
  tx: number;
  ty: number;
}

export interface PanZoomOptions {
  viewBox: ViewBox;
  minScale?: number;
  maxScale?: number;
}

export interface PanZoomResult {
  transform: Transform;
  svgRef: React.RefObject<SVGSVGElement>;
  handlers: {
    onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
    onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
    onPointerUp: (e: React.PointerEvent<SVGSVGElement>) => void;
    onPointerCancel: (e: React.PointerEvent<SVGSVGElement>) => void;
    onWheel: (e: React.WheelEvent<SVGSVGElement>) => void;
  };
  reset: () => void;
  zoomBy: (factor: number) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Keeps the subject actually on screen while panning — two constraints, the tighter of the two
// wins on each side:
//
// 1. A small flat margin (MARGIN_FRACTION) on top of however far the *scaled* image extends past
//    the frame. Needed at low zoom: right at 1:1, the image exactly fills the frame and there's
//    nothing legitimate to pan to, so without this the whole image could be dragged off-screen.
// 2. A small square centered on the viewBox (CENTER_SLACK_FRACTION, sized off the viewBox's own
//    short axis) that can never be panned fully out of the viewport. Needed at high zoom: every
//    one of these apps' diagrams centers its subject (the planet/skeleton/map center) in the
//    middle of a viewBox that's otherwise mostly empty margin (starfield, ocean, whatever), so
//    letting the pan range grow strictly with #1's flat margin all the way up to "every pixel of
//    the enlarged image including its corners" lets you reach a corner that's almost entirely
//    that empty margin — technically still "in view" by #1's own logic, but visually
//    indistinguishable from the image having disappeared.
//
// #1 alone is the tighter constraint at scale 1 (nothing to gain from #2 yet); #2 alone is
// tighter once zoomed in enough that its fixed-size box no longer fits inside #1's now-enormous
// range. Taking the tighter bound on each side gets both right without either fighting the other.
const MARGIN_FRACTION = 0.1;
const CENTER_SLACK_FRACTION = 0.08;

function clampTranslate(t: Transform, viewBox: ViewBox): Transform {
  const { width: W, height: H } = viewBox;
  const { scale } = t;

  const marginX = W * MARGIN_FRACTION;
  const marginY = H * MARGIN_FRACTION;
  const slack = Math.min(W, H) * CENTER_SLACK_FRACTION;
  const centerX = W / 2;
  const centerY = H / 2;

  return {
    scale,
    tx: clamp(t.tx, Math.max(W - marginX - W * scale, (slack - centerX) * scale), Math.min(marginX, W - (centerX + slack) * scale)),
    ty: clamp(t.ty, Math.max(H - marginY - H * scale, (slack - centerY) * scale), Math.min(marginY, H - (centerY + slack) * scale)),
  };
}

export function usePanZoom({ viewBox, minScale = 1, maxScale = 8 }: PanZoomOptions): PanZoomResult {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, tx: 0, ty: 0 });

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchStart = useRef<{ distance: number; scale: number; midpoint: { x: number; y: number } } | null>(null);

  // The <svg> has a viewBox but no preserveAspectRatio override, so it defaults to "xMidYMid
  // meet": the browser fits the whole viewBox inside the element using ONE uniform scale (set by
  // whichever axis is more constrained) and letterboxes the other axis, rather than stretching
  // width/height independently. Converting a client-pixel delta to viewBox units has to use that
  // same single scale — using rect.width and rect.height separately (two different ratios,
  // whenever the element's aspect ratio doesn't match the viewBox's) makes panning track the
  // cursor at the wrong rate on whichever axis is letterboxed, and — combined with clampTranslate
  // — let that axis's clamp bound be reached by less on-screen drag than intended.
  const svgUnitsPerClientPx = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return { x: 1, y: 1 };
    const rect = svg.getBoundingClientRect();
    const scale = Math.max(viewBox.width / rect.width, viewBox.height / rect.height);
    return { x: scale, y: scale, rect };
  }, [viewBox.height, viewBox.width]);

  const toSvgPoint = useCallback((clientX: number, clientY: number) => {
    const { x: scale, rect } = svgUnitsPerClientPx();
    if (!rect) return { x: clientX, y: clientY };
    // With a uniform scale, the fitted content is centered on whichever axis has leftover space
    // (the letterbox bars) — offset by that before scaling, or the origin is off by half a bar.
    const contentWidth = viewBox.width / scale;
    const contentHeight = viewBox.height / scale;
    const offsetX = rect.left + (rect.width - contentWidth) / 2;
    const offsetY = rect.top + (rect.height - contentHeight) / 2;
    return { x: (clientX - offsetX) * scale, y: (clientY - offsetY) * scale };
  }, [svgUnitsPerClientPx, viewBox.height, viewBox.width]);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      dragStart.current = { x: e.clientX, y: e.clientY, tx: transform.tx, ty: transform.ty };
    } else if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      pinchStart.current = {
        distance: Math.hypot(dx, dy),
        scale: transform.scale,
        midpoint: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 },
      };
      dragStart.current = null;
    }
  }, [transform.scale, transform.tx, transform.ty]);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const distance = Math.hypot(dx, dy);
      const nextScale = clamp(pinchStart.current.scale * (distance / pinchStart.current.distance), minScale, maxScale);
      setTransform((prev) => clampTranslate({ ...prev, scale: nextScale }, viewBox));
      return;
    }

    if (dragStart.current) {
      const dxClient = e.clientX - dragStart.current.x;
      const dyClient = e.clientY - dragStart.current.y;
      const { x: scale } = svgUnitsPerClientPx();
      setTransform((prev) =>
        clampTranslate(
          { ...prev, tx: dragStart.current!.tx + dxClient * scale, ty: dragStart.current!.ty + dyClient * scale },
          viewBox,
        ),
      );
    }
  }, [minScale, maxScale, viewBox, svgUnitsPerClientPx]);

  const endPointer = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) dragStart.current = null;
  }, []);

  const onWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const point = toSvgPoint(e.clientX, e.clientY);
    const factor = Math.pow(1.0015, -e.deltaY);
    setTransform((prev) => {
      const nextScale = clamp(prev.scale * factor, minScale, maxScale);
      // Zoom centered on the cursor: keep the SVG point under the cursor fixed.
      const ratio = nextScale / prev.scale;
      const nextTx = point.x - (point.x - prev.tx) * ratio;
      const nextTy = point.y - (point.y - prev.ty) * ratio;
      return clampTranslate({ scale: nextScale, tx: nextTx, ty: nextTy }, viewBox);
    });
  }, [minScale, maxScale, toSvgPoint, viewBox]);

  const reset = useCallback(() => setTransform({ scale: 1, tx: 0, ty: 0 }), []);

  const zoomBy = useCallback((factor: number) => {
    setTransform((prev) => clampTranslate({ ...prev, scale: clamp(prev.scale * factor, minScale, maxScale) }, viewBox));
  }, [minScale, maxScale, viewBox]);

  const handlers = useMemo(
    () => ({ onPointerDown, onPointerMove, onPointerUp: endPointer, onPointerCancel: endPointer, onWheel }),
    [onPointerDown, onPointerMove, endPointer, onWheel],
  );

  return { transform, svgRef, handlers, reset, zoomBy };
}
