import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Roles } from '@src/auth/decorators/roles.decorator';
import { FindKardexQueryDto } from './dto/find-kardex-query.dto';
import { FindSuppliesQueryDto } from './dto/find-supplies-query.dto';
import { InventoryService } from './inventory.service';

@Controller('api/inventory')
@Roles('almacenero', 'jefe', 'administrador')
export class InventoryController {
  constructor(
    @Inject(InventoryService) private readonly inventoryService: InventoryService,
  ) {}

  @Get('warehouses')
  listWarehouses() {
    return this.inventoryService.listWarehouses();
  }

  @Get('supplies')
  listSupplies(@Query() query: FindSuppliesQueryDto) {
    return this.inventoryService.listSupplies(query.almacenId);
  }

  @Get('kardex')
  listKardex(@Query() query: FindKardexQueryDto) {
    return this.inventoryService.listKardex(query);
  }
}
