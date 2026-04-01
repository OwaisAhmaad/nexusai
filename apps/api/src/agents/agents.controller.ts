import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto, UpdateAgentDto } from './dto/agent.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@ApiTags('agents')
@Controller('api/v1/agents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Public()
  @Get('templates')
  @ApiResponse({ status: 200, description: 'List of agent templates' })
  async getTemplates() {
    const data = await this.agentsService.getTemplates();
    return { data };
  }

  @Get('my')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User created agents' })
  async getMyAgents(@CurrentUser() user: JwtPayload) {
    const data = await this.agentsService.getUserAgents(user.sub);
    return { data };
  }

  @Public()
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Agent details' })
  async findOne(@Param('id') id: string) {
    const data = await this.agentsService.findOne(id);
    return { data };
  }

  @Post('templates')
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Template created' })
  async createTemplate(@Body() dto: CreateAgentDto) {
    const data = await this.agentsService.createTemplate(dto);
    return { data };
  }

  @Post('my')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'User agent created' })
  async createUserAgent(
    @Body() dto: CreateAgentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const data = await this.agentsService.createUserAgent(dto, user.sub);
    return { data };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Agent updated' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAgentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const data = await this.agentsService.update(id, dto, user.sub, user.role);
    return { data };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Agent deleted' })
  async remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }
}
