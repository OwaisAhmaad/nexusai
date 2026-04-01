import { AiModelDocument } from '../schemas/ai-model.schema';
import { CreateModelDto, UpdateModelDto, QueryModelDto } from '../dto/model.dto';

export interface IModelRepository {
  findById(id: string): Promise<AiModelDocument | null>;
  findAll(query: QueryModelDto): Promise<[AiModelDocument[], number]>;
  create(data: CreateModelDto): Promise<AiModelDocument>;
  update(id: string, data: UpdateModelDto): Promise<AiModelDocument | null>;
  softDelete(id: string): Promise<void>;
}
