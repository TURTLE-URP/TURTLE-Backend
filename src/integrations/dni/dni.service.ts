import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { DniLookup } from './entities/dni.entity';

type ApiIntiDniData = {
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto?: string;
};

type ApiIntiDniResponse = {
  success: boolean;
  data: ApiIntiDniData;
};

@Injectable()
export class DniService implements OnModuleInit {
  private readonly logger = new Logger(DniService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('APIINTI_BASE_URL') ??
      'https://app.apiinti.dev/api/v1';
    this.apiKey = this.configService.get<string>('APIINTI_API_KEY');
  }

  onModuleInit() {
    if (!this.apiKey?.trim()) {
      this.logger.warn('DNI disabled: APIINTI_API_KEY is not configured');
      return;
    }
    this.logger.log(`DNI ready via ApiInti (${this.baseUrl})`);
  }

  async lookup(numero: string): Promise<DniLookup> {
    const dni = numero?.trim();
    if (!/^\d{8}$/.test(dni)) {
      throw new BadRequestException('DNI must be exactly 8 numeric digits');
    }

    if (!this.apiKey) {
      throw new UnauthorizedException('APIINTI_API_KEY is not configured');
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ApiIntiDniResponse>(`${this.baseUrl}/dni/${dni}`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Accept: 'application/json',
          },
        }),
      );

      if (!data?.success || !data.data?.dni) {
        throw new NotFoundException(`DNI ${dni} was not found`);
      }

      const person = data.data;
      const nombreCompleto =
        person.nombreCompleto ??
        `${person.apellidoPaterno} ${person.apellidoMaterno} ${person.nombres}`.trim();

      return new DniLookup(
        person.dni,
        person.nombres,
        person.apellidoPaterno,
        person.apellidoMaterno,
        nombreCompleto,
      );
    } catch (error) {
      this.rethrowProviderError(error, dni);
    }
  }

  private rethrowProviderError(error: unknown, dni: string): never {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof UnauthorizedException ||
      error instanceof HttpException
    ) {
      throw error;
    }

    const axiosError = error as AxiosError<{
      success?: boolean;
      error?: { message?: string; code?: string };
    }>;
    const status = axiosError.response?.status;

    if (status === 404) {
      throw new NotFoundException(`DNI ${dni} was not found`);
    }

    if (status === 400 || status === 422) {
      throw new BadRequestException('Invalid DNI parameter for provider');
    }

    if (status === 401) {
      throw new UnauthorizedException('ApiInti API key is invalid or missing');
    }

    if (status === 429) {
      throw new HttpException(
        'ApiInti rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    throw new ServiceUnavailableException(
      'ApiInti provider is unavailable right now',
    );
  }
}
