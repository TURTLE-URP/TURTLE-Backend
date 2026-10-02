import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@src/common/dto/pagination-query.dto';

export class FindSuppliersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Busca por nombre, código o RUC.',
    example: 'PRO-001',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;
}