import { Controller, Post, HttpCode } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller()
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('seed')
  @HttpCode(200)
  async seed() {
    return this.seedService.seed();
  }

  @Post('prune')
  @HttpCode(200)
  async prune() {
    return this.seedService.prune();
  }
}
