import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { CLOUDINARY } from './cloudinary.constants';

describe('CloudinaryService', () => {
  const uploadStream = jest.fn();
  const destroy = jest.fn();

  const cloudinary = {
    uploader: {
      upload_stream: uploadStream,
      destroy,
    },
  };

  const configService = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        CLOUDINARY_CLOUD_NAME: 'demo',
        CLOUDINARY_API_KEY: 'key',
        CLOUDINARY_API_SECRET: 'secret',
        CLOUDINARY_FOLDER: 'turtle',
      };
      return values[key];
    }),
  } as unknown as ConfigService;

  let service: CloudinaryService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CloudinaryService(cloudinary as never, configService);
  });

  it('rejects missing file', async () => {
    await expect(
      service.uploadImage(undefined as unknown as Express.Multer.File),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects missing credentials', async () => {
    const emptyConfig = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService;
    const insecure = new CloudinaryService(cloudinary as never, emptyConfig);

    await expect(
      insecure.uploadImage({
        buffer: Buffer.from('x'),
        mimetype: 'image/png',
        size: 1,
      } as Express.Multer.File),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('uploads a valid image buffer', async () => {
    uploadStream.mockImplementation((_options, callback) => {
      callback(undefined, {
        public_id: 'turtle/demo',
        url: 'http://res.cloudinary.com/demo/image/upload/turtle/demo.png',
        secure_url:
          'https://res.cloudinary.com/demo/image/upload/turtle/demo.png',
        format: 'png',
        bytes: 12,
        width: 10,
        height: 10,
        resource_type: 'image',
        folder: 'turtle',
      });
      return { end: jest.fn() };
    });

    const result = await service.uploadImage({
      buffer: Buffer.from('fake-image'),
      mimetype: 'image/png',
      size: 12,
    } as Express.Multer.File);

    expect(result.publicId).toBe('turtle/demo');
    expect(result.secureUrl).toContain('https://');
    expect(CLOUDINARY).toBe('CLOUDINARY');
  });

  it('deletes by publicId', async () => {
    destroy.mockResolvedValue({ result: 'ok' });

    const result = await service.deleteImage('turtle/demo');

    expect(result).toEqual({ publicId: 'turtle/demo', result: 'ok' });
    expect(destroy).toHaveBeenCalledWith('turtle/demo', {
      resource_type: 'image',
    });
  });
});
