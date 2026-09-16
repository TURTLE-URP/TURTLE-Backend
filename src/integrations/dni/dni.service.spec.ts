import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { DniService } from './dni.service';

describe('DniService', () => {
  const httpService = {
    get: jest.fn(),
  } as unknown as HttpService;

  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'APIINTI_BASE_URL') return 'https://app.apiinti.dev/api/v1';
      if (key === 'APIINTI_API_KEY') return 'test-token';
      return undefined;
    }),
  } as unknown as ConfigService;

  let service: DniService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DniService(httpService, configService);
  });

  it('rejects invalid dni format', async () => {
    await expect(service.lookup('123')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('maps apiinti response', async () => {
    (httpService.get as jest.Mock).mockReturnValue(
      of({
        data: {
          success: true,
          data: {
            dni: '12345678',
            nombres: 'JUAN CARLOS',
            apellidoPaterno: 'PEREZ',
            apellidoMaterno: 'GARCIA',
            nombreCompleto: 'PEREZ GARCIA JUAN CARLOS',
          },
        },
      }),
    );

    const result = await service.lookup('12345678');

    expect(result.dni).toBe('12345678');
    expect(result.nombreCompleto).toBe('PEREZ GARCIA JUAN CARLOS');
    expect(httpService.get).toHaveBeenCalledWith(
      'https://app.apiinti.dev/api/v1/dni/12345678',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    );
  });

  it('fails when api key is missing', async () => {
    const configWithoutKey = {
      get: jest.fn((key: string) => {
        if (key === 'APIINTI_BASE_URL') return 'https://app.apiinti.dev/api/v1';
        return undefined;
      }),
    } as unknown as ConfigService;

    const serviceWithoutKey = new DniService(httpService, configWithoutKey);

    await expect(serviceWithoutKey.lookup('12345678')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
