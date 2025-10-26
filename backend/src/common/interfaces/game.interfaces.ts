export type PlayerId = string;

export interface PlayerState {
  id: PlayerId;
  username: string;
  score: number;
}

export interface CellState {
  letter: string;
  ownerId: PlayerId | null;
}

export type GridState = CellState[][];

export interface GameSnapshot {
  id: string;
  players: PlayerState[];
  board: GridState;
  currentPlayerId: PlayerId;
  isComplete: boolean;
}
