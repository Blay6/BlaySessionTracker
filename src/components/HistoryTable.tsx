
import React from 'react';
import { HistoryItem, GameResult } from '../types';

interface Props {
  history: HistoryItem[];
  onClear: () => void;
}

const HistoryTable: React.FC<Props> = ({ history, onClear }) => {
  // Manejador explícito para evitar problemas de propagación
  const handleClearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClear();
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/30">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Historial Reciente</h3>
        <button 
          onClick={handleClearClick}
          className="text-zinc-500 hover:text-danger transition-all duration-200 text-sm font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-danger/10 group active:scale-90"
        >
          <span className="material-symbols-outlined !text-[18px]">delete_sweep</span>
          Limpiar Historial
        </button>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-zinc-500 dark:text-zinc-400">
          <thead className="bg-zinc-50 dark:bg-white/5 uppercase font-medium text-xs tracking-wider sticky top-0">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200" scope="col"># Mano</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200" scope="col">Hora</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200 text-center" scope="col">Marcador</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200 text-center" scope="col">Diferencia</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200 text-right" scope="col">Resultado</th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200 text-right" scope="col">Racha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
            {history.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-zinc-400">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined !text-[48px] opacity-20">history_toggle_off</span>
                    <span className="italic">No hay registros en el historial</span>
                  </div>
                </td>
              </tr>
            ) : (
              history.map((item) => {
                // Cálculo de la diferencia (retrocompatibilidad)
                const hasScores = item.playerScore !== undefined && item.bankerScore !== undefined;
                const diff = hasScores ? Math.abs((item.playerScore || 0) - (item.bankerScore || 0)) : null;
                // Condición de apuesta confirmada: diferencia entre 3 y 7 (inclusive)
                const isConfirmedBet = diff !== null && diff >= 3 && diff <= 7;
                
                // Determinamos el target para mostrar (usamos el guardado o recalculamos para antiguos)
                let targetDisplay = item.targetBet;
                if (!targetDisplay && isConfirmedBet && hasScores) {
                    if ((item.playerScore!) < (item.bankerScore!)) targetDisplay = 'Player';
                    else if ((item.bankerScore!) < (item.playerScore!)) targetDisplay = 'Banker';
                }

                return (
                  <tr key={`${item.id}-${item.time}`} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-mono font-medium text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4 font-mono">{item.time}</td>
                    
                    {/* Columna Marcador */}
                    <td className="px-6 py-4 text-center">
                      {hasScores ? (
                          <div className="flex items-center justify-center gap-2 font-mono font-bold">
                              <span className="text-blue-500">{item.playerScore}</span>
                              <span className="text-zinc-300 dark:text-zinc-700 text-xs">-</span>
                              <span className="text-red-500">{item.bankerScore}</span>
                          </div>
                      ) : (
                          <span className="text-zinc-300 dark:text-zinc-700 text-xs">-</span>
                      )}
                    </td>

                    {/* Nueva Columna Diferencia con Target */}
                    <td className="px-6 py-4 text-center">
                      {diff !== null ? (
                        <div className="flex justify-center items-center gap-2">
                           <div className={`
                             flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-bold text-xs border transition-colors
                             ${isConfirmedBet 
                               ? 'bg-primary/10 text-primary border-primary/20' 
                               : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-transparent'}
                           `}>
                             <span>{diff}</span>
                             {isConfirmedBet && (
                               <span className="material-symbols-outlined !text-[14px]">verified</span>
                             )}
                           </div>
                           
                           {/* Indicador de Target */}
                           {targetDisplay && (
                               <div className={`size-6 rounded flex items-center justify-center text-[10px] font-black border ${targetDisplay === 'Player' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                   {targetDisplay === 'Player' ? 'P' : 'B'}
                               </div>
                           )}
                        </div>
                      ) : (
                        <span className="text-zinc-300 dark:text-zinc-700 text-xs">-</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {item.result === GameResult.WIN && (
                        <span className="inline-flex items-center gap-1.5 text-primary font-bold">
                          <span className="material-symbols-outlined !text-[16px]">check_circle</span>
                          Win
                        </span>
                      )}
                      {item.result === GameResult.LOSS && (
                        <span className="inline-flex items-center gap-1.5 text-danger font-bold">
                          <span className="material-symbols-outlined !text-[16px]">cancel</span>
                          Loss
                        </span>
                      )}
                      {item.result === GameResult.TIE && (
                        <span className="inline-flex items-center gap-1.5 text-yellow-500 font-bold">
                          <span className="material-symbols-outlined !text-[16px]">remove</span>
                          Tie
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${item.streak > 0 ? 'text-orange-500' : 'text-zinc-400 font-medium'}`}>
                      {item.streak || '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
