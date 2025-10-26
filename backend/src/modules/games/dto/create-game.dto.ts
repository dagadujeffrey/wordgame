import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateGameDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(32, { each: true })
  players!: string[];

  @IsOptional()
  @IsString()
  @IsIn(['local', 'online', 'single'])
  mode: 'local' | 'online' | 'single' = 'local';

  @IsOptional()
  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty?: 'easy' | 'medium' | 'hard';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  roomName?: string;
}
