// The pan/zoom SVG surface: renders a view's photo plus a transparent, tappable hit region per
// body. Same interaction model as Worldly's WorldMap / Outworldly's SkyMap / Innerworldly's
// BodyDiagram — built on the ported panZoom.ts hook.
import { CelestialBodyDef, ViewBox } from '@helioworldly/engine';
import { usePanZoom } from '../lib/panZoom.js';

export interface CelestialDiagramProps {
  bodies: CelestialBodyDef[];
  viewBox: ViewBox;
  imageUrl: string;
  onBodyClick?: (bodyId: string) => void;
  highlightedId?: string;
  feedback?: { bodyId: string; correct: boolean } | null;
  interactive?: boolean;
}

export function CelestialDiagram({
  bodies,
  viewBox,
  imageUrl,
  onBodyClick,
  highlightedId,
  feedback,
  interactive = true,
}: CelestialDiagramProps) {
  const { transform, svgRef, handlers, reset, zoomBy } = usePanZoom({ viewBox, minScale: 1, maxScale: 8 });

  return (
    <div className="diagram-wrap">
      <svg
        ref={svgRef}
        className="diagram-svg"
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        {...handlers}
        role="img"
        aria-label="Solar system diagram"
      >
        <rect x={0} y={0} width={viewBox.width} height={viewBox.height} fill="#05050a" />
        <g transform={`translate(${transform.tx} ${transform.ty}) scale(${transform.scale})`}>
          <image href={imageUrl} x={0} y={0} width={viewBox.width} height={viewBox.height} />
          {bodies.map((body) => {
            const isHighlighted = body.id === highlightedId;
            const isFeedback = feedback?.bodyId === body.id;
            const feedbackClass = isFeedback ? (feedback!.correct ? 'region-correct' : 'region-wrong') : '';
            return (
              <path
                key={body.id}
                d={body.path}
                className={`diagram-region ${isHighlighted ? 'region-highlighted' : ''} ${feedbackClass}`}
                onClick={interactive && onBodyClick ? () => onBodyClick(body.id) : undefined}
                style={{ cursor: interactive && onBodyClick ? 'pointer' : 'default' }}
              >
                <title>{body.name}</title>
              </path>
            );
          })}
        </g>
      </svg>
      <div className="diagram-controls">
        <button type="button" onClick={() => zoomBy(1.4)} aria-label="Zoom in">
          +
        </button>
        <button type="button" onClick={() => zoomBy(1 / 1.4)} aria-label="Zoom out">
          −
        </button>
        <button type="button" onClick={reset} aria-label="Reset view">
          Reset
        </button>
      </div>
    </div>
  );
}
