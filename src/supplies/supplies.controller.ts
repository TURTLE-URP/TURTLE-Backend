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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { FindSuppliesQueryDto } from './dto/find-supplies-query.dto';
import { Public } from '@src/auth/decorators/public.decorator';

@ApiTags('Insumos')
@ApiBearerAuth('bearer')
// TODO: agregar los guards/roles del proyecto (ver src/auth y src/common), p. ej.:
// @UseGuards(JwtAuthGuard, RolesGuard)
@Public()
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
  findAll(@Query() query: FindSuppliesQueryDto) {
    return this.suppliesService.findAll(query);
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
