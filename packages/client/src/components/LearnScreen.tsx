// Browse-everything mode: pick a collection, then pick a body from the list (or tap it on the
// diagram) to see its blurb, no scoring or pressure.
import { useState } from 'react';
import { BODIES_BY_VIEW, CollectionMeta, VIEWS } from '@helioworldly/engine';
import { CelestialDiagram } from './CelestialDiagram.js';
import { CollectionPicker } from './CollectionPicker.js';

export interface LearnScreenProps {
  onBack: () => void;
}

const DEFAULT_COLLECTION: CollectionMeta = { system: 'planets', view: 'planets', label: 'Planets' };

export function LearnScreen({ onBack }: LearnScreenProps) {
  const [collection, setCollection] = useState<CollectionMeta>(DEFAULT_COLLECTION);
  const bodies = BODIES_BY_VIEW[collection.view] ?? [];
  const { imageUrl, viewBox } = VIEWS[collection.view];

  const [selectedId, setSelectedId] = useState<string>(bodies[0]?.id ?? '');
  const selected = bodies.find((b) => b.id === selectedId) ?? bodies[0];

  function handleCollectionChange(next: CollectionMeta) {
    setCollection(next);
    const nextBodies = BODIES_BY_VIEW[next.view] ?? [];
    setSelectedId(nextBodies[0]?.id ?? '');
  }

  return (
    <div className="screen learn-screen">
      <header className="quiz-header">
        <button type="button" className="back-link" onClick={onBack}>
          Back
        </button>
        <span>Learn</span>
      </header>

      <CollectionPicker system={collection.system} view={collection.view} onChange={handleCollectionChange} />

      {/* key={collection.view} forces a remount (and a fresh pan/zoom transform) on collection
          switch — without it, CelestialDiagram stays mounted across the swap and reuses its old
          pan/zoom state, which was clamped against the *previous* view's viewBox. That state can
          be arbitrarily wrong for the new one (different dimensions), landing the player on a
          panned-and-zoomed view of empty background with no obvious way to tell what happened. */}
      <CelestialDiagram
        key={collection.view}
        bodies={bodies}
        viewBox={viewBox}
        imageUrl={imageUrl}
        onBodyClick={setSelectedId}
        highlightedId={selected?.id}
      />

      {selected && (
        <div className="learn-detail">
          <h2>{selected.name}</h2>
          <p>{selected.blurb}</p>
        </div>
      )}

      <div className="learn-list">
        {bodies.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`learn-list-item ${b.id === selected?.id ? 'learn-list-item-selected' : ''}`}
            onClick={() => setSelectedId(b.id)}
          >
            {b.name}
          </button>
        ))}
      </div>
    </div>
  );
}
