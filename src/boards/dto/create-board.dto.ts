import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  ownerIds?: string[];

  @IsOptional()
  @IsArray()
  memberIds?: string[];

  @IsOptional()
  @IsArray()
  columnOrderIds?: string[];
}
