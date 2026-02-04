
import React from 'react';
import { StrategySettings } from '../types';

interface Props {
  strategies: StrategySettings[];
  updateStrategy: (strat: StrategySettings) => void;
}

const ConfigurationView: React.FC<Props> = ({ strategies, updateStrategy }) => {

  const handleInputChange = (id: string, field: keyof StrategySettings, value: string) => {
    const strat = strategies.find(s => s.id === id);
    if (!strat) return;
    
    let newValue: string | number = value;
    if (field === 'baseUnit' || field === 'maxLossStreak') {
        newValue = parseFloat(value) || 0;
    }
    
    updateStrategy({ ...strat, [field]: newValue });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-10">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined !text-[32px]">settings</span>
        </div>
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Gestión de Estrategias</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Personaliza los parámetros técnicos y nombres de tus modos de juego.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {strategies.map(strat => (
          <div key={strat.id} className="bg-surface-light dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm hover:border-primary/40 transition-all group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1 mr-4">
                <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 opacity-60">Nombre del Perfil</div>
                <input 
                  type="text"
                  value={strat.name}
                  onChange={(e) => handleInputChange(strat.id, 'name', e.target.value)}
                  className="bg-transparent border-none p-0 text-2xl font-black text-zinc-900 dark:text-white focus:ring-0 w-full hover:bg-zinc-50 dark:hover:bg-white/5 rounded-lg px-2 -ml-2 transition-colors"
                  placeholder="Ej: Martingala Agresiva"
                />
              </div>
              <div className="size-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined">edit_note</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest">Unidad Base (Bet)</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={strat.baseUnit}
                    onChange={(e) => handleInputChange(strat.id, 'baseUnit', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 px-5 text-xl font-mono font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-zinc-400 font-black text-xs uppercase tracking-tighter">Unidades</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest">Límite de Stop-Loss</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={strat.maxLossStreak}
                    onChange={(e) => handleInputChange(strat.id, 'maxLossStreak', e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 px-5 text-xl font-mono font-bold text-zinc-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-zinc-400 font-black text-xs uppercase tracking-tighter">Rachas Máx.</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                <span>ID: {strat.id}</span>
                <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-primary"></span>
                    Activo
                </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-zinc-900 rounded-3xl border border-zinc-800 flex flex-col lg:flex-row items-center gap-8 shadow-2xl">
        <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 animate-pulse">
          <span className="material-symbols-outlined !text-[40px]">security</span>
        </div>
        <div>
          <h4 className="text-xl font-black text-white mb-2 tracking-tight">Consejo de Gestión de Riesgos</h4>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Los cambios de nombre son puramente visuales, pero las modificaciones en la <strong>Unidad Base</strong> afectarán directamente al cálculo del balance en tiempo real. Asegúrate de configurar el <strong>Límite de Racha</strong> basándote en tu capital total para evitar el agotamiento de la banca durante secuencias negativas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationView;
