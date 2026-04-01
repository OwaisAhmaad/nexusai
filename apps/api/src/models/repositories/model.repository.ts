import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { AiModel, AiModelDocument } from '../schemas/ai-model.schema';
import { IModelRepository } from '../interfaces/model.repository.interface';
import { CreateModelDto, UpdateModelDto, QueryModelDto } from '../dto/model.dto';

@Injectable()
export class ModelRepository implements IModelRepository {
  constructor(
    @InjectModel(AiModel.name)
    private readonly modelModel: Model<AiModelDocument>,
  ) {}

  async findById(id: string): Promise<AiModelDocument | null> {
    return this.modelModel.findOne({ _id: id, status: 'active' }).exec();
  }

  async findAll(query: QueryModelDto): Promise<[AiModelDocument[], number]> {
    const { category, search, lab, page = 1, limit = 20 } = query;
    const filter: FilterQuery<AiModelDocument> = { status: 'active' };

    if (category) filter['category'] = category;
    if (lab) filter['lab'] = { $regex: lab, $options: 'i' };
    if (search) {
      filter['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { lab: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.modelModel.find(filter).skip(skip).limit(limit).exec(),
      this.modelModel.countDocuments(filter).exec(),
    ]);

    return [data, total];
  }

  async create(data: CreateModelDto): Promise<AiModelDocument> {
    const model = new this.modelModel(data);
    return model.save();
  }

  async update(id: string, data: UpdateModelDto): Promise<AiModelDocument | null> {
    return this.modelModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<void> {
    await this.modelModel
      .findByIdAndUpdate(id, { status: 'inactive' })
      .exec();
  }
}
