export interface UserEntity {
  id: string;
  username: string;
  email: string;
  displayName: string;
  passwordHash: string;
  gamesPlayed: number;
  totalPoints: number;
  createdAt: Date;
}
