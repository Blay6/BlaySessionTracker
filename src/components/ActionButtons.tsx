
import React, { useState } from 'react';
import { GameResult } from '../types';

interface Props {
  onAddResult: (res: GameResult, playerScore?: number, bankerScore?: number) => void;
  onUndo: () => void;
  isUndoDisabled: boolean;
}

const ActionButtons: React.FC<Props> = ({ onAddResult, onUndo, isUndoDisabled }) => {
  const [playerScore, setPlayerScore] = useState<string>('');
  const [bankerScore, setBankerScore] = useState<string>('');

  // Cálculos en tiempo real para la validación
  const pVal = playerScore === '' ? NaN : parseInt(playerScore, 10);
  const bVal = bankerScore === '' ? NaN : parseInt(bankerScore, 10);
  const hasValues = !isNaN(pVal) && !isNaN(bVal);
  const diff = hasValues ? Math.abs(pVal - bVal) : 0;
  
  // Regla: Diferencia de 3 a 7 (inclusive) es Apuesta Verificada
  const isConfirmed = hasValues && diff >= 3 && diff <= 7;
  
  // Determinamos el target: El que tenga MENOS puntos
  const targetSide = (hasValues && isConfirmed) 
    ? (pVal < bVal ? 'Player' : 'Banker') 
    : null;

  const handleAction = (result: GameResult) => {
    // Si los inputs están vacíos, pasamos undefined, si tienen valor, pasamos el número
    const pScore = playerScore === '' ? undefined : parseInt(playerScore, 10);
    const bScore = bankerScore === '' ? undefined : parseInt(bankerScore, 10);
    
    onAddResult(result, pScore, bScore);
    
    // Limpiamos los inputs después de registrar
    setPlayerScore('');
    setBankerScore('');
  };

  return (
    <div className="mb-16">
      
      {/* Indicador de Análisis de Diferencia */}
      <div className="flex justify-center mb-8 min-h-[50px]">
        {hasValues ? (
          <div className={`
            flex items-center gap-4 px-6 py-2.5 rounded-2xl font-black text-sm uppercase tracking-wider border shadow-xl transition-all duration-300 transform animate-in slide-in-from-bottom-2 fade-in
            ${isConfirmed 
              ? 'bg-white dark:bg-zinc-800 border-primary/50 shadow-primary/20 scale-105' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'}
          `}>
            {isConfirmed ? (
              <>
                <div className="flex flex-col items-center leading-none border-r border-zinc-200 dark:border-zinc-700 pr-4 mr-1">
                     <span className="text-2xl text-primary material-symbols-outlined mb-1">verified</span>
                     <span className="text-[10px] text-zinc-400">Dif: {diff}</span>
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-[10px] text-zinc-500 font-bold mb-0.5">Señal Confirmada</span>
                    <div className="flex items-center gap-2 text-lg">
                        <span>Apostar:</span>
                        {targetSide === 'Player' ? (
                             <span className="text-blue-500 drop-shadow-sm">JUGADOR</span>
                        ) : (
                             <span className="text-red-500 drop-shadow-sm">BANCA</span>
                        )}
                    </div>
                </div>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined !text-[24px]">do_not_disturb_on</span>
                 <div className="flex flex-col leading-none">
                    <span className="text-[10px] opacity-80">Diferencia: {diff}</span>
                    <span>No Apostar</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-zinc-400 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
             <span className="material-symbols-outlined !text-[18px] opacity-50">calculate</span>
             <span>Ingrese puntos para verificar señal</span>
          </div>
        )}
      </div>

      {/* Marcador Inputs */}
      <div className="flex items-end justify-center gap-6 mb-8 max-w-md mx-auto">
        <div className="flex-1 space-y-2">
          <label className="block text-xs font-black text-blue-500 uppercase tracking-widest text-center">Puntos Jugador</label>
          <div className="relative">
             <input 
              type="number"
              min="0"
              max="99"
              value={playerScore}
              onChange={(e) => {
                const val = e.target.value;
                // Permitir vacío o números entre 0 y 99
                if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 99)) {
                  setPlayerScore(val);
                }
              }}
              placeholder="-"
              className={`w-full bg-surface-light dark:bg-surface-dark border-2 rounded-2xl py-4 text-center text-3xl font-black text-zinc-900 dark:text-white focus:ring-4 transition-all placeholder:text-zinc-200 dark:placeholder:text-zinc-800
                ${hasValues && isConfirmed && targetSide === 'Player'
                    ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500/20 shadow-lg shadow-blue-500/10' 
                    : 'border-blue-500/20 focus:border-blue-500 focus:ring-blue-500/10'}
              `}
            />
          </div>
        </div>

        <div className="text-zinc-300 dark:text-zinc-700 font-black text-2xl pb-4">VS</div>

        <div className="flex-1 space-y-2">
          <label className="block text-xs font-black text-red-500 uppercase tracking-widest text-center">Puntos Banca</label>
          <div className="relative">
             <input 
              type="number"
              min="0"
              max="99"
              value={bankerScore}
              onChange={(e) => {
                const val = e.target.value;
                 // Permitir vacío o números entre 0 y 99
                if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 99)) {
                  setBankerScore(val);
                }
              }}
              placeholder="-"
              className={`w-full bg-surface-light dark:bg-surface-dark border-2 rounded-2xl py-4 text-center text-3xl font-black text-zinc-900 dark:text-white focus:ring-4 transition-all placeholder:text-zinc-200 dark:placeholder:text-zinc-800
                 ${hasValues && isConfirmed && targetSide === 'Banker'
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 shadow-lg shadow-red-500/10' 
                    : 'border-red-500/20 focus:border-red-500 focus:ring-red-500/10'}
              `}
            />
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <button 
          onClick={() => handleAction(GameResult.WIN)}
          className="group relative flex flex-col items-center justify-center h-32 bg-surface-light dark:bg-surface-dark hover:bg-green-50 dark:hover:bg-primary/10 border-2 border-transparent hover:border-primary rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
        >
          <span className="flex items-center justify-center size-14 rounded-full bg-primary/20 text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined !text-[32px]">check_circle</span>
          </span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">VICTORIA</span>
          <span className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest opacity-80">Registrar</span>
        </button>

        <button 
          onClick={() => handleAction(GameResult.LOSS)}
          className="group relative flex flex-col items-center justify-center h-32 bg-surface-light dark:bg-surface-dark hover:bg-red-50 dark:hover:bg-danger/10 border-2 border-transparent hover:border-danger rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
        >
          <span className="flex items-center justify-center size-14 rounded-full bg-danger/20 text-danger mb-3 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined !text-[32px]">cancel</span>
          </span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">PÉRDIDA</span>
          <span className="text-[10px] text-danger font-bold mt-1 uppercase tracking-widest opacity-80">Registrar</span>
        </button>

        <button 
          onClick={() => handleAction(GameResult.TIE)}
          className="group relative flex flex-col items-center justify-center h-32 bg-surface-light dark:bg-surface-dark hover:bg-yellow-50 dark:hover:bg-yellow-500/10 border-2 border-transparent hover:border-yellow-400 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
        >
          <span className="flex items-center justify-center size-14 rounded-full bg-yellow-400/20 text-yellow-500 mb-3 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined !text-[32px]">remove</span>
          </span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">EMPATE</span>
          <span className="text-[10px] text-yellow-500 font-bold mt-1 uppercase tracking-widest opacity-80">Registrar</span>
        </button>

        <button 
          onClick={onUndo}
          disabled={isUndoDisabled}
          className="group relative flex flex-col items-center justify-center h-32 bg-surface-light dark:bg-surface-dark hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:bg-surface-light dark:disabled:hover:bg-surface-dark"
        >
          <span className="flex items-center justify-center size-14 rounded-full bg-zinc-500/10 text-zinc-500 mb-3 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined !text-[32px]">undo</span>
          </span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">DESHACER</span>
          <span className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-widest opacity-80">Última Entrada</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
