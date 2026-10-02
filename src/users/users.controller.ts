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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
// import { CurrentUserId } from '@src/auth/decorators/current-user.decorator';
import { Public } from '@src/auth/decorators/public.decorator';
import { UsersService } from './users.service';
import { CreateWorkerDto } from '@src/workers/dto/create-worker.dto';
import { CreateCustomerDto } from '@src/customers/dto/create-customer.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';

// Temporal: sin login real el front manda un token de demo y el JWT lo rechaza.
// @ApiBearerAuth()
@ApiTags('Usuarios')
@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('worker')
  @ApiOperation({ summary: 'Crear usuario de tipo trabajador' })
  createWorker(@Body() createWorkerDto: CreateWorkerDto) {
    return this.usersService.createUsuarioTrabajador(createWorkerDto);
  }

  @Post('customer')
  @ApiOperation({ summary: 'Crear usuario de tipo cliente digital' })
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.usersService.createUsuarioClienteDigital(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener usuarios paginados con filtros (búsqueda y tipo)' })
  findAll(@Query() filters: FilterUsersDto) {
    return this.usersService.findAll(filters);
  }

  @Get('worker')
  @ApiOperation({ summary: 'Buscar trabajador por correo electrónico' })
  findWorker(@Query('email') email: string) {
    return this.usersService.findWorker(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener información detallada de un usuario por ID' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Activar o desactivar un trabajador' })
  toggleWorkerStatus(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.toggleWorkerStatus(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar usuario (Soft Delete)' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    // @CurrentUserId() currentUserId: number,
  ) {
    // Sin sesión no hay usuario que firme el borrado.
    return this.usersService.remove(id, null);
  }
}