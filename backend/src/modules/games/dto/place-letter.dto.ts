import { IsInt, IsNotEmpty, IsString, Matches, Max, Min } from 'class-validator';

export class PlaceLetterDto {
  @IsString()
  @IsNotEmpty()
  gameId!: string;

  @IsString()
  @IsNotEmpty()
  playerId!: string;

  @IsString()
  @Matches(/^[A-Za-z]$/)
  letter!: string;

  @IsInt()
  @Min(0)
  @Max(3)
  row!: number;

  @IsInt()
  @Min(0)
  @Max(3)
  column!: number;
}
