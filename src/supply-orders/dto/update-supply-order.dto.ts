import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplyOrderDto } from './create-supply-order.dto';

export class UpdateSupplyOrderDto extends PartialType(CreateSupplyOrderDto) {}
