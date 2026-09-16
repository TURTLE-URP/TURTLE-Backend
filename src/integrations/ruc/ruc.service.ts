import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { RucLookup } from './entities/ruc.entity';

type OpenRucResponse = {
  ruc: string;
  razon_social: string;
  estado: string;
  condicion: string;
  direccion: string;
  ubigeo?: string;
  source?: string;
  as_of?: string;
};

@Injectable()
export class RucService {
  private readonly baseUrl: string;

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('OPENRUC_BASE_URL') ??
      'https://openruc.com/api';
  }

  async lookup(numero: string): Promise<RucLookup> {
    const ruc = numero?.trim();
    if (!/^\d{11}$/.test(ruc)) {
      throw new BadRequestException('RUC must be exactly 11 numeric digits');
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<OpenRucResponse>(`${this.baseUrl}/ruc/${ruc}`),
      );

      if (!data?.ruc || !data?.razon_social) {
        throw new NotFoundException(`RUC ${ruc} was not found`);
      }

      return new RucLookup(
        data.ruc,
        data.razon_social,
        data.estado ?? '',
        data.condicion ?? '',
        data.direccion ?? '',
        data.ubigeo ?? null,
        data.source ?? 'SUNAT',
        data.as_of ?? null,
      );
    } catch (error) {
      this.rethrowProviderError(error, ruc);
    }
  }

  private rethrowProviderError(error: unknown, ruc: string): never {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof HttpException
    ) {
      throw error;
    }

    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status;

    if (status === 404) {
      throw new NotFoundException(`RUC ${ruc} was not found`);
    }

    if (status === 400 || status === 422) {
      throw new BadRequestException('Invalid RUC parameter for provider');
    }

    if (status === 429) {
      throw new HttpException(
        'OpenRUC rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    throw new ServiceUnavailableException(
      'OpenRUC provider is unavailable right now',
    );
  }
}
