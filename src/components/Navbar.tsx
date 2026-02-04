
import React, { useState } from 'react';
import { ViewState, StrategyID, StrategySettings } from '../types';

interface NavbarProps {
  activeStrategyId: StrategyID;
  setActiveStrategyId: (id: StrategyID) => void;
  strategies: StrategySettings[];
  onNewSession: () => void;
  currentView: ViewState;
  setView: (v: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  activeStrategyId, 
  setActiveStrategyId, 
  strategies, 
  onNewSession, 
  currentView, 
  setView 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentStrat = strategies.find(s => s.id === activeStrategyId) || strategies[0];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="text-primary flex items-center justify-center size-8 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined !text-[24px]">casino</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight dark:text-white text-zinc-900 hidden sm:block">BaccaratTracker</h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                <button 
                  onClick={() => setView('dashboard')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${currentView === 'dashboard' ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setView('stats')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${currentView === 'stats' ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                  Estadísticas
                </button>
                <button 
                  onClick={() => setView('config')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${currentView === 'config' ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                  Configuración
                </button>
            </nav>

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2"></div>

            <div className="relative group">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-zinc-800 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:border-primary transition-all"
              >
                <span className="material-symbols-outlined !text-[18px]">strategy</span>
                <span className="hidden lg:inline">Modo: </span><span className="text-zinc-900 dark:text-white font-bold max-w-[120px] truncate">{currentStrat.name}</span>
                <span className="material-symbols-outlined !text-[18px] text-zinc-400 group-hover:text-primary">expand_more</span>
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-64 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 p-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 transform origin-top-right z-50">
                <div className="text-xs font-bold text-zinc-400 uppercase px-3 py-2">Cambiar Estrategia</div>
                {strategies.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveStrategyId(s.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors ${
                      activeStrategyId === s.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    <span className="text-sm font-medium truncate">{s.name}</span>
                    {activeStrategyId === s.id && <span className="material-symbols-outlined !text-[16px]">check</span>}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={onNewSession}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <span className="material-symbols-outlined !text-[18px]">refresh</span>
              <span className="hidden lg:inline">Nueva Sesión</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div 
              className="size-9 rounded-full bg-cover bg-center border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors"
              style={{ backgroundImage: 'url("https://picsum.photos/seed/user/100/100")' }}
            ></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
