import { Controller, Get, Param } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('move/:gameId/:playerId')
  async chooseMove(@Param('gameId') gameId: string, @Param('playerId') playerId: string) {
    return this.aiService.chooseMove(gameId, playerId);
  }
}
