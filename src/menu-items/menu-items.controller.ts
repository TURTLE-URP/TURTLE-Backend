import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { platos_categoria } from '@prisma/client';
import { MenuItemsService } from './menu-items.service';

@Controller('api/menu-items')
@ApiTags('menu-items')
@ApiBearerAuth()
export class MenuItemsController {
  constructor(
    @Inject(MenuItemsService)
    private readonly menuItemsService: MenuItemsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lista platos activos; filtra opcionalmente por categoría.',
  })
  @ApiQuery({
    name: 'categoria',
    required: false,
    enum: platos_categoria,
  })
  @ApiOkResponse({ description: 'Listado de platos.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findAll(@Query('categoria') categoria?: platos_categoria) {
    return this.menuItemsService.findAll(categoria);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un plato con sus ingredientes.' })
  @ApiOkResponse({ description: 'Plato encontrado.' })
  @ApiNotFoundResponse({ description: 'Plato no encontrado.' })
  @ApiUnauthorizedResponse({ description: 'Token ausente o inválido.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.findOne(id);
  }
}
