import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '@src/users/users.service';
import { compare } from 'bcryptjs';
import { TokenEntity } from './entities/token.entity';
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
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  async login(dto: LoginDto): Promise<TokenEntity> {
    const usuario = await this.usersService.findWorker(dto.email);
    if (!usuario?.trabajador?.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const ok = await this.checkPassword(
      dto.password,
      usuario.trabajador.password_hash,
    );

    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const access_token = await this.buildJwtToken({
      sub: usuario.id.toString(),
      email: usuario.email,
      rol: usuario.trabajador.rol,
    });

    return {
      access_token,
      token_type: 'bearer',
    };
  }

  private async checkPassword(password: string, veridicHashedPassword: string) {
    return compare(password, veridicHashedPassword);
  }

  private async buildJwtToken(payload: JwtPayload) {
    return await this.jwt.signAsync(payload);
  }
}
