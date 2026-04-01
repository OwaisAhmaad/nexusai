import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResearchService } from './research.service';
import { CreateResearchDto, QueryResearchDto } from './dto/research.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('research')
@Controller('api/v1/research')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Public()
  @Get()
  @ApiResponse({ status: 200, description: 'Research feed' })
  async findAll(@Query() query: QueryResearchDto) {
    return this.researchService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Research item details' })
  async findOne(@Param('id') id: string) {
    const data = await this.researchService.findOne(id);
    return { data };
  }

  @Post()
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Research item created' })
  async create(@Body() dto: CreateResearchDto) {
    const data = await this.researchService.create(dto);
    return { data };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Research item deleted' })
  async remove(@Param('id') id: string) {
    return this.researchService.remove(id);
  }
}
