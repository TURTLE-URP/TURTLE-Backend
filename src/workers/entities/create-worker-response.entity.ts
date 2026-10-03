import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { WorkerResponseEntity } from './worker-response.entity';

/** La contraseña también se envía por Gmail al correo del trabajador. Se mantiene en la respuesta para que el admin pueda entregarla si el envío falla. */
export class CreateWorkerResponse extends WorkerResponseEntity {
  @ApiProperty({
    description: 'Clave generada, solo dev en Swagger. En prod va por correo.',
  })
  @Expose()
  plainPassword!: string;
}
