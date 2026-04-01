import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ModelsService } from './models.service';
import { CreateModelDto, UpdateModelDto, QueryModelDto } from './dto/model.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('models')
@Controller('api/v1/models')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Public()
  @Get()
  @ApiResponse({ status: 200, description: 'List of AI models' })
  async findAll(@Query() query: QueryModelDto) {
    return this.modelsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiResponse({ status: 200, description: 'AI model details' })
  @ApiResponse({ status: 404, description: 'Model not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.modelsService.findOne(id);
    return { data };
  }

  @Post()
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Model created' })
  async create(@Body() dto: CreateModelDto) {
    const data = await this.modelsService.create(dto);
    return { data };
  }

  @Patch(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Model updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateModelDto) {
    const data = await this.modelsService.update(id, dto);
    return { data };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Model deleted' })
  async remove(@Param('id') id: string) {
    return this.modelsService.remove(id);
  }
}
