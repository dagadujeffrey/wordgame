import { DictionaryService } from '../dictionary/dictionary.service';
import { GridState, PlayerId, PlayerState } from '../../common/interfaces/game.interfaces';

export interface GameWord {
  word: string;
  length: number;
  coordinates: [number, number][];
}

export interface GameScoreBreakdown {
  rows: (GameWord | null)[];
  columns: (GameWord | null)[];
  totals: Record<PlayerId, number>;
}

export type GameMode = 'local' | 'online' | 'single';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  id: string;
  players: PlayerState[];
  board: GridState;
  currentPlayerIndex: number;
  isComplete: boolean;
  mode: GameMode;
  aiDifficulty?: Difficulty;
}

export class GameEngine {
  constructor(private readonly dictionary: DictionaryService) {}

  createEmptyBoard(): GridState {
    return Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => ({ letter: '', ownerId: null })),
    );
  }

  rotateTurn(state: GameState): void {
    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  }

  placeLetter(state: GameState, playerId: string, row: number, column: number, letter: string) {
    if (state.isComplete) {
      throw new Error('Game already complete');
    }

    const normalizedLetter = letter.toUpperCase();
    const cell = state.board[row][column];
    if (cell.letter) {
      throw new Error('Cell already occupied');
    }

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      throw new Error('Not current player turn');
    }

    cell.letter = normalizedLetter;
    cell.ownerId = playerId;

    if (this.isBoardFull(state.board)) {
      state.isComplete = true;
    } else {
      this.rotateTurn(state);
    }
  }

  isBoardFull(board: GridState): boolean {
    return board.every((row) => row.every((cell) => !!cell.letter));
  }

  async score(state: GameState): Promise<GameScoreBreakdown> {
    const totals: Record<PlayerId, number> = {};
    for (const player of state.players) {
      totals[player.id] = 0;
    }

    const rows: (GameWord | null)[] = [];
    const columns: (GameWord | null)[] = [];

    for (let row = 0; row < 4; row += 1) {
      const word = await this.findBestWord(state.board[row].map((cell) => cell.letter), (index) => [row, index]);
      rows.push(word);
      if (word) {
        for (const [r, c] of word.coordinates) {
          const ownerId = state.board[r][c].ownerId;
          if (ownerId) {
            totals[ownerId] += word.length;
          }
        }
      }
    }

    for (let col = 0; col < 4; col += 1) {
      const letters = Array.from({ length: 4 }, (_, row) => state.board[row][col].letter);
      const word = await this.findBestWord(letters, (index) => [index, col]);
      columns.push(word);
      if (word) {
        for (const [r, c] of word.coordinates) {
          const ownerId = state.board[r][c].ownerId;
          if (ownerId) {
            totals[ownerId] += word.length;
          }
        }
      }
    }

    return { rows, columns, totals };
  }

  private async findBestWord(
    letters: string[],
    coordinateResolver: (index: number) => [number, number],
  ): Promise<GameWord | null> {
    let best: GameWord | null = null;

    for (let start = 0; start < letters.length; start += 1) {
      for (let end = start + 1; end < letters.length; end += 1) {
        const slice = letters.slice(start, end + 1);
        if (slice.some((letter) => !letter)) {
          continue;
        }

        const word = slice.join('');
        if (word.length < 2 || word.length > 4) {
          continue;
        }

        if (!(await this.dictionary.isValidWord(word))) {
          continue;
        }

        if (!best || word.length > best.length) {
          const coordinates: [number, number][] = slice.map((_, index) => coordinateResolver(start + index));
          best = {
            word,
            length: word.length,
            coordinates,
          };
        }
      }
    }

    return best;
  }
}
