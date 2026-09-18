import { Controller } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Trabajador } from '@prisma/client';
import { CreateWorkerResponse } from './entities/create-worker-response.entity';
import { WorkerResponseEntity } from './entities/worker-response.entity';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { CurrentUserId } from '@src/auth/decorators/current-user.decorator';
import { Roles } from '@src/auth/decorators/roles.decorator';

@Controller('workers')
@ApiTags('Trabajadores')
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
  create(@Body() dto: CreateWorkerDto) {
    return this.workersService.create(dto);
  }

  @Get()
  @Roles('administrador', 'jefe')
  findAll() {
    // return this.workersService.findAll();
  }

  @Get(':id')
  @Roles('administrador', 'jefe')
  findOne(@Param('id', ParseIntPipe) id: Trabajador['id']) {
    // return this.workersService.findOne(id);
  }

  @Patch(':id/activo')
  @Roles('administrador', 'jefe')
  @ApiOperation({
    summary:
      'Endpoint para activar/desactivar trabajadores, devuelve el trabajador actualizado.',
  })
  @ApiOkResponse({
    type: WorkerResponseEntity,
    description: 'Datos del trabajador actualizados correctamente.',
  })
  @ApiNotFoundResponse({ description: 'Trabajador no encontrado.' })
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
  @Roles('administrador', 'jefe')
  @ApiOkResponse({ description: 'Trabajador eliminado (baja lógica).' })
  @ApiNotFoundResponse({ description: 'Trabajador no encontrado.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserId() deletedBy: number,
  ) {
    return this.workersService.remove(id, deletedBy);
  }
}
