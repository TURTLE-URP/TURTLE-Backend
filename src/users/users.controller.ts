import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrentUserId } from '@src/auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { CreateWorkerDto } from '@src/workers/dto/create-worker.dto';
import { CreateCustomerDto } from '@src/customers/dto/create-customer.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('worker')
  createWorker(@Body() createWorkerDto: CreateWorkerDto) {
    return this.usersService.createUsuarioTrabajador(createWorkerDto);
  }

  @Post('customer')
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.usersService.createUsuarioClienteDigital(createCustomerDto);
  }

  @Get()
  findAll(@Query() filters: FilterUsersDto) {
    return this.usersService.findAll(filters);
  }

  @Get('worker')
  findWorker(@Query('email') email: string) {
    return this.usersService.findWorker(email);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/toggle-status')
  toggleWorkerStatus(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.toggleWorkerStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() currentUserId: number,
  ) {
    return this.usersService.remove(id, currentUserId);
  }
}