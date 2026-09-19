import { Controller } from '@nestjs/common';
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
import {
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  Query,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { FindWorkersQueryDto } from './dto/find-workers-query.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Trabajador } from '@prisma/client';
import { CreateWorkerResponse } from './entities/create-worker-response.entity';
import { PaginatedWorkersResponse } from './entities/paginated-workers-response.entity';
import { WorkerResponseEntity } from './entities/worker-response.entity';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { CurrentUserId } from '@src/auth/decorators/current-user.decorator';
import { Roles } from '@src/auth/decorators/roles.decorator';

@Controller('workers')
@ApiTags('Trabajadores')
@ApiBearerAuth()
@Roles('administrador', 'jefe')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  @ApiOperation({
    summary:
      'Endpoint para registrar trabajadores, devuelve el trabajador creado.',
  })
  @ApiCreatedResponse({
    type: CreateWorkerResponse,
    description: 'Trabajador creado.',
  })
  @ApiBadRequestResponse({
    description: 'DTO inválido.',
  })
  @ApiConflictResponse({
    description: 'Correo ya registrado en el sistema.',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  create(@Body() dto: CreateWorkerDto) {
    return this.workersService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista trabajadores con paginación y filtros.',
  })
  @ApiOkResponse({
    type: PaginatedWorkersResponse,
    description: 'Página de trabajadores.',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  findAll(@Query() query: FindWorkersQueryDto) {
    return this.workersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtiene un trabajador por id.',
  })
  @ApiOkResponse({
    type: WorkerResponseEntity,
    description: 'Trabajador encontrado.',
  })
  @ApiNotFoundResponse({ description: 'Trabajador no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  findOne(@Param('id', ParseIntPipe) id: Trabajador['id']) {
    return this.workersService.findOne(id);
  }

  @Patch(':id/activo')
  @ApiOperation({
    summary:
      'Endpoint para activar/desactivar trabajadores, devuelve el trabajador actualizado.',
  })
  @ApiOkResponse({
    type: WorkerResponseEntity,
    description: 'Datos del trabajador actualizados correctamente.',
  })
  @ApiNotFoundResponse({ description: 'Trabajador no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  updateActivo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivoDto,
  ) {
    return this.workersService.updateActivo(id, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary:
      'Endpoint para actualizar trabajadores, devuelve el trabajador actualizado.',
  })
  @ApiOkResponse({
    type: WorkerResponseEntity,
    description: 'Datos del trabajador actualizados correctamente.',
  })
  @ApiNotFoundResponse({ description: 'Trabajador no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  update(
    @Param('id', ParseIntPipe) id: Trabajador['id'],
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.workersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary:
      'Endpoint para eliminar trabajadores (baja lógica), devuelve confirmación.',
  })
  @ApiOkResponse({ description: 'Trabajador eliminado (baja lógica).' })
  @ApiNotFoundResponse({ description: 'Trabajador no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  @ApiForbiddenResponse({ description: 'Requiere rol administrador o jefe.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() deletedBy: number,
  ) {
    return this.workersService.remove(id, deletedBy);
  }
}
