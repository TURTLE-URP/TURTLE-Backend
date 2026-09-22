import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { UsersModule } from '@src/users/users.module';

@Module({
  providers: [WorkersService],
  controllers: [WorkersController],
  imports: [UsersModule],
})
export class WorkersModule {}
