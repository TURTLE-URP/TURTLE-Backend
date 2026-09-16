import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMediaDto {
  @ApiProperty({
    description: 'Public ID del asset en Cloudinary',
    example: 'turtle/abc123',
  })
  @IsString()
  @IsNotEmpty()
  publicId: string;

  constructor(publicId: DeleteMediaDto['publicId']) {
    this.publicId = publicId;
  }
}
