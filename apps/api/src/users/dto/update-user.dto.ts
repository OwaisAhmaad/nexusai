import { IsString, IsOptional, MinLength, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiProperty({ required: false, example: 'https://s3.example.com/avatars/user.jpg' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
