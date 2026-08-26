// Browse-everything mode: pick a planet from the list (or tap it on the diagram) to see its
// blurb, no scoring or pressure.
import { useState } from 'react';
import { PLANETS, PLANETS_IMAGE_URL, PLANETS_VIEWBOX } from '@helioworldly/engine';
import { CelestialDiagram } from './CelestialDiagram.js';

export interface LearnScreenProps {
  onBack: () => void;
}

export function LearnScreen({ onBack }: LearnScreenProps) {
  const [selectedId, setSelectedId] = useState<string>(PLANETS[0].id);
  const selected = PLANETS.find((p) => p.id === selectedId);

  return (
    <div className="screen learn-screen">
      <header className="quiz-header">
        <button type="button" className="btn-link" onClick={onBack}>
          Back
        </button>
        <span>Learn</span>
      </header>

      <CelestialDiagram
        bodies={PLANETS}
        viewBox={PLANETS_VIEWBOX}
        imageUrl={PLANETS_IMAGE_URL}
        onBodyClick={setSelectedId}
        highlightedId={selectedId}
      />

      {selected && (
        <div className="learn-detail">
          <h2>{selected.name}</h2>
          <p>{selected.blurb}</p>
        </div>
      )}

      <div className="learn-list">
        {PLANETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`learn-list-item ${p.id === selectedId ? 'learn-list-item-selected' : ''}`}
            onClick={() => setSelectedId(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
