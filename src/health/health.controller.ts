import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '@src/prisma/prisma.service';
import { Public } from '@src/auth/decorators/public.decorator';

const DATABASE_PING_TIMEOUT_MS = 2000;
const MEMORY_HEAP_THRESHOLD_BYTES = 300 * 1024 * 1024;

@ApiTags('health')
@Public()
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
  @ApiOperation({ summary: 'Readiness: exige PostgreSQL' })
  @ApiOkResponse({ description: 'Database is up' })
  @ApiServiceUnavailableResponse({ description: 'Database is down' })
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
  @ApiOperation({ summary: 'Liveness: solo memoria, sin I/O' })
  @ApiOkResponse({ description: 'Process is alive' })
  liveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', MEMORY_HEAP_THRESHOLD_BYTES),
    ]);
  }
}
