import { IsString, IsOptional, IsIn, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RecommendDto {
  @ApiProperty({
    example: 'coding',
    enum: ['coding', 'writing', 'analysis', 'customer-support', 'research', 'real-time', 'creative', 'math', 'multilingual', 'vision'],
    description: 'Primary use case',
  })
  @IsString()
  @IsIn(['coding', 'writing', 'analysis', 'customer-support', 'research', 'real-time', 'creative', 'math', 'multilingual', 'vision'])
  useCase: string;

  @ApiProperty({
    example: 'medium',
    enum: ['low', 'medium', 'high'],
    description: 'Budget sensitivity: low = cheapest options, high = best regardless of cost',
  })
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  budget: string;

  @ApiProperty({
    example: 'fast',
    enum: ['any', 'fast', 'best'],
    description: 'Speed preference',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['any', 'fast', 'best'])
  speed?: string;

  @ApiProperty({
    example: 50000,
    description: 'Required context window in tokens',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  contextNeeded?: number;
}
