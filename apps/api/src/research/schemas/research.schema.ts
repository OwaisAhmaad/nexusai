import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResearchDocument = Research & Document;

@Schema({ timestamps: true })
export class Research {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  date: number;

  @Prop({ required: true })
  month: string;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;
}

export const ResearchSchema = SchemaFactory.createForClass(Research);
