
import React from 'react';

interface Props {
  currentStreak: number;
}

const LossStreakBanner: React.FC<Props> = ({ currentStreak }) => {
  return (
    <div className="mb-12">
      <div className="bg-gradient-to-br from-surface-dark to-background-dark dark:from-zinc-900 dark:to-black rounded-2xl border border-gray-200 dark:border-zinc-800 p-10 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <h2 className="text-xl font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Racha Actual de Pérdidas</h2>
        <div className="flex items-center justify-center gap-6 my-4 relative z-10">
          <span className={`material-symbols-outlined !text-[48px] text-orange-500 ${currentStreak > 0 ? 'animate-pulse' : 'opacity-50'}`}>
            warning
          </span>
          <span className="text-[120px] leading-none font-black text-orange-500 tabular-nums tracking-tighter drop-shadow-2xl">
            {currentStreak}
          </span>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">Operaciones consecutivas perdidas</p>
      </div>
    </div>
  );
};

export default LossStreakBanner;
