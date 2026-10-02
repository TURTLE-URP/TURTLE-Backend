import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  // ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// import { CurrentUserId } from '@src/auth/decorators/current-user.decorator';
import { Public } from '@src/auth/decorators/public.decorator';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { DeactivateTableDto } from './dto/deactivate-table.dto';
import { FindTablesManagementQueryDto } from './dto/find-tables-management-query.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { UpdateTableManagementDto } from './dto/update-table-management.dto';
import { UpdateTableOcupadoDto } from './dto/update-table-ocupado.dto';
import {
  PaginatedTableManagementResponse,
  TableManagementItem,
} from './entities/table-management-response.entity';

@Controller('api/tables')
@ApiTags('tables')
// Anfitrión: estos endpoints no exigen token. La pantalla de estado
// debe cargar aunque la sesión esté vencida.
// @ApiBearerAuth()
@Public()
export class TablesController {
  constructor(
    @Inject(TablesService) private readonly tablesService: TablesService,
  ) {}

  @Get('management')
  @ApiOperation({
    summary:
      'Lista mesas para administración, con búsqueda, piso, estado y resumen global.',
  })
  @ApiOkResponse({ type: PaginatedTableManagementResponse })
  findManagement(@Query() query: FindTablesManagementQueryDto) {
    return this.tablesService.findManagement(query);
  }

  @Get('management/:id')
  @ApiOperation({ summary: 'Obtiene una mesa por id, activa o inactiva.' })
  @ApiOkResponse({ type: TableManagementItem })
  @ApiNotFoundResponse({ description: 'Mesa no encontrada.' })
  findManagementById(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.findManagementById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una mesa. El código se genera como M-01.' })
  @ApiCreatedResponse({ type: TableManagementItem })
  @ApiConflictResponse({ description: 'El número o el código ya existen.' })
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  @Patch('management/:id')
  @ApiOperation({
    summary: 'Actualiza número, capacidad y piso. No modifica la ocupación.',
  })
  @ApiOkResponse({ type: TableManagementItem })
  @ApiNotFoundResponse({ description: 'Mesa no encontrada.' })
  @ApiConflictResponse({ description: 'El número de mesa ya existe.' })
  updateManagement(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableManagementDto,
  ) {
    return this.tablesService.updateManagement(id, dto);
  }

  @Patch('management/:id/baja')
  @ApiOperation({
    summary: 'Baja lógica. Se bloquea si la mesa está ocupada o tiene un pedido local abierto.',
  })
  @ApiOkResponse({ type: TableManagementItem })
  @ApiConflictResponse({ description: 'La mesa tiene un pedido abierto.' })
  deactivate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DeactivateTableDto,
  ) {
    return this.tablesService.deactivate(id, dto);
  }

  @Patch('management/:id/alta')
  @ApiOperation({ summary: 'Reactiva una mesa dada de baja.' })
  @ApiOkResponse({ type: TableManagementItem })
  reactivate(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.reactivate(id);
  }

  @Get()
  @ApiOperation({
    summary:
      'Lista mesas activas ordenadas por número, con el pedido local abierto más reciente.',
  })
  @ApiOkResponse({ description: 'Listado de mesas.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':tableNumber')
  @ApiOperation({ summary: 'Obtiene una mesa por número.' })
  @ApiOkResponse({ description: 'Mesa encontrada.' })
  @ApiNotFoundResponse({ description: 'Mesa no encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findByNumber(@Param('tableNumber', ParseIntPipe) tableNumber: number) {
    return this.tablesService.findByNumber(tableNumber);
  }

  @Patch(':tableNumber')
  @ApiOperation({
    summary: 'Actualiza número, capacidad, piso y ocupación de la mesa.',
  })
  @ApiOkResponse({ description: 'Mesa actualizada.' })
  @ApiNotFoundResponse({ description: 'Mesa no encontrada.' })
  @ApiConflictResponse({ description: 'El número de mesa ya existe.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  update(
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Body() dto: UpdateTableDto,
    // @CurrentUserId() updatedBy: number,
  ) {
    return this.tablesService.update(tableNumber, dto);
  }

  @Patch(':tableNumber/ocupado')
  @ApiOperation({ summary: 'Actualiza el flag de ocupación de la mesa.' })
  @ApiOkResponse({ description: 'Mesa actualizada.' })
  @ApiNotFoundResponse({ description: 'Mesa no encontrada.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  updateOcupado(
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Body() dto: UpdateTableOcupadoDto,
    // @CurrentUserId() updatedBy: number,
  ) {
    return this.tablesService.updateOcupado(tableNumber, dto);
  }
}
