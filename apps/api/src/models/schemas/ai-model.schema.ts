import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AiModelDocument = AiModel & Document;

@Schema({ timestamps: true })
export class AiModel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lab: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  contextWindow: number;

  @Prop({ required: true })
  inputPrice: number;

  @Prop({ required: true })
  outputPrice: number;

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ default: 0 })
  reviews: number;

  @Prop({ default: false })
  isNew: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ required: true })
  category: string;

  @Prop()
  imageUrl?: string;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;

  // Recommendation metadata
  @Prop({ type: [String], default: [] })
  useCases: string[];

  @Prop({ default: 'medium', enum: ['very-fast', 'fast', 'medium', 'slow'] })
  speed: string;

  @Prop()
  bestFor?: string;
}

export const AiModelSchema = SchemaFactory.createForClass(AiModel);
AiModelSchema.index({ name: 'text', description: 'text', lab: 'text' });
AiModelSchema.index({ category: 1, isFeatured: 1, status: 1 });
