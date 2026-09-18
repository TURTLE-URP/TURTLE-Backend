import { Controller, HttpCode } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
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

@Controller('workers')
@ApiTags('Trabajadores')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  @HttpCode(201)
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

  @Patch(':id')
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
