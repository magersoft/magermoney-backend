import { PartialType } from '@nestjs/swagger';

import { CreateSavedFundDto } from './create-saved-fund.dto';

export class UpdateSavedFundDto extends PartialType(CreateSavedFundDto) {}
