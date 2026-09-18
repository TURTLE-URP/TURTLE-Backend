import { ApiProperty } from '@nestjs/swagger';

export class TokenEntity {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  access_token!: string;

  @ApiProperty({ example: 'bearer' })
  token_type!: string;
}
