import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@src/common/dto/pagination-query.dto';

export class FindStoresQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Busca por nombre o código.',
    example: 'ALM-001',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;
}