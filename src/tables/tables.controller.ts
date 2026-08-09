import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { TablesService } from './tables.service';

@Controller('api/tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':tableNumber')
  findByNumber(@Param('tableNumber', ParseIntPipe) tableNumber: number) {
    return this.tablesService.findByNumber(tableNumber);
  }

  @Patch(':tableNumber/status')
  updateStatus(
    @Param('tableNumber', ParseIntPipe) tableNumber: number,
    @Body('status') status: 'available' | 'occupied',
  ) {
    return this.tablesService.updateStatus(tableNumber, status);
  }
}
