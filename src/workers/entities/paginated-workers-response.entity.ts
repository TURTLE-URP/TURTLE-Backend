import { WorkerResponseEntity } from './worker-response.entity';
import { PaginationMeta } from '@src/common/entities/pagination-meta.entity';
import { PaginatedResponse } from '@src/common/entities/paginated-response.entity';

export class PaginatedWorkersResponse extends PaginatedResponse(
  WorkerResponseEntity,
  'Lista de trabajadores de la página actual.',
) {}
