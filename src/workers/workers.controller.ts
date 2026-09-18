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
  findAll() {
    // return this.workersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: Trabajador['id']) {
    // return this.workersService.findOne(id);
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workersService.remove(id);
  }
}
