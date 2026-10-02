import { Controller, Get, Inject, Query } from '@nestjs/common';
// import { Roles } from '@src/auth/decorators/roles.decorator';
import { FindKardexQueryDto } from './dto/find-kardex-query.dto';
import { FindSuppliesQueryDto } from './dto/find-supplies-query.dto';
import { InventoryService } from './inventory.service';
import { Public } from '@src/auth/decorators/public.decorator';
@Controller('api/inventory')
// @Roles('almacenero', 'jefe', 'administrador')
@Public()
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
