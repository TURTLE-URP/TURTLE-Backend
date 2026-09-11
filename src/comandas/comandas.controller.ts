import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { ComandasService } from './comandas.service';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { CreateComandaItemOnlyDto } from './dto/create-comanda-item.dto';
import { CreateKitchenMovementDto } from './dto/create-kitchen-movement.dto';

@Controller('api/comandas')
export class ComandasController {
  constructor(private readonly comandasService: ComandasService) {}

  @Post()
  create(@Body() dto: CreateComandaDto) {
    return this.comandasService.create(dto);
  }

  @Get()
  findAll() {
    return this.comandasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comandasService.findOne(id);
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.comandasService.findByOrder(orderId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { ready?: boolean },
  ) {
    return this.comandasService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comandasService.remove(id);
  }

  @Post(':id/items')
  addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateComandaItemOnlyDto,
  ) {
    return this.comandasService.addItem(id, dto);
  }

  @Patch('items/:itemId')
  updateItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() data: { quantity?: number; notes?: string },
  ) {
    return this.comandasService.updateItem(itemId, data);
  }

  @Delete('items/:itemId')
  removeItem(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.comandasService.removeItem(itemId);
  }

  @Post('items/:itemId/movements')
  addMovement(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: CreateKitchenMovementDto,
  ) {
    return this.comandasService.addMovement(itemId, dto);
  }

  @Get('items/:itemId/movements')
  getMovements(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.comandasService.getMovements(itemId);
  }
}
