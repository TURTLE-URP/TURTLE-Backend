import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';

@Controller('api/menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  /*
  @Get()
  findAll(@Query('tag') tag?: string) {
    return this.menuItemsService.findAll(tag);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.findOne(id);
  }
  */
}
