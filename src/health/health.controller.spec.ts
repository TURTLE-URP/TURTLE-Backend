import { Test, TestingModule } from '@nestjs/testing';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaService } from '@src/prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let health: { check: jest.Mock };
  let memory: { checkHeap: jest.Mock };
  let prismaHealth: { pingCheck: jest.Mock };
  let prismaService: PrismaService;

  beforeEach(async () => {
    health = {
      // Ejecuta los indicadores como lo hace Terminus y devuelve el agregado
      check: jest.fn((indicators: Array<() => Promise<unknown>>) =>
        Promise.all(indicators.map((run) => run())).then(() => ({
          status: 'ok',
        })),
      ),
    };
    memory = {
      checkHeap: jest.fn().mockResolvedValue({
        memory_heap: { status: 'up' },
      }),
    };
    prismaHealth = {
      pingCheck: jest.fn().mockResolvedValue({
        database: { status: 'up' },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: health },
        { provide: MemoryHealthIndicator, useValue: memory },
        { provide: PrismaHealthIndicator, useValue: prismaHealth },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('readiness checks the database via Prisma', async () => {
    const result = await controller.readiness();

    expect(prismaHealth.pingCheck).toHaveBeenCalledWith(
      'database',
      prismaService,
      { timeout: 2000 },
    );
    expect(result).toEqual({ status: 'ok' });
  });

  it('liveness checks the heap without touching the database', async () => {
    const result = await controller.liveness();

    expect(memory.checkHeap).toHaveBeenCalledWith(
      'memory_heap',
      300 * 1024 * 1024,
    );
    expect(prismaHealth.pingCheck).not.toHaveBeenCalled();
    expect(result).toEqual({ status: 'ok' });
  });
});
