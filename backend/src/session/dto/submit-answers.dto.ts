import { IsString, IsInt, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsInt()
  questionId: number;

  @IsString()
  dimension: string;
}

export class SubmitAnswersDto {
  @IsString()
  participantId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsString()
  @IsOptional()
  locale?: string;
}
