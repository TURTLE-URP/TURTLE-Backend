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
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';

@ApiTags('Insumos')
@ApiBearerAuth('bearer')
// TODO: agregar los guards/roles del proyecto (ver src/auth y src/common), p. ej.:
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear insumo' })
  create(@Body() dto: CreateSupplyDto) {
    return this.suppliesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar insumos (paginado, 10 por página)' })
  @ApiQuery({ name: 'nombre', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  findAll(@Query('nombre') nombre?: string, @Query('page') page?: string) {
    return this.suppliesService.findAll(
      nombre,
      page ? Math.max(1, +page || 1) : 1,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de un insumo' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar insumo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupplyDto) {
    return this.suppliesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar insumo (borrado lógico)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suppliesService.remove(id);
  }
}
