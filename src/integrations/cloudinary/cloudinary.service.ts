import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as CloudinaryV2,
} from 'cloudinary';
import { CLOUDINARY } from './cloudinary.constants';
import { UploadedMedia } from './entities/uploaded-media.entity';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof CloudinaryV2,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadedMedia> {
    this.assertCredentialsConfigured();
    this.assertValidImage(file);

    const targetFolder =
      folder?.trim() ||
      this.configService.get<string>('CLOUDINARY_FOLDER') ||
      'turtle';

    try {
      const result = await this.uploadBuffer(file.buffer, targetFolder);
      return new UploadedMedia(
        result.public_id,
        result.url,
        result.secure_url,
        result.format ?? null,
        result.bytes ?? null,
        result.width ?? null,
        result.height ?? null,
        result.resource_type,
        result.folder ?? targetFolder,
      );
    } catch {
      throw new ServiceUnavailableException(
        'Cloudinary provider is unavailable right now',
      );
    }
  }

  async deleteImage(publicId: string): Promise<{ publicId: string; result: string }> {
    this.assertCredentialsConfigured();

    const id = publicId?.trim();
    if (!id) {
      throw new BadRequestException('publicId is required');
    }

    try {
      const result = await this.cloudinary.uploader.destroy(id, {
        resource_type: 'image',
      });

      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new ServiceUnavailableException(
          'Cloudinary could not delete the asset',
        );
      }

      return { publicId: id, result: result.result };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ServiceUnavailableException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new ServiceUnavailableException(
        'Cloudinary provider is unavailable right now',
      );
    }
  }

  private assertCredentialsConfigured(): void {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new UnauthorizedException(
        'Cloudinary credentials are not configured',
      );
    }
  }

  private assertValidImage(file: Express.Multer.File | undefined): void {
    if (!file?.buffer?.length) {
      throw new BadRequestException('file is required');
    }

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Only jpeg, png, webp and gif images are allowed',
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      throw new BadRequestException('Image exceeds the 5MB limit');
    }
  }

  private uploadBuffer(
    buffer: Buffer,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error || !result) {
            reject(error ?? new Error('Empty Cloudinary upload result'));
            return;
          }
          resolve(result);
        },
      );

      stream.end(buffer);
    });
  }
}
