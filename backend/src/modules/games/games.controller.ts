import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { PlaceLetterDto } from './dto/place-letter.dto';
import { PlayerState } from '../../common/interfaces/game.interfaces';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  list() {
    return this.gamesService.listGames();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.gamesService.getGame(id);
  }

  @Post()
  create(@Body() dto: CreateGameDto) {
    const players: PlayerState[] = dto.players.map((player, index) => ({
      id: player,
      username: player,
      score: 0,
    }));

    return this.gamesService.createGame(players, dto.mode, dto.difficulty);
  }

  @Post('place')
  place(@Body() dto: PlaceLetterDto) {
    const { gameId, playerId, row, column, letter } = dto;
    return this.gamesService.placeLetter(gameId, playerId, row, column, letter);
  }

  @Post(':id/score')
  async score(@Param('id') id: string) {
    return this.gamesService.completeGame(id);
  }
}
