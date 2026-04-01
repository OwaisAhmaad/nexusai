import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelRepository } from './repositories/model.repository';
import { CreateModelDto, UpdateModelDto, QueryModelDto } from './dto/model.dto';
import { Types } from 'mongoose';

@Injectable()
export class ModelsService {
  constructor(private readonly modelRepo: ModelRepository) {}

  async findAll(query: QueryModelDto) {
    const [data, total] = await this.modelRepo.findAll(query);
    return {
      data: data.map((m) => this.serialize(m)),
      total,
      page: query.page || 1,
      limit: query.limit || 20,
    };
  }

  async findOne(id: string) {
    const model = await this.modelRepo.findById(id);
    if (!model) throw new NotFoundException('Model not found');
    return this.serialize(model);
  }

  async create(dto: CreateModelDto) {
    const model = await this.modelRepo.create(dto);
    return this.serialize(model);
  }

  async update(id: string, dto: UpdateModelDto) {
    const model = await this.modelRepo.update(id, dto);
    if (!model) throw new NotFoundException('Model not found');
    return this.serialize(model);
  }

  async remove(id: string) {
    await this.modelRepo.softDelete(id);
    return { message: 'Model deleted successfully' };
  }

  private serialize(model: ReturnType<typeof this.modelRepo.findById> extends Promise<infer T> ? NonNullable<T> : never) {
    return {
      id: (model._id as Types.ObjectId).toString(),
      name: model.name,
      lab: model.lab,
      description: model.description,
      tags: model.tags,
      contextWindow: model.contextWindow,
      inputPrice: model.inputPrice,
      outputPrice: model.outputPrice,
      rating: model.rating,
      reviews: model.reviews,
      isNew: model.isNew,
      isFeatured: model.isFeatured,
      category: model.category,
      imageUrl: model.imageUrl,
    };
  }
}
