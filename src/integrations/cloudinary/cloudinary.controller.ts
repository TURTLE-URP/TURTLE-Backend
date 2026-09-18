import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from './cloudinary.service';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { UploadedMedia } from './entities/uploaded-media.entity';
import { Public } from '@src/auth/decorators/public.decorator';

@ApiTags('media')
@Public()
@Controller('media')
export class CloudinaryController {
  constructor(
    @Inject(CloudinaryService)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Sube una imagen a Cloudinary (máx. 5MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiQuery({ name: 'folder', required: false, example: 'turtle' })
  @ApiOkResponse({ type: UploadedMedia })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.cloudinaryService.uploadImage(file, folder);
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Borra una imagen de Cloudinary por publicId' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        publicId: { type: 'string', example: 'turtle/abc123' },
        result: { type: 'string', example: 'ok' },
      },
    },
  })
  remove(@Body() body: DeleteMediaDto) {
    return this.cloudinaryService.deleteImage(body.publicId);
  }
}
