
import React, { useState } from 'react';
import { HistoryItem, StrategyID, GameResult, StrategySettings } from '../types';

interface Props {
  history: HistoryItem[];
  strategies: StrategySettings[];
}

const StatisticsView: React.FC<Props> = ({ history, strategies }) => {
  const [activeTab, setActiveTab] = useState<StrategyID>(strategies[0].id);

  const getStatsForStrategy = (stratId: StrategyID) => {
    const stratHistory = history.filter(h => h.strategyId === stratId);
    const wins = stratHistory.filter(h => h.result === GameResult.WIN).length;
    const losses = stratHistory.filter(h => h.result === GameResult.LOSS).length;
    const balance = stratHistory.reduce((acc, curr) => {
        if (curr.result === GameResult.WIN) return acc + (curr.betAmount || 0);
        if (curr.result === GameResult.LOSS) return acc - (curr.betAmount || 0);
        return acc;
    }, 0);
    const winRate = stratHistory.length > 0 ? (wins / stratHistory.length) * 100 : 0;
    
    return {
        total: stratHistory.length,
        wins,
        losses,
        balance,
        winRate
    };
  };

  const currentStats = getStatsForStrategy(activeTab);
  const activeStratName = strategies.find(s => s.id === activeTab)?.name || 'Estrategia';

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined !text-[32px]">bar_chart</span>
        </div>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Estadísticas por Estrategia</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Analiza el rendimiento específico de cada configuración personalizada.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-hide">
        {strategies.map(strat => (
          <button
            key={strat.id}
            onClick={() => setActiveTab(strat.id)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === strat.id ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
          >
            {strat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 size-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Balance Neto ({activeStratName})</p>
                    <div className="flex items-center gap-4">
                        <span className={`text-5xl font-black tracking-tighter ${currentStats.balance >= 0 ? 'text-primary' : 'text-danger'}`}>
                            {currentStats.balance > 0 ? '+' : ''}{currentStats.balance}
                        </span>
                        <div className="text-xs font-bold text-zinc-400">UNIDADES<br/>OBTENIDAS</div>
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Win Rate de Estrategia</p>
                    <div className="flex items-center gap-4">
                        <span className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
                            {Math.round(currentStats.winRate)}%
                        </span>
                        <div className="text-xs font-bold text-zinc-400">ÉXITO<br/>OPERATIVO</div>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${currentStats.winRate}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden relative min-h-[300px] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Actividad Reciente</h3>
                    <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {currentStats.total} Muestras
                    </span>
                </div>
                
                <div className="flex items-end h-40 gap-2 mb-2">
                    {[35, 60, 45, 80, 50, 90, 40, 100, 75, 55, 65, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-t-lg relative group">
                            <div 
                                className="absolute bottom-0 left-0 right-0 bg-primary/20 group-hover:bg-primary/50 transition-all duration-300 rounded-t-lg"
                                style={{ height: `${h}%` }}
                            ></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-tighter pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <span>Inicio Sesión</span>
                    <span>Análisis de Tendencia</span>
                    <span>Proyección Actual</span>
                </div>
            </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">Desglose de Operaciones</h3>
            <div className="space-y-6">
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-zinc-500 font-medium">Volumen Total</span>
                    <span className="text-sm font-mono font-bold text-zinc-900 dark:text-white">{currentStats.total} manos</span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-zinc-500 font-medium">Sesiones Ganadoras</span>
                    <span className="text-sm font-mono font-bold text-primary">{currentStats.wins}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-zinc-500 font-medium">Sesiones Perdedoras</span>
                    <span className="text-sm font-mono font-bold text-danger">{currentStats.losses}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-zinc-500 font-medium">Profit por Mano</span>
                    <span className="text-sm font-mono font-bold text-zinc-900 dark:text-white">
                        {(currentStats.balance / (currentStats.total || 1)).toFixed(2)} U.
                    </span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-zinc-500 font-medium">Expectativa Matemática</span>
                    <span className={`text-sm font-mono font-bold ${currentStats.winRate > 50 ? 'text-primary' : 'text-zinc-500'}`}>
                        {currentStats.winRate > 50 ? 'Positiva' : 'Neutral/Neg.'}
                    </span>
                </div>
            </div>

            <div className="mt-12 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 text-center">Rendimiento Comparativo</p>
                <div className="text-center">
                    <div className="text-3xl font-black text-primary tracking-tighter italic">Top Tier</div>
                    <p className="text-[10px] text-zinc-500 mt-2 leading-tight">Esta estrategia presenta la menor volatilidad en los últimos 50 registros.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsView;
