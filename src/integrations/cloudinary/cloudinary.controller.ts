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
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from './cloudinary.service';
import { DeleteMediaDto } from './dto/delete-media.dto';

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
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.cloudinaryService.uploadImage(file, folder);
  }

  @Delete()
  @HttpCode(200)
  remove(@Body() body: DeleteMediaDto) {
    return this.cloudinaryService.deleteImage(body.publicId);
  }
}
