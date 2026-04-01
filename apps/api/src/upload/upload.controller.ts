import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { PresignedUrlDto } from './dto/presigned-url.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('upload')
@Controller('api/v1/upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned')
  @ApiResponse({ status: 200, description: 'Presigned URL for S3 upload' })
  async getPresignedUrl(@Body() dto: PresignedUrlDto) {
    const data = await this.uploadService.getPresignedUrl(
      dto.folder,
      dto.filename,
      dto.contentType,
    );
    return { data };
  }
}
