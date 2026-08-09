import { Test, TestingModule } from '@nestjs/testing';
import { SupplyOrdersService } from './supply-orders.service';
import { PrismaService } from '@src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('SupplyOrdersService', () => {
  let service: SupplyOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplyOrdersService, PrismaService, ConfigService],
    }).compile();

    service = module.get<SupplyOrdersService>(SupplyOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
