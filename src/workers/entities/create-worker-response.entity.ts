import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { WorkerResponseEntity } from './worker-response.entity';

/**TODO: Create an integration with a SES service in order to avoid sending the generated password in the response and instead sending it via email directly to the worker*/
export class CreateWorkerResponse extends WorkerResponseEntity {
  @ApiProperty({
    description: 'Clave generada, solo dev en Swagger. En prod va por correo.',
  })
  @Expose()
  plainPassword!: string;
}
