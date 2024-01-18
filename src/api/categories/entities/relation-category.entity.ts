import { PickType } from '@nestjs/swagger';

import { CategoryEntity } from '@/api/categories/entities/category.entity';

export class RelationCategoryEntity extends PickType(CategoryEntity, ['name']) {}
