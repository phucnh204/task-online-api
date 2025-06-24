import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  boardId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  cardOrderIds?: string[];
}
