import { GAME_HUB_URL } from '../lib/hub.js';

export interface HomeScreenProps {
  onPlay: () => void;
  onLearn: () => void;
  onMastery: () => void;
  onDaily: () => void;
}

export function HomeScreen({ onPlay, onLearn, onMastery, onDaily }: HomeScreenProps) {
  return (
    <div className="screen home-screen">
      <h1>Helioworldly</h1>
      <p className="tagline">Pan, zoom, and find your way around the solar system.</p>

      <div className="home-actions">
        <button type="button" className="btn-primary btn-large" onClick={onPlay}>
          Play
        </button>
        <button type="button" className="btn-secondary" onClick={onDaily}>
          Daily Challenge
        </button>
        <button type="button" className="btn-secondary" onClick={onLearn}>
          Learn
        </button>
        <button type="button" className="btn-secondary" onClick={onMastery}>
          Mastery
        </button>
      </div>

      <a className="hub-link" href={GAME_HUB_URL} target="_blank" rel="noreferrer">
        ← Back to the game hub
      </a>
    </div>
  );
}
