import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { TokenEntity } from './entities/token.entity';
import { UsersService } from '@src/users/users.service';

export type JwtPayload = {
  sub: string;
  email: string;
  rol: string;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(UsersService) private readonly usersService: UsersService
  ) {}

  async login(dto: LoginDto) {
    
  }

  async hashPassword(plain: string): Promise<string> {
    const rounds = this.configService.get<number>('BCRYPT_ROUNDS') ?? 10;
    return bcrypt.hash(plain, rounds);
  }
}
