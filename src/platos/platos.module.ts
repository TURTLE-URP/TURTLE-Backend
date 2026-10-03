import { Module } from '@nestjs/common';
import { PlatosService } from './platos.service';
import { PlatosController } from './platos.controller';
import { CloudinaryModule } from '@src/integrations/cloudinary/cloudinary.module'; // Ajusta la ruta si difiere

@Module({
  imports: [CloudinaryModule], // <-- OBLIGATORIO: Debe estar aquí
  controllers: [PlatosController],
  providers: [PlatosService],
  exports: [PlatosService],
})
export class PlatosModule {}