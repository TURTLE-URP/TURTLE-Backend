import { PaginationMeta } from '@src/common/entities/pagination-meta.entity';
import { PaginatedResponse } from '@src/common/entities/paginated-response.entity';
import { SupplyResponseEntity } from './supply-response.entity';

export class PaginatedSuppliesResponse extends PaginatedResponse(
  SupplyResponseEntity,
  'Lista de insumos de la página actual.',
) {}
