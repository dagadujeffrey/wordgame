import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class LeaderboardService {
  constructor(private readonly usersService: UsersService) {}

  async globalLeaderboard() {
    const users = await this.usersService.listUsers();
    return users
      .map((user) => ({
        id: user.id,
        username: user.username,
        gamesPlayed: user.gamesPlayed,
        totalPoints: user.totalPoints,
        averagePointsPerGame: user.gamesPlayed === 0 ? 0 : user.totalPoints / user.gamesPlayed,
      }))
      .sort((a, b) => b.averagePointsPerGame - a.averagePointsPerGame);
  }
}
