import { PartialType } from '@nestjs/swagger';
import { CreateStoreDTO } from './create-store.dto';

export class UpdateStoreDTO extends PartialType(CreateStoreDTO) {}
