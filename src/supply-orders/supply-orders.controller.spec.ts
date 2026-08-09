import { Test, TestingModule } from '@nestjs/testing';
import { SupplyOrdersController } from './supply-orders.controller';
import { SupplyOrdersService } from './supply-orders.service';
import { PrismaService } from '@src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('SupplyOrdersController', () => {
  let controller: SupplyOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplyOrdersController],
      providers: [SupplyOrdersService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<SupplyOrdersController>(SupplyOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
