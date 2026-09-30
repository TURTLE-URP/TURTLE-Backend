import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  //   ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDTO } from './dto/create-store.dto';
import { UpdateStoreDTO } from './dto/update-store.dto';
import { FindStoresQueryDto } from './dto/find-stores-query.dto';
import { FindStoresOptionsQueryDto } from './dto/find-stores-options-query.dto';
import { StoreResponseEntity } from './entities/store-response.entity';
import { PaginatedStoresResponse } from './entities/paginated-stores-response.entity';
import { PaginatedStoreOptionsResponse } from './entities/paginated-store-options-response.entity';
import { StoreDeletedEntity } from './entities/store-deleted-response.entity';
import { Public } from '@src/auth/decorators/public.decorator';
@Controller('stores')
@ApiTags('Almacenes')
// @ApiBearerAuth()
@Public()
export class StoresController {
  constructor(
    @Inject(StoresService) private readonly storesService: StoresService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registra un almacén, devuelve el almacén creado.',
  })
  @ApiCreatedResponse({
    type: StoreResponseEntity,
    description: 'Almacén creado.',
  })
  @ApiBadRequestResponse({ description: 'DTO inválido.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  create(@Body() dto: CreateStoreDTO) {
    return this.storesService.create(dto);
  }

  @Get('options')
  @ApiOperation({
    summary:
      'Lista ligera de almacenes para combobox con infinite scroll (cursor).',
  })
  @ApiOkResponse({
    type: PaginatedStoreOptionsResponse,
    description: 'Opciones de almacenes con nextCursor/hasMore.',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findForOptions(@Query() query: FindStoresOptionsQueryDto) {
    return this.storesService.findForOptions(query);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista almacenes con paginación y búsqueda por nombre o código.',
  })
  @ApiOkResponse({
    type: PaginatedStoresResponse,
    description: 'Página de almacenes.',
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findAll(@Query() query: FindStoresQueryDto) {
    return this.storesService.findAll(query);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualiza un almacén, devuelve el almacén actualizado.',
  })
  @ApiOkResponse({
    type: StoreResponseEntity,
    description: 'Datos del almacén actualizados correctamente.',
  })
  @ApiBadRequestResponse({ description: 'DTO inválido.' })
  @ApiNotFoundResponse({ description: 'Almacén no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStoreDTO) {
    return this.storesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Elimina un almacén (baja lógica), devuelve confirmación.',
  })
  @ApiOkResponse({
    type: StoreDeletedEntity,
    description: 'Almacén eliminado (baja lógica).',
  })
  @ApiNotFoundResponse({ description: 'Almacén no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storesService.delete(id);
  }
}
