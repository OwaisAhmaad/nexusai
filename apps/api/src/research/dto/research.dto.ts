import { IsString, IsNumber, IsOptional, Min, Max, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResearchDto {
  @ApiProperty({ example: 'GPT-5 Achieves AGI Benchmarks' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ example: 'OpenAI announces breakthrough...' })
  @IsString()
  summary: string;

  @ApiProperty({ example: 'OpenAI Blog' })
  @IsString()
  source: string;

  @ApiProperty({ example: 15 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(31)
  date: number;

  @ApiProperty({ example: 'Jan' })
  @IsString()
  month: string;
}

export class QueryResearchDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
