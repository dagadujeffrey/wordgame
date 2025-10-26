import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';

@Module({
  providers: [GamesService, GamesGateway],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
