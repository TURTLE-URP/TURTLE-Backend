import { PartialType } from '@nestjs/mapped-types';
import { CreateComandaItemOnlyDto } from './create-comanda-item.dto';

export class UpdateComandaItemDto extends PartialType(
  CreateComandaItemOnlyDto,
) {}
