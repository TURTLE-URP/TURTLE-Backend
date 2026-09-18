import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    const adapter = new PrismaPg({
      connectionString: configService.get<string>('DATABASE_URL'),
    });
    super({ adapter });
  }

  // When module starts, connect to database
  async onModuleInit() {
    await this.$connect(); // Open database connection
    this.logger.log('✅ Database connected'); // Confirmation
  }

  // When module stops, disconnect from database
  async onModuleDestroy() {
    await this.$disconnect(); // Close database connection
    this.logger.log('❌ Database disconnected');
  }
}
