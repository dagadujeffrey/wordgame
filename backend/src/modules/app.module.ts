import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AiModule } from './ai/ai.module';
import { DictionaryModule } from './dictionary/dictionary.module';

@Module({
  imports: [
    DictionaryModule,
    AiModule,
    AuthModule,
    UsersModule,
    GamesModule,
    LeaderboardModule,
  ],
})
export class AppModule {}
