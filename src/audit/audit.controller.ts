import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Query,
  Body,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { audit_action_type } from '@src/generated/prisma/client';
import { CreateAuditDto } from './dto/create-audit.dto';

@Controller('api/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  create(@Body() dto: CreateAuditDto) {
    return this.auditService.create(dto);
  }

  @Get()
  findAll(
    @Query('action') action?: audit_action_type,
    @Query('table') affectedTable?: string,
    @Query('userId') userId?: string,
  ) {
    return this.auditService.findAll({
      action,
      affectedTable,
      userId: userId ? Number(userId) : undefined,
    });
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.auditService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditService.findOne(id);
  }
}
