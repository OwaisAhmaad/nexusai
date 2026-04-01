import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { ResearchRepository } from './repositories/research.repository';
import { Research, ResearchSchema } from './schemas/research.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Research.name, schema: ResearchSchema }]),
  ],
  controllers: [ResearchController],
  providers: [ResearchService, ResearchRepository],
})
export class ResearchModule {}
