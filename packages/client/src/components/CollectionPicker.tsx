// Which collection (Planets, or one planet's moons) a screen is currently showing — reused by
// Setup, Learn, and the Leaderboard screen so there's exactly one picker UI to keep consistent
// as more collections (surface features) get added later.
import { COLLECTIONS, CollectionMeta } from '@helioworldly/engine';

export interface CollectionPickerProps {
  system: CollectionMeta['system'];
  view: CollectionMeta['view'];
  onChange: (collection: CollectionMeta) => void;
}

export function CollectionPicker({ system, view, onChange }: CollectionPickerProps) {
  return (
    <div className="collection-picker">
      {COLLECTIONS.map((c) => (
        <button
          key={c.view}
          type="button"
          className={`collection-option ${c.system === system && c.view === view ? 'collection-option-selected' : ''}`}
          onClick={() => onChange(c)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
