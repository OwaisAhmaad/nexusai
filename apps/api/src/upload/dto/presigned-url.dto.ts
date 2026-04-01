import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlDto {
  @ApiProperty({ example: 'avatars', enum: ['avatars', 'models', 'agents'] })
  @IsString()
  @IsIn(['avatars', 'models', 'agents'])
  folder: 'avatars' | 'models' | 'agents';

  @ApiProperty({ example: 'avatar.jpg' })
  @IsString()
  filename: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  contentType: string;
}
