import { Injectable, NotFoundException } from '@nestjs/common';
import { ResearchRepository } from './repositories/research.repository';
import { CreateResearchDto, QueryResearchDto } from './dto/research.dto';
import { Types } from 'mongoose';

@Injectable()
export class ResearchService {
  constructor(private readonly researchRepo: ResearchRepository) {}

  async findAll(query: QueryResearchDto) {
    const [data, total] = await this.researchRepo.findAll(query);
    return {
      data: data.map((r) => this.serialize(r)),
      total,
      page: query.page || 1,
      limit: query.limit || 20,
    };
  }

  async findOne(id: string) {
    const item = await this.researchRepo.findById(id);
    if (!item) throw new NotFoundException('Research item not found');
    return this.serialize(item);
  }

  async create(dto: CreateResearchDto) {
    const item = await this.researchRepo.create(dto);
    return this.serialize(item);
  }

  async remove(id: string) {
    await this.researchRepo.softDelete(id);
    return { message: 'Research item deleted' };
  }

  private serialize(item: Awaited<ReturnType<ResearchRepository['findById']>>) {
    if (!item) throw new NotFoundException('Research item not found');
    return {
      id: (item._id as Types.ObjectId).toString(),
      title: item.title,
      summary: item.summary,
      source: item.source,
      date: item.date,
      month: item.month,
    };
  }
}
