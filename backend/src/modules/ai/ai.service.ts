import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { GamesService } from '../games/games.service';
import { Difficulty, GameEngine, GameState } from '../games/game.engine';
import { DictionaryService } from '../dictionary/dictionary.service';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const COMMON_LETTERS = 'ETAOINSHRDLU'.split('');

@Injectable()
export class AiService {
  private readonly engine: GameEngine;

  constructor(private readonly gamesService: GamesService, dictionary: DictionaryService) {
    this.engine = new GameEngine(dictionary);
  }

  async chooseMove(gameId: string, aiPlayerId: string): Promise<{ row: number; column: number; letter: string } | null> {
    const game = this.gamesService.getGame(gameId);
    if (!game || game.mode !== 'single') {
      return null;
    }

    const difficulty: Difficulty = game.aiDifficulty ?? 'easy';
    const availableMoves = this.getAvailableCells(game);
    if (availableMoves.length === 0) {
      return null;
    }

    switch (difficulty) {
      case 'hard':
        return this.bestHeuristicMove(game, aiPlayerId, availableMoves, true);
      case 'medium':
        return this.bestHeuristicMove(game, aiPlayerId, availableMoves, false);
      case 'easy':
      default:
        return this.randomMove(availableMoves);
    }
  }

  private getAvailableCells(game: GameState) {
    const cells: { row: number; column: number }[] = [];
    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        if (!game.board[row][column].letter) {
          cells.push({ row, column });
        }
      }
    }
    return cells;
  }

  private randomMove(cells: { row: number; column: number }[]) {
    const cell = cells[randomInt(cells.length)];
    const letter = COMMON_LETTERS[randomInt(COMMON_LETTERS.length)];
    return { ...cell, letter };
  }

  private async bestHeuristicMove(
    game: GameState,
    aiPlayerId: string,
    cells: { row: number; column: number }[],
    maximizeSelf: boolean,
  ) {
    let bestMove: { row: number; column: number; letter: string } | null = null;
    let bestScore = maximizeSelf ? -Infinity : Infinity;

    for (const cell of cells) {
      for (const letter of LETTERS) {
        const original = { ...game.board[cell.row][cell.column] };
        game.board[cell.row][cell.column].letter = letter;
        game.board[cell.row][cell.column].ownerId = aiPlayerId;

        const { totals } = await this.engine.score(game);
        const aiScore = totals[aiPlayerId] ?? 0;
        const opponentScore = Object.entries(totals)
          .filter(([playerId]) => playerId !== aiPlayerId)
          .reduce((max, [_, score]) => Math.max(max, score), 0);

        const value = maximizeSelf ? aiScore - opponentScore : opponentScore - aiScore;
        const shouldUpdate = maximizeSelf ? value > bestScore : value < bestScore;

        if (shouldUpdate) {
          bestScore = value;
          bestMove = { row: cell.row, column: cell.column, letter };
        }

        game.board[cell.row][cell.column] = original;
      }
    }

    if (!bestMove) {
      return this.randomMove(cells);
    }

    return bestMove;
  }
}
