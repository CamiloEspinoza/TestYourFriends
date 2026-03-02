import { IsString, IsOptional, IsEmail } from 'class-validator';

export class JoinSessionDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
