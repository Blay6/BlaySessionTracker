
import React from 'react';
import { Stats } from '../types';

interface Props {
  stats: Stats;
}

const ResultsChart: React.FC<Props> = ({ stats }) => {
  const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
  const lossRate = stats.total > 0 ? (stats.losses / stats.total) * 100 : 0;
  const tieRate = stats.total > 0 ? (stats.ties / stats.total) * 100 : 0;

  // Calculate degree breakpoints for conic gradient
  const winDeg = (winRate / 100) * 360;
  const lossDeg = ((winRate + lossRate) / 100) * 360;

  const gradientStyle = {
    background: `conic-gradient(#13ec6d 0deg ${winDeg}deg, #ef4444 ${winDeg}deg ${lossDeg}deg, #f59e0b ${lossDeg}deg 360deg)`
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-zinc-800 p-8 shadow-sm flex flex-col w-full max-w-md">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-8 tracking-tight">Resultados Globales</h3>
      
      <div className="flex flex-1 items-center justify-center relative">
        <div className="size-48 rounded-full relative shadow-inner overflow-hidden" style={gradientStyle}>
          <div className="absolute inset-2 bg-surface-light dark:bg-surface-dark rounded-full flex flex-col items-center justify-center shadow-lg">
            <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{stats.total}</span>
            <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest mt-1">Total Manos</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-3 rounded-full bg-primary ring-2 ring-primary/20"></div>
            <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">Victorias</span>
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{Math.round(winRate)}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-3 rounded-full bg-danger ring-2 ring-danger/20"></div>
            <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">Pérdidas</span>
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{Math.round(lossRate)}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-3 rounded-full bg-yellow-500 ring-2 ring-yellow-500/20"></div>
            <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">Empates</span>
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{Math.round(tieRate)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsChart;
