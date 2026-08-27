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

// Keeps the image from being panned out of view. The margin is a small slack (10% of the
// viewBox) on top of however far the *scaled* image actually extends past the frame — not a
// flat fraction of the viewBox regardless of zoom. A flat margin let the image be dragged mostly
// off-screen even at 1:1 zoom (where the image exactly fills the frame and there's nothing
// legitimate to pan to), which is what let it disappear into a corner. At higher zoom, this
// still allows panning across the whole zoomed-in image, just not losing it entirely.
function clampTranslate(t: Transform, viewBox: ViewBox): Transform {
  const marginX = viewBox.width * 0.1;
  const marginY = viewBox.height * 0.1;
  return {
    scale: t.scale,
    tx: clamp(t.tx, viewBox.width - marginX - viewBox.width * t.scale, marginX),
    ty: clamp(t.ty, viewBox.height - marginY - viewBox.height * t.scale, marginY),
  };
}

export function usePanZoom({ viewBox, minScale = 1, maxScale = 8 }: PanZoomOptions): PanZoomResult {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, tx: 0, ty: 0 });

  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchStart = useRef<{ distance: number; scale: number; midpoint: { x: number; y: number } } | null>(null);

  const toSvgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: clientX, y: clientY };
    const rect = svg.getBoundingClientRect();
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }, [viewBox.height, viewBox.width]);

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
      const svg = svgRef.current;
      const rect = svg?.getBoundingClientRect();
      const scaleX = rect ? viewBox.width / rect.width : 1;
      const scaleY = rect ? viewBox.height / rect.height : 1;
      setTransform((prev) =>
        clampTranslate(
          { ...prev, tx: dragStart.current!.tx + dxClient * scaleX, ty: dragStart.current!.ty + dyClient * scaleY },
          viewBox,
        ),
      );
    }
  }, [minScale, maxScale, viewBox]);

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
