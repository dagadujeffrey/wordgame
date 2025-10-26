import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserEntity } from './user.entity';

interface CreateUserInput {
  username: string;
  email: string;
  displayName: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  private readonly users = new Map<string, UserEntity>();

  async createUser(input: CreateUserInput): Promise<UserEntity> {
    const now = new Date();
    const user: UserEntity = {
      id: randomUUID(),
      username: input.username,
      email: input.email.toLowerCase(),
      displayName: input.displayName,
      passwordHash: input.passwordHash,
      gamesPlayed: 0,
      totalPoints: 0,
      createdAt: now,
    };

    this.users.set(user.id, user);
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const normalized = email.toLowerCase();
    return Array.from(this.users.values()).find((user) => user.email === normalized);
  }

  async findById(id: string): Promise<UserEntity> {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateStats(id: string, pointsEarned: number): Promise<UserEntity> {
    const user = await this.findById(id);
    user.gamesPlayed += 1;
    user.totalPoints += pointsEarned;
    return user;
  }

  async listUsers(): Promise<UserEntity[]> {
    return Array.from(this.users.values());
  }
}
