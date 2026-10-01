import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PlatosService } from './platos.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { platos_categoria } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Platillos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('platos')
export class PlatosController {
  constructor(private readonly platosService: PlatosService) {}

  @Post()
@ApiOperation({ summary: 'Crear un nuevo platillo' })
create(@Body() createPlatoDto: CreatePlatoDto, @Request() req) {
  const userId = Number(req.user?.id || req.user?.sub || req.user?.id_usuario);
  return this.platosService.create(createPlatoDto, userId);
}

  @Get()
  @ApiOperation({ summary: 'Listar todos los platillos activos' })
  @ApiQuery({ name: 'categoria', enum: platos_categoria, required: false })
  findAll(@Query('categoria') categoria?: platos_categoria) {
    return this.platosService.findAll(categoria);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un platillo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.platosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un platillo' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlatoDto: UpdatePlatoDto,
    @Request() req,
  ) {
    const userId = req.user?.id || req.user?.sub || req.user?.id_usuario;
    return this.platosService.update(id, updatePlatoDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un platillo (Soft Delete)' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user?.id || req.user?.sub || req.user?.id_usuario;
    return this.platosService.remove(id, userId);
  }
}