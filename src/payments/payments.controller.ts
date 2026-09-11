import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { payment_method_type } from '@src/generated/prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  CreatePaymentDetailOnlyDto,
  UpdatePaymentDetailDto,
} from './dto/payment-detail.dto';

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Get()
  findAll(@Query('method') method?: payment_method_type) {
    return this.paymentsService.findAll(method);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Get('order/:orderId')
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.paymentsService.findByOrder(orderId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    dto: {
      paymentMethod?: payment_method_type;
      amount?: number;
      receiptUrl?: string;
    },
  ) {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }

  @Post(':id/details')
  addDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePaymentDetailOnlyDto,
  ) {
    return this.paymentsService.addDetail(id, dto);
  }

  @Patch('details/:detailId')
  updateDetail(
    @Param('detailId', ParseIntPipe) detailId: number,
    @Body() dto: UpdatePaymentDetailDto,
  ) {
    return this.paymentsService.updateDetail(detailId, dto);
  }

  @Delete('details/:detailId')
  removeDetail(@Param('detailId', ParseIntPipe) detailId: number) {
    return this.paymentsService.removeDetail(detailId);
  }
}
