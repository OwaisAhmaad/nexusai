import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent, AgentDocument } from '../schemas/agent.schema';
import { CreateAgentDto, UpdateAgentDto } from '../dto/agent.dto';

@Injectable()
export class AgentRepository {
  constructor(
    @InjectModel(Agent.name)
    private readonly agentModel: Model<AgentDocument>,
  ) {}

  async findTemplates(): Promise<AgentDocument[]> {
    return this.agentModel
      .find({ type: 'template', status: 'active' })
      .exec();
  }

  async findByUser(userId: string): Promise<AgentDocument[]> {
    return this.agentModel
      .find({ createdBy: userId, type: 'user', status: 'active' })
      .exec();
  }

  async findById(id: string): Promise<AgentDocument | null> {
    return this.agentModel.findOne({ _id: id, status: 'active' }).exec();
  }

  async create(data: CreateAgentDto & { type: string; createdBy?: string }): Promise<AgentDocument> {
    const agent = new this.agentModel(data);
    return agent.save();
  }

  async update(id: string, data: UpdateAgentDto): Promise<AgentDocument | null> {
    return this.agentModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<void> {
    await this.agentModel
      .findByIdAndUpdate(id, { status: 'inactive' })
      .exec();
  }
}
