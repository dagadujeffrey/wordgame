import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { GameState, GameMode, Difficulty, GameEngine } from './game.engine';
import { PlayerState } from '../../common/interfaces/game.interfaces';
import { DictionaryService } from '../dictionary/dictionary.service';

@Injectable()
export class GamesService {
  private readonly games = new Map<string, GameState>();
  private readonly engine: GameEngine;

  constructor(private readonly dictionary: DictionaryService) {
    this.engine = new GameEngine(dictionary);
  }

  createGame(players: PlayerState[], mode: GameMode, difficulty?: Difficulty): GameState {
    const id = randomUUID();
    const state: GameState = {
      id,
      players,
      board: this.engine.createEmptyBoard(),
      currentPlayerIndex: 0,
      isComplete: false,
      mode,
      aiDifficulty: difficulty,
    };

    this.games.set(id, state);
    return state;
  }

  getGame(id: string): GameState {
    const game = this.games.get(id);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game;
  }

  placeLetter(gameId: string, playerId: string, row: number, column: number, letter: string) {
    const game = this.getGame(gameId);
    this.engine.placeLetter(game, playerId, row, column, letter);
    return game;
  }

  getBoard(gameId: string) {
    const game = this.getGame(gameId);
    return game.board;
  }

  async completeGame(gameId: string) {
    const game = this.getGame(gameId);
    const breakdown = await this.engine.score(game);

    for (const player of game.players) {
      player.score = breakdown.totals[player.id] ?? 0;
    }

    return breakdown;
  }

  listGames(): GameState[] {
    return Array.from(this.games.values());
  }
}
