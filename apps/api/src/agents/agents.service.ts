import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AgentRepository } from './repositories/agent.repository';
import { CreateAgentDto, UpdateAgentDto } from './dto/agent.dto';
import { Types } from 'mongoose';

@Injectable()
export class AgentsService {
  constructor(private readonly agentRepo: AgentRepository) {}

  async getTemplates() {
    const agents = await this.agentRepo.findTemplates();
    return agents.map((a) => this.serialize(a));
  }

  async getUserAgents(userId: string) {
    const agents = await this.agentRepo.findByUser(userId);
    return agents.map((a) => this.serialize(a));
  }

  async findOne(id: string) {
    const agent = await this.agentRepo.findById(id);
    if (!agent) throw new NotFoundException('Agent not found');
    return this.serialize(agent);
  }

  async createTemplate(dto: CreateAgentDto) {
    const agent = await this.agentRepo.create({ ...dto, type: 'template' });
    return this.serialize(agent);
  }

  async createUserAgent(dto: CreateAgentDto, userId: string) {
    const agent = await this.agentRepo.create({
      ...dto,
      type: 'user',
      createdBy: userId,
    });
    return this.serialize(agent);
  }

  async update(id: string, dto: UpdateAgentDto, userId: string, role: string) {
    const agent = await this.agentRepo.findById(id);
    if (!agent) throw new NotFoundException('Agent not found');

    if (
      agent.type === 'user' &&
      role !== 'admin' &&
      (agent.createdBy as Types.ObjectId)?.toString() !== userId
    ) {
      throw new ForbiddenException('Cannot modify another user\'s agent');
    }

    const updated = await this.agentRepo.update(id, dto);
    if (!updated) throw new NotFoundException('Agent not found');
    return this.serialize(updated);
  }

  async remove(id: string) {
    await this.agentRepo.softDelete(id);
    return { message: 'Agent deleted' };
  }

  private serialize(agent: Awaited<ReturnType<AgentRepository['findById']>>) {
    if (!agent) throw new NotFoundException('Agent not found');
    return {
      id: (agent._id as Types.ObjectId).toString(),
      name: agent.name,
      description: agent.description,
      model: agent.model,
      tags: agent.tags,
      icon: agent.icon,
      type: agent.type,
      createdBy: agent.createdBy?.toString(),
    };
  }
}
