import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { pedido_tipo } from '@prisma/client';
import { CurrentUserId } from '@src/auth/decorators/current-user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('api/orders')
@ApiTags('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(
    @Inject(OrdersService) private readonly ordersService: OrdersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crea un pedido con sus detalles.' })
  @ApiCreatedResponse({ description: 'Pedido creado.' })
  @ApiNotFoundResponse({ description: 'Mesa, plato o cliente no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUserId() createdBy: number,
  ) {
    return this.ordersService.create(dto, createdBy);
  }

  @Get()
  @ApiOperation({ summary: 'Lista pedidos activos; filtra por tipo.' })
  @ApiQuery({ name: 'tipo', required: false, enum: pedido_tipo })
  @ApiOkResponse({ description: 'Listado de pedidos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findAll(@Query('tipo') tipo?: pedido_tipo) {
    return this.ordersService.findAll(tipo);
  }

  @Get('mesa/:tableNumber')
  @ApiOperation({ summary: 'Lista pedidos de una mesa.' })
  @ApiOkResponse({ description: 'Pedidos de la mesa.' })
  @ApiNotFoundResponse({ description: 'Mesa no encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findByTable(@Param('tableNumber', ParseIntPipe) tableNumber: number) {
    return this.ordersService.findByTable(tableNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un pedido por id.' })
  @ApiOkResponse({ description: 'Pedido encontrado.' })
  @ApiNotFoundResponse({ description: 'Pedido no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
}
