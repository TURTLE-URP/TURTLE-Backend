import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUserId } from '@src/auth/decorators/current-user.decorator';
import { Roles } from '@src/auth/decorators/roles.decorator';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierEntity } from './entities/supplier.entity';
import {FindSuppliersQueryDto} from './dto/find-suppliers-query.dto';
@ApiTags('Proveedores')
@ApiBearerAuth()
@Roles('administrador', 'jefe')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: 'Registra un proveedor, devuelve el proveedor creado.' })
  @ApiCreatedResponse({ type: SupplierEntity, description: 'Proveedor creado.' })
  @ApiBadRequestResponse({ description: 'DTO inválido.' })
  @ApiConflictResponse({ description: 'Código o RUC ya registrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  create(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista los proveedores activos.' })
  @ApiOkResponse({ type: [SupplierEntity], description: 'Lista de proveedores.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  findAll(@Query() query: FindSuppliersQueryDto) {
    return this.suppliersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un proveedor por su id.' })
  @ApiOkResponse({ type: SupplierEntity, description: 'Proveedor encontrado.' })
  @ApiNotFoundResponse({ description: 'Proveedor no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un proveedor, devuelve el proveedor actualizado.' })
  @ApiOkResponse({ type: SupplierEntity, description: 'Proveedor actualizado.' })
  @ApiBadRequestResponse({ description: 'DTO inválido.' })
  @ApiNotFoundResponse({ description: 'Proveedor no encontrado.' })
  @ApiConflictResponse({ description: 'Código o RUC ya registrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierDto,
    @CurrentUserId() userId: number,
  ) {
    return this.suppliersService.update(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina (borrado lógico) un proveedor.' })
  @ApiOkResponse({ type: SupplierEntity, description: 'Proveedor eliminado.' })
  @ApiNotFoundResponse({ description: 'Proveedor no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUserId() userId: number) {
    return this.suppliersService.remove(id, userId);
  }
}