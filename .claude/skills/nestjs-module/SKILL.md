---
name: nestjs-module
description: >
  Generate NestJS module with repository pattern for NexusAI backend.
  Use when creating any backend module, endpoint, service, or repository.
---

## 6 Files per Module
schema → repo interface → repo impl → dto → service → controller

## Schema Template
```typescript
@Schema({ timestamps: true })
export class Entity {
  @Prop({ required: true }) field: string;
  @Prop({ default: 'active' }) status: string;
}
```

## Repository Interface
```typescript
interface IEntityRepository {
  findById(id: string): Promise<Entity | null>;
  findAll(query: QueryDto): Promise<[Entity[], number]>;
  create(data: CreateDto): Promise<Entity>;
  update(id: string, data: UpdateDto): Promise<Entity>;
  softDelete(id: string): Promise<void>;
}
```

## Service Pattern
- Inject repository via constructor
- Throw NotFoundException if entity not found
- Never query MongoDB directly in service

## Controller Pattern
- @ApiTags() + @ApiResponse() on every endpoint
- @UseGuards(JwtAuthGuard) on protected routes
- Route prefix: /api/v1/resource-name

## DTO Rules
- class-validator decorators on ALL fields
- Separate Create/Update/Query DTOs
- @ApiProperty() on every field
