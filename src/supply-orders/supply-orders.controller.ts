import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { orden_estado } from '@prisma/client';
import { CurrentUserId } from '@src/auth/decorators/current-user.decorator';
import { SupplyOrdersService } from './supply-orders.service';
import {
  CalculateByDishesDto,
  CreateSupplyOrderDto,
} from './dto/create-supply-order.dto';

@Controller('supply-orders')
@ApiTags('supply-orders')
@ApiBearerAuth()
export class SupplyOrdersController {
  constructor(
    @Inject(SupplyOrdersService)
    private readonly supplyOrdersService: SupplyOrdersService,
  ) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Métricas de abastecimiento del mes.' })
  @ApiOkResponse({ description: 'Métricas calculadas.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  getMetrics() {
    return this.supplyOrdersService.getMetrics();
  }

  @Get('dishes')
  @ApiOperation({ summary: 'Platos activos con conteo de ingredientes.' })
  @ApiOkResponse({ description: 'Listado de platos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  getDishes() {
    return this.supplyOrdersService.getDishes();
  }

  @Get('free-supplies')
  @ApiOperation({ summary: 'Insumos con opciones de proveedor.' })
  @ApiOkResponse({ description: 'Catálogo de insumos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  getFreeSupplyItems() {
    return this.supplyOrdersService.getFreeSupplyItems();
  }

  @Get('calculate-by-shortage')
  @ApiOperation({
    summary: 'Insumos bajo stock mínimo agregado por almacén.',
  })
  @ApiOkResponse({ description: 'Insumos en falta.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  calculateByShortage() {
    return this.supplyOrdersService.calculateByShortage();
  }

  @Get()
  @ApiOperation({ summary: 'Lista órdenes de abasto.' })
  @ApiQuery({ name: 'estado', required: false, enum: orden_estado })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkResponse({ description: 'Listado de órdenes.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findAll(
    @Query('estado') estado?: orden_estado,
    @Query('search') search?: string,
  ) {
    return this.supplyOrdersService.findAll(estado, search);
  }

  @Post('calculate-by-dishes')
  @ApiOperation({
    summary: 'Calcula insumos necesarios según demanda de platos.',
  })
  @ApiOkResponse({ description: 'Necesidad de insumos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  calculateByDishes(@Body() dto: CalculateByDishesDto) {
    return this.supplyOrdersService.calculateByDishes(dto.items);
  }

  @Post()
  @ApiOperation({
    summary: 'Emite órdenes de abasto agrupadas por proveedor.',
  })
  @ApiCreatedResponse({ description: 'Órdenes creadas.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  createOrders(
    @Body() dto: CreateSupplyOrderDto,
    @CurrentUserId() actorId: number,
  ) {
    return this.supplyOrdersService.createOrders(dto, actorId);
  }
}
