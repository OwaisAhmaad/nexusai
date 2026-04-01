import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelRepository } from './repositories/model.repository';
import { CreateModelDto, UpdateModelDto, QueryModelDto } from './dto/model.dto';
import { RecommendDto } from './dto/recommend.dto';
import { Types } from 'mongoose';
import { AiModelDocument } from './schemas/ai-model.schema';

// Score weights for recommendation engine
const USE_CASE_MODEL_AFFINITY: Record<string, string[]> = {
  coding: ['GPT-4o', 'Claude Sonnet 4.6', 'Claude Opus 4.6', 'Gemini 2.5 Pro', 'Mistral Large'],
  writing: ['Claude Opus 4.6', 'Claude Sonnet 4.6', 'GPT-4o'],
  analysis: ['Gemini 2.5 Pro', 'Claude Opus 4.6', 'DeepSeek R1', 'GPT-4o'],
  'customer-support': ['Claude Sonnet 4.6', 'Claude Haiku 4.5', 'GPT-4o mini'],
  research: ['Claude Opus 4.6', 'Gemini 2.5 Pro', 'DeepSeek R1'],
  'real-time': ['Claude Haiku 4.5', 'GPT-4o mini', 'Gemini 2.0 Flash'],
  creative: ['DALL·E 3', 'GPT-4o', 'Claude Opus 4.6'],
  math: ['DeepSeek R1', 'Gemini 2.5 Pro', 'GPT-4o'],
  multilingual: ['Mistral Large', 'GPT-4o', 'Claude Sonnet 4.6'],
  vision: ['GPT-4o', 'Gemini 2.5 Pro', 'Gemini 2.0 Flash'],
};

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

  async recommend(dto: RecommendDto) {
    const [allModels] = await this.modelRepo.findAll({ limit: 100 });

    const affinityList = USE_CASE_MODEL_AFFINITY[dto.useCase] || [];

    const scored = allModels
      .filter((m) => {
        // Filter by context if specified
        if (dto.contextNeeded && dto.contextNeeded > 0) {
          return m.contextWindow >= dto.contextNeeded || m.contextWindow === 0;
        }
        return true;
      })
      .map((m) => {
        let score = 0;

        // Use case affinity
        const affinityRank = affinityList.indexOf(m.name);
        if (affinityRank !== -1) {
          score += (affinityList.length - affinityRank) * 20;
        }

        // Budget scoring
        const avgPrice = (m.inputPrice + m.outputPrice) / 2;
        if (dto.budget === 'low') {
          score += avgPrice < 0.001 ? 30 : avgPrice < 0.005 ? 15 : 0;
        } else if (dto.budget === 'medium') {
          score += avgPrice < 0.005 ? 20 : avgPrice < 0.02 ? 10 : 0;
        } else {
          // high budget = focus on quality
          score += m.rating * 10;
          score += m.isFeatured ? 20 : 0;
        }

        // Speed preference
        if (dto.speed === 'fast') {
          score +=
            m.speed === 'very-fast' ? 25 : m.speed === 'fast' ? 15 : 0;
        }

        // Rating bonus
        score += m.rating * 5;

        // Featured bonus
        score += m.isFeatured ? 10 : 0;

        return { model: m, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return {
      useCase: dto.useCase,
      budget: dto.budget,
      recommendations: scored.map(({ model, score }) => ({
        ...this.serialize(model),
        recommendationScore: score,
        reasoning: this.buildReasoning(model, dto),
      })),
    };
  }

  private buildReasoning(model: AiModelDocument, dto: RecommendDto): string {
    const reasons: string[] = [];
    const affinityList = USE_CASE_MODEL_AFFINITY[dto.useCase] || [];
    if (affinityList.includes(model.name)) {
      reasons.push(`highly optimized for ${dto.useCase}`);
    }
    const avgPrice = (model.inputPrice + model.outputPrice) / 2;
    if (dto.budget === 'low' && avgPrice < 0.001) {
      reasons.push('very affordable pricing');
    }
    if (dto.speed === 'fast' && (model.speed === 'fast' || model.speed === 'very-fast')) {
      reasons.push('fast response times');
    }
    if (model.rating >= 4.7) {
      reasons.push(`top-rated (${model.rating}/5)`);
    }
    return reasons.length > 0
      ? `Recommended because: ${reasons.join(', ')}.`
      : `${model.name} is a solid choice for your requirements.`;
  }

  private serialize(model: AiModelDocument) {
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
      speed: model.speed,
      useCases: model.useCases,
      bestFor: model.bestFor,
    };
  }
}
