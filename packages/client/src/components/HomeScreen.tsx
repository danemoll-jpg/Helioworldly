import { GAME_HUB_URL } from '../lib/hub.js';

export interface HomeScreenProps {
  onPlay: () => void;
  onLearn: () => void;
  onMastery: () => void;
  onDaily: () => void;
  onLeaderboard: () => void;
}

export function HomeScreen({ onPlay, onLearn, onMastery, onDaily, onLeaderboard }: HomeScreenProps) {
  return (
    <div className="start-screen">
      <a className="back-link back-link--floating" href={GAME_HUB_URL}>
        🎮 All Games
      </a>
      <div className="start-screen__card">
        <h1>☀️ Helioworldly</h1>
        <p className="start-screen__subtitle">
          Learn the solar system — pan and zoom NASA/JPL's own solar-system illustration to find
          the planet you're asked about, untimed. All 8 planets, with moons and named surface
          features (including the Apollo landing sites) planned next.
        </p>

        <div className="home-screen__choices">
          <button type="button" className="home-screen__choice" onClick={onDaily}>
            <span className="home-screen__choice-emoji">🔥</span>
            <span className="home-screen__choice-title">Daily challenge</span>
            <span className="home-screen__choice-sub">One shared planet a day — everyone gets the same one.</span>
          </button>
          <button type="button" className="home-screen__choice" onClick={onLearn}>
            <span className="home-screen__choice-emoji">📖</span>
            <span className="home-screen__choice-title">Learn the planets</span>
            <span className="home-screen__choice-sub">Browse all 8 planets, one at a time — named and shown in full, no quiz pressure.</span>
          </button>
          <button type="button" className="home-screen__choice" onClick={onPlay}>
            <span className="home-screen__choice-emoji">🪐</span>
            <span className="home-screen__choice-title">Start a quiz</span>
            <span className="home-screen__choice-sub">Find it, type it, or pick it from 4 choices — untimed.</span>
          </button>
          <button type="button" className="home-screen__choice" onClick={onMastery}>
            <span className="home-screen__choice-emoji">🗺️</span>
            <span className="home-screen__choice-title">Mastery map</span>
            <span className="home-screen__choice-sub">Every planet colored by how you've actually done — your personal weak spots.</span>
          </button>
          <button type="button" className="home-screen__choice" onClick={onLeaderboard}>
            <span className="home-screen__choice-emoji">🏆</span>
            <span className="home-screen__choice-title">Leaderboard</span>
            <span className="home-screen__choice-sub">Best accuracy, fastest time as a tiebreaker — shared across everyone.</span>
          </button>
        </div>
      </div>
    </div>
  );
}
