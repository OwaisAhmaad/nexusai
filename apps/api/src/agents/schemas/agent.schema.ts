import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AgentDocument = Agent & Document;

@Schema({ timestamps: true })
export class Agent {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  model: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  icon: string;

  @Prop({ default: 'template', enum: ['template', 'user'] })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
