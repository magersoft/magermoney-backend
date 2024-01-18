import { PickType } from '@nestjs/swagger';

import { SavedFundEntity } from '@/api/saved-funds/entities/saved-fund.entity';

export class SavedFundRelationEntity extends PickType(SavedFundEntity, ['source', 'color']) {}
