import { PaginationMeta } from '@src/common/entities/pagination-meta.entity';
import { PaginatedResponse } from '@src/common/entities/paginated-response.entity';
import { StoreResponseEntity } from './store-response.entity';

export class PaginatedStoresResponse extends PaginatedResponse(
  StoreResponseEntity,
  'Lista de almacenes de la página actual.',
) {}
