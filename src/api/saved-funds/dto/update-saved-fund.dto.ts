import { PartialType, PickType } from '@nestjs/swagger';

import { CreateSavedFundDto } from './create-saved-fund.dto';

export class UpdateSavedFundDto extends PickType(PartialType(CreateSavedFundDto), ['amount', 'source', 'order']) {}
