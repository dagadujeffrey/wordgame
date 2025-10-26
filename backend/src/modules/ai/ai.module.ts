import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { GamesModule } from '../games/games.module';
import { DictionaryModule } from '../dictionary/dictionary.module';

@Module({
  imports: [GamesModule, DictionaryModule],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
