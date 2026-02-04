
export enum GameResult {
  WIN = 'Win',
  LOSS = 'Loss',
  TIE = 'Tie'
}

export type StrategyID = 'strat1' | 'strat2' | 'strat3' | 'strat4';

export interface StrategySettings {
  id: StrategyID;
  name: string;
  baseUnit: number;
  maxLossStreak: number;
}

export interface HistoryItem {
  id: number;
  time: string;
  result: GameResult;
  streak: number;
  strategyId: StrategyID;
  betAmount?: number;
  playerScore?: number;
  bankerScore?: number;
  targetBet?: 'Player' | 'Banker'; // Nuevo campo: Indica a quién se debía apostar
}

export interface Stats {
  wins: number;
  losses: number;
  ties: number;
  total: number;
  currentLossStreak: number;
  maxHistoricalStreak: number;
  balance: number; // En unidades
}

export type ViewState = 'dashboard' | 'config' | 'stats';
