import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ComandasService } from './comandas.service';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { CreateComandaItemOnlyDto } from './dto/create-comanda-item.dto';
import { CreateKitchenMovementDto } from './dto/create-kitchen-movement.dto';
import { UpdateComandaDto } from './dto/update-comanda.dto';
import { UpdateComandaItemDto } from './dto/update-comanda-item.dto';

@Controller('api/comandas')
@ApiTags('comandas')
@ApiBearerAuth()
export class ComandasController {
  constructor(
    @Inject(ComandasService)
    private readonly comandasService: ComandasService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crea una comanda con sus ítems.' })
  @ApiCreatedResponse({ description: 'Comanda creada.' })
  @ApiNotFoundResponse({ description: 'Pedido o plato no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  create(@Body() dto: CreateComandaDto) {
    return this.comandasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas las comandas.' })
  @ApiOkResponse({ description: 'Listado de comandas.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findAll() {
    return this.comandasService.findAll();
  }

  @Get('pedido/:pedidoId')
  @ApiOperation({ summary: 'Lista comandas de un pedido.' })
  @ApiOkResponse({ description: 'Comandas del pedido.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findByPedido(@Param('pedidoId', ParseIntPipe) pedidoId: number) {
    return this.comandasService.findByPedido(pedidoId);
  }

  @Get('items/:itemId/movements')
  @ApiOperation({ summary: 'Lista movimientos de cocina de un ítem.' })
  @ApiOkResponse({ description: 'Movimientos del ítem.' })
  @ApiNotFoundResponse({ description: 'Ítem de comanda no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  getMovements(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.comandasService.getMovements(itemId);
  }

  @Post('items/:itemId/movements')
  @ApiOperation({ summary: 'Registra un movimiento de cocina.' })
  @ApiCreatedResponse({ description: 'Movimiento creado.' })
  @ApiNotFoundResponse({ description: 'Ítem de comanda no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  addMovement(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: CreateKitchenMovementDto,
  ) {
    return this.comandasService.addMovement(itemId, dto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Actualiza cantidad o notas de un ítem.' })
  @ApiOkResponse({ description: 'Ítem actualizado.' })
  @ApiNotFoundResponse({ description: 'Ítem no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  updateItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateComandaItemDto,
  ) {
    return this.comandasService.updateItem(itemId, dto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Elimina un ítem de comanda.' })
  @ApiOkResponse({ description: 'Ítem eliminado.' })
  @ApiNotFoundResponse({ description: 'Ítem no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  removeItem(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.comandasService.removeItem(itemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una comanda por id.' })
  @ApiOkResponse({ description: 'Comanda encontrada.' })
  @ApiNotFoundResponse({ description: 'Comanda no encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comandasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza el estado listo de la comanda.' })
  @ApiOkResponse({ description: 'Comanda actualizada.' })
  @ApiNotFoundResponse({ description: 'Comanda no encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateComandaDto,
  ) {
    return this.comandasService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una comanda.' })
  @ApiOkResponse({ description: 'Comanda eliminada.' })
  @ApiNotFoundResponse({ description: 'Comanda no encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comandasService.remove(id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Agrega un ítem a la comanda.' })
  @ApiCreatedResponse({ description: 'Ítem agregado.' })
  @ApiNotFoundResponse({ description: 'Comanda o plato no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateComandaItemOnlyDto,
  ) {
    return this.comandasService.addItem(id, dto);
  }
}
