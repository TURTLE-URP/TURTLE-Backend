import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@src/prisma/prisma.service';

const DATABASE_PING_TIMEOUT_MS = 2000;
const MEMORY_HEAP_THRESHOLD_BYTES = 300 * 1024 * 1024;

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  // Readiness: ¿puede atender tráfico? Exige PostgreSQL.
  @Get()
  @HealthCheck()
  readiness() {
    return this.health.check([
      () =>
        this.prismaHealth.pingCheck('database', this.prismaService, {
          timeout: DATABASE_PING_TIMEOUT_MS,
        }),
    ]);
  }

  // Liveness: ¿sigue vivo el proceso? Sin I/O externo.
  @Get('live')
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', MEMORY_HEAP_THRESHOLD_BYTES),
    ]);
  }
}
