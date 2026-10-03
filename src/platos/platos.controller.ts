import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlatosService } from './platos.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { FilterPlatoDto } from './dto/filter-plato.dto';
import { CloudinaryService } from '../integrations/cloudinary/cloudinary.service'; // Ajusta la ruta

@ApiTags('Platos')
@Controller('platos')
export class PlatosController {
  constructor(
    private readonly platosService: PlatosService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({ summary: 'Crear un nuevo plato con receta' })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPlatoDto: CreatePlatoDto,
  ) {
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'platos');
      createPlatoDto.imagen_url = uploadResult.secureUrl;
    }
    return this.platosService.create(createPlatoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener listado de platos paginados y filtrados por nombre' })
  findAll(@Query() filters: FilterPlatoDto) {
    return this.platosService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un plato por ID con su receta' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.platosService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('imagen'))
  @ApiOperation({ summary: 'Actualizar un plato existente y reestructurar receta' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updatePlatoDto: UpdatePlatoDto,
  ) {
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'platos');
      updatePlatoDto.imagen_url = uploadResult.secureUrl;
    }
    return this.platosService.update(id, updatePlatoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un plato por ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.platosService.remove(id);
  }
}