
import React from 'react';
import { Stats } from '../types';

interface Props {
  stats: Stats;
}

const StatsGrid: React.FC<Props> = ({ stats }) => {
  const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {/* Eficiencia Win Rate */}
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/30 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined !text-[64px] text-primary">analytics</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary">
            <span className="material-symbols-outlined !text-[18px]">percent</span>
          </span>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Eficiencia Global</p>
        </div>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{winRate}%</h3>
          <span className="text-xs font-bold text-zinc-400 mb-1 uppercase tracking-widest">Win Rate</span>
        </div>
      </div>

      {/* Balance de Unidades */}
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/30 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined !text-[64px] text-primary">account_balance_wallet</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className={`flex items-center justify-center size-8 rounded-full ${stats.balance >= 0 ? 'bg-primary/20 text-primary' : 'bg-danger/20 text-danger'}`}>
            <span className="material-symbols-outlined !text-[18px]">payments</span>
          </span>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Balance Neto</p>
        </div>
        <div className="flex items-end gap-3">
          <h3 className={`text-3xl font-black tracking-tight ${stats.balance >= 0 ? 'text-primary' : 'text-danger'}`}>
            {stats.balance > 0 ? '+' : ''}{stats.balance}
          </h3>
          <span className="text-xs font-bold text-zinc-400 mb-1 uppercase tracking-widest">Unidades</span>
        </div>
      </div>

      {/* Racha Máxima Negativa */}
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col relative overflow-hidden group hover:border-orange-500/30 transition-colors sm:col-span-2 lg:col-span-1">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined !text-[64px] text-orange-500">warning</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center size-8 rounded-full bg-orange-500/20 text-orange-500">
            <span className="material-symbols-outlined !text-[18px]">priority_high</span>
          </span>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Máx Racha Negativa</p>
        </div>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{stats.maxHistoricalStreak}</h3>
          <span className="text-xs font-bold text-zinc-400 mb-1 uppercase tracking-widest">Manos</span>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
