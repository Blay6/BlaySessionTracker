
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameResult, HistoryItem, Stats, ViewState, StrategyID, StrategySettings } from './types';
import Navbar from './components/Navbar';
import LossStreakBanner from './components/LossStreakBanner';
import ActionButtons from './components/ActionButtons';
import StatsGrid from './components/StatsGrid';
import ResultsChart from './components/ResultsChart';
import HistoryTable from './components/HistoryTable';
import ConfirmationModal from './components/ConfirmationModal';
import ConfigurationView from './components/ConfigurationView';
import StatisticsView from './components/StatisticsView';

const DEFAULT_STRATEGIES: StrategySettings[] = [
  { id: 'strat1', name: 'Martingala', baseUnit: 1, maxLossStreak: 6 },
  { id: 'strat2', name: 'Fibonacci', baseUnit: 1, maxLossStreak: 10 },
  { id: 'strat3', name: 'D\'Alembert', baseUnit: 1, maxLossStreak: 8 },
  { id: 'strat4', name: 'Apuesta Plana', baseUnit: 5, maxLossStreak: 0 },
];

const INITIAL_HISTORY: HistoryItem[] = [
  { id: 224, time: '14:30:45', result: GameResult.WIN, streak: 0, strategyId: 'strat1', betAmount: 1, playerScore: 9, bankerScore: 7 },
  { id: 223, time: '14:30:12', result: GameResult.LOSS, streak: 2, strategyId: 'strat1', betAmount: 2, playerScore: 4, bankerScore: 8 },
  { id: 222, time: '14:29:40', result: GameResult.LOSS, streak: 1, strategyId: 'strat1', betAmount: 1, playerScore: 0, bankerScore: 6 },
  { id: 221, time: '14:29:05', result: GameResult.WIN, streak: 0, strategyId: 'strat1', betAmount: 1, playerScore: 8, bankerScore: 5 },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [activeStrategyId, setActiveStrategyId] = useState<StrategyID>('strat1');
  
  const [strategies, setStrategies] = useState<StrategySettings[]>(() => {
    const saved = localStorage.getItem('baccarat_strategies_config');
    return saved ? JSON.parse(saved) : DEFAULT_STRATEGIES;
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('baccarat_history_v2');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDanger: true,
  });

  useEffect(() => {
    localStorage.setItem('baccarat_history_v2', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('baccarat_strategies_config', JSON.stringify(strategies));
  }, [strategies]);

  const stats = useMemo((): Stats => {
    const wins = history.filter(h => h.result === GameResult.WIN).length;
    const losses = history.filter(h => h.result === GameResult.LOSS).length;
    const ties = history.filter(h => h.result === GameResult.TIE).length;
    
    let maxStr = 0;
    history.forEach(h => {
      if (h.streak > maxStr) maxStr = h.streak;
    });

    let currentLossStreak = 0;
    for (const h of history) {
      if (h.result === GameResult.LOSS) {
        currentLossStreak++;
      } else if (h.result === GameResult.WIN) {
        // A win breaks the streak, stop counting.
        break;
      }
      // If the result is a TIE, do nothing and let the loop continue.
      // The streak is not broken, but not incremented either.
    }

    const balance = history.reduce((acc, curr) => {
      if (curr.result === GameResult.WIN) return acc + (curr.betAmount || 0);
      if (curr.result === GameResult.LOSS) return acc - (curr.betAmount || 0);
      return acc;
    }, 0);

    return {
      wins,
      losses,
      ties,
      total: history.length,
      currentLossStreak,
      maxHistoricalStreak: maxStr,
      balance,
    };
  }, [history]);

  const addResult = useCallback((result: GameResult, playerScore?: number, bankerScore?: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
    const currentStratConfig = strategies.find(s => s.id === activeStrategyId) || DEFAULT_STRATEGIES[0];
    
    setHistory(prev => {
      const lastItem = prev[0];
      let newStreak = 0;
      let nextBet = currentStratConfig.baseUnit;

      if (result === GameResult.LOSS) {
        newStreak = (lastItem ? lastItem.streak : 0) + 1;
        // Lógica Martingala como ejemplo básico para el tracker
        if (activeStrategyId === 'strat1') {
            nextBet = (lastItem?.betAmount || currentStratConfig.baseUnit) * 2;
        }
      } else if (result === GameResult.TIE) {
        // A tie maintains the current loss streak and bet amount
        newStreak = lastItem ? lastItem.streak : 0;
        nextBet = lastItem?.betAmount || currentStratConfig.baseUnit;
      } else { // GameResult.WIN
        // A win resets the streak and bet
        newStreak = 0;
        nextBet = currentStratConfig.baseUnit;
      }

      // Lógica de Target Bet (Diferencia 3-7, apuesta al MENOR)
      let targetBet: 'Player' | 'Banker' | undefined = undefined;
      if (playerScore !== undefined && bankerScore !== undefined) {
        const diff = Math.abs(playerScore - bankerScore);
        if (diff >= 3 && diff <= 7) {
          if (playerScore < bankerScore) {
            targetBet = 'Player';
          } else if (bankerScore < playerScore) {
            targetBet = 'Banker';
          }
        }
      }

      const newItem: HistoryItem = {
        id: (lastItem?.id || 0) + 1,
        time: timeStr,
        result,
        streak: newStreak,
        strategyId: activeStrategyId,
        betAmount: nextBet,
        playerScore: playerScore,
        bankerScore: bankerScore,
        targetBet: targetBet
      };
      
      return [newItem, ...prev];
    });
  }, [activeStrategyId, strategies]);

  const undoLastAction = useCallback(() => {
    if (history.length > 0) {
      setHistory(prev => prev.slice(1));
    }
  }, [history]);

  const clearHistory = useCallback(() => {
    setModalConfig({
      isOpen: true,
      title: 'Limpiar Historial',
      message: '¿Estás seguro de que deseas borrar todos los registros? Esta acción no se puede deshacer.',
      onConfirm: () => setHistory([]),
      isDanger: true,
    });
  }, []);

  const startNewSession = useCallback(() => {
    setModalConfig({
      isOpen: true,
      title: 'Nueva Sesión',
      message: '¿Deseas iniciar una nueva sesión? Se reseteará el historial actual.',
      onConfirm: () => {
        setHistory([]);
        setCurrentView('dashboard');
      },
      isDanger: false,
    });
  }, []);

  const updateStrategy = (updatedStrat: StrategySettings) => {
    setStrategies(prev => prev.map(s => s.id === updatedStrat.id ? updatedStrat : s));
  };

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-200 selection:bg-primary/30">
      <Navbar 
        activeStrategyId={activeStrategyId} 
        setActiveStrategyId={setActiveStrategyId} 
        strategies={strategies}
        onNewSession={startNewSession} 
        currentView={currentView}
        setView={setCurrentView}
      />
      
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {currentView === 'dashboard' && (
          <>
            <LossStreakBanner currentStreak={stats.currentLossStreak} />
            <ActionButtons 
              onAddResult={addResult} 
              onUndo={undoLastAction}
              isUndoDisabled={history.length === 0}
            />
            <StatsGrid stats={stats} />
            <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
              <div className="w-full lg:w-1/3">
                <ResultsChart stats={stats} />
              </div>
              <div className="w-full lg:w-2/3">
                 <HistoryTable history={history} onClear={clearHistory} />
              </div>
            </div>
          </>
        )}

        {currentView === 'config' && (
          <ConfigurationView 
            strategies={strategies} 
            updateStrategy={updateStrategy} 
          />
        )}

        {currentView === 'stats' && (
          <StatisticsView history={history} strategies={strategies} />
        )}
      </main>
      
      <footer className="py-8 text-center text-zinc-500 text-xs border-t border-zinc-100 dark:border-zinc-800">
        &copy; {new Date().getFullYear()} BaccaratTracker Pro - Gestión de Banca Avanzada
      </footer>

      <ConfirmationModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        isDanger={modalConfig.isDanger}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default App;
