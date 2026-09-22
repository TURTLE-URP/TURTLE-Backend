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
import { pago_medio_pago } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  CreatePaymentDetailOnlyDto,
  UpdatePaymentDetailDto,
} from './dto/payment-detail.dto';

@Controller('api/payments')
@ApiTags('payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(
    @Inject(PaymentsService)
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registra un pago de cliente con detalles.' })
  @ApiCreatedResponse({ description: 'Pago creado.' })
  @ApiNotFoundResponse({ description: 'Pedido o plato no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista pagos; filtra opcionalmente por medio.' })
  @ApiQuery({ name: 'medioPago', required: false, enum: pago_medio_pago })
  @ApiOkResponse({ description: 'Listado de pagos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findAll(@Query('medioPago') medioPago?: pago_medio_pago) {
    return this.paymentsService.findAll(medioPago);
  }

  @Get('pedido/:pedidoId')
  @ApiOperation({ summary: 'Lista pagos de un pedido.' })
  @ApiOkResponse({ description: 'Pagos del pedido.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findByPedido(@Param('pedidoId', ParseIntPipe) pedidoId: number) {
    return this.paymentsService.findByPedido(pedidoId);
  }

  @Patch('details/:detailId')
  @ApiOperation({ summary: 'Actualiza un detalle de pago.' })
  @ApiOkResponse({ description: 'Detalle actualizado.' })
  @ApiNotFoundResponse({ description: 'Detalle no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  updateDetail(
    @Param('detailId', ParseIntPipe) detailId: number,
    @Body() dto: UpdatePaymentDetailDto,
  ) {
    return this.paymentsService.updateDetail(detailId, dto);
  }

  @Delete('details/:detailId')
  @ApiOperation({ summary: 'Elimina un detalle de pago.' })
  @ApiOkResponse({ description: 'Detalle eliminado.' })
  @ApiNotFoundResponse({ description: 'Detalle no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  removeDetail(@Param('detailId', ParseIntPipe) detailId: number) {
    return this.paymentsService.removeDetail(detailId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un pago por id.' })
  @ApiOkResponse({ description: 'Pago encontrado.' })
  @ApiNotFoundResponse({ description: 'Pago no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza medio, monto o comprobante.' })
  @ApiOkResponse({ description: 'Pago actualizado.' })
  @ApiNotFoundResponse({ description: 'Pago no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un pago y sus detalles.' })
  @ApiOkResponse({ description: 'Pago eliminado.' })
  @ApiNotFoundResponse({ description: 'Pago no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }

  @Post(':id/details')
  @ApiOperation({ summary: 'Agrega un detalle a un pago.' })
  @ApiCreatedResponse({ description: 'Detalle agregado.' })
  @ApiNotFoundResponse({ description: 'Pago o plato no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  addDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePaymentDetailOnlyDto,
  ) {
    return this.paymentsService.addDetail(id, dto);
  }
}
