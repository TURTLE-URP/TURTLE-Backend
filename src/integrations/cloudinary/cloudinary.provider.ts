import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY, CLOUDINARY_ENV_KEYS } from './cloudinary.constants';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const [cloudName, apiKey, apiSecret] = CLOUDINARY_ENV_KEYS.map(
      (key) => configService.get<string>(key)?.trim() || undefined,
    );

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return cloudinary;
  },
};
