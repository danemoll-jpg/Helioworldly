import { useState } from 'react';
import { CollectionMeta, QuizMode } from '@helioworldly/engine';
import { HomeScreen } from './components/HomeScreen.js';
import { SetupScreen } from './components/SetupScreen.js';
import { QuizScreen, QuizSummary } from './components/QuizScreen.js';
import { SummaryScreen } from './components/SummaryScreen.js';
import { LearnScreen } from './components/LearnScreen.js';
import { MasteryScreen } from './components/MasteryScreen.js';
import { DailyChallengeScreen } from './components/DailyChallengeScreen.js';
import { LeaderboardScreen } from './components/LeaderboardScreen.js';

type Screen = 'home' | 'setup' | 'quiz' | 'summary' | 'learn' | 'mastery' | 'daily' | 'leaderboard';

const DEFAULT_COLLECTION: CollectionMeta = { system: 'planets', view: 'planets', label: 'Planets' };

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [mode, setMode] = useState<QuizMode>('findIt');
  const [collection, setCollection] = useState<CollectionMeta>(DEFAULT_COLLECTION);
  const [lastSummary, setLastSummary] = useState<QuizSummary | null>(null);

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen
          onPlay={() => setScreen('setup')}
          onLearn={() => setScreen('learn')}
          onMastery={() => setScreen('mastery')}
          onDaily={() => setScreen('daily')}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}

      {screen === 'setup' && (
        <SetupScreen
          mode={mode}
          onModeChange={setMode}
          collection={collection}
          onCollectionChange={setCollection}
          onStart={() => setScreen('quiz')}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'quiz' && (
        <QuizScreen
          mode={mode}
          system={collection.system}
          view={collection.view}
          onFinish={(summary) => {
            setLastSummary(summary);
            setScreen('summary');
          }}
          onExit={() => setScreen('home')}
        />
      )}

      {screen === 'summary' && lastSummary && (
        <SummaryScreen
          summary={lastSummary}
          mode={mode}
          system={collection.system}
          view={collection.view}
          onPlayAgain={() => setScreen('quiz')}
          onHome={() => setScreen('home')}
        />
      )}

      {screen === 'learn' && <LearnScreen onBack={() => setScreen('home')} />}
      {screen === 'mastery' && <MasteryScreen onBack={() => setScreen('home')} />}
      {screen === 'daily' && <DailyChallengeScreen onBack={() => setScreen('home')} />}
      {screen === 'leaderboard' && <LeaderboardScreen onBack={() => setScreen('home')} />}
    </div>
  );
}
