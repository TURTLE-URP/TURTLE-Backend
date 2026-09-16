import { Logger, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, PrismaPromise } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrismaService extends PrismaClient {
  private readonly logger = new Logger(PrismaService.name)
  constructor(private readonly configService: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configService.get<string>('DATABASE_URL'),
    });
    super({ adapter });
  }

  // When module starts, connect to database
  async onModuleInit() {
    await this.$connect();  // Open database connection
    this.logger.log('✅ Database connected');  // Confirmation
  }

  // When module stops, disconnect from database
  async onModuleDestroy() {
    await this.$disconnect();  // Close database connection
    this.logger.log('❌ Database disconnected');
  }

  // Helper method for database transactions
  // (multiple operations that all succeed or all fail together)
  async executeTransaction<T>(
    arg: PrismaPromise<T>[], 
    options?: {
    maxWait?: number;
    timeout?: number;
    isolationLevel?: Prisma.TransactionIsolationLevel
  }
  ): Promise<T[]> {
    return this.$transaction(arg,options);  // Prisma handles transaction
  }
}
