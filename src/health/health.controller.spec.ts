import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HttpHealthIndicator , PrismaHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '@src/prisma/prisma.service';
import { HealthCheckService } from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {},
        },
        {
          provide: HttpHealthIndicator,
          useValue: {},
        },
        {
          provide: PrismaHealthIndicator,
          useValue: {},
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
