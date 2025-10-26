import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'development-secret';

  constructor(private readonly usersService: UsersService) {}

  async register(dto: RegisterDto) {
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.usersService.createUser({
      username: dto.username,
      email: dto.email,
      passwordHash,
      displayName: dto.displayName ?? dto.username,
    });

    return this.signUser(user.id, user.username);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signUser(user.id, user.username);
  }

  verify(token: string): JwtPayload {
    return jwt.verify(token, this.jwtSecret) as JwtPayload;
  }

  private signUser(userId: string, username: string) {
    const payload: JwtPayload = {
      sub: userId,
      username,
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      user: {
        id: userId,
        username,
      },
    };
  }
}
