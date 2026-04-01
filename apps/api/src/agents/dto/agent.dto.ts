import {
  IsString,
  IsOptional,
  IsArray,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ example: 'Code Reviewer' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'Reviews code for bugs and improvements' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'gpt-4o' })
  @IsString()
  model: string;

  @ApiProperty({ example: ['code', 'review'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: '🤖' })
  @IsString()
  icon: string;
}

export class UpdateAgentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;
}
