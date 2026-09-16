import { Module } from '@nestjs/common';
import { RucModule } from './ruc/ruc.module';
import { DniModule } from './dni/dni.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [RucModule, DniModule, CloudinaryModule],
  exports: [RucModule, DniModule, CloudinaryModule],
})
export class IntegrationsModule {}
