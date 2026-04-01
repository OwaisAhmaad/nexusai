import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Research, ResearchDocument } from '../schemas/research.schema';
import { CreateResearchDto, QueryResearchDto } from '../dto/research.dto';

@Injectable()
export class ResearchRepository {
  constructor(
    @InjectModel(Research.name)
    private readonly researchModel: Model<ResearchDocument>,
  ) {}

  async findAll(query: QueryResearchDto): Promise<[ResearchDocument[], number]> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.researchModel
        .find({ status: 'active' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.researchModel.countDocuments({ status: 'active' }).exec(),
    ]);
    return [data, total];
  }

  async findById(id: string): Promise<ResearchDocument | null> {
    return this.researchModel.findOne({ _id: id, status: 'active' }).exec();
  }

  async create(data: CreateResearchDto): Promise<ResearchDocument> {
    const item = new this.researchModel(data);
    return item.save();
  }

  async softDelete(id: string): Promise<void> {
    await this.researchModel
      .findByIdAndUpdate(id, { status: 'inactive' })
      .exec();
  }
}
