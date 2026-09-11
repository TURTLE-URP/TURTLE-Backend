import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { WorkersController } from './workers.controller';
import { UsersService } from './users.service';
import { WorkersService } from './workers.service';

@Module({
  controllers: [UsersController, WorkersController],
  providers: [UsersService, WorkersService],
  exports: [UsersService, WorkersService],
})
export class UsersModule {}
