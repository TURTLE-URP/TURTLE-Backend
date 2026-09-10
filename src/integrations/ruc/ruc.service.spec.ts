import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosHeaders } from 'axios';
import { RucService } from './ruc.service';

describe('RucService', () => {
  const httpService = {
    get: jest.fn(),
  } as unknown as HttpService;

  const configService = {
    get: jest.fn().mockReturnValue('https://openruc.com/api'),
  } as unknown as ConfigService;

  let service: RucService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RucService(httpService, configService);
  });

  it('rejects invalid ruc format', async () => {
    await expect(service.lookup('123')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('maps openruc response', async () => {
    (httpService.get as jest.Mock).mockReturnValue(
      of({
        data: {
          ruc: '20100047218',
          razon_social: 'BANCO DE CREDITO DEL PERU',
          estado: 'ACTIVO',
          condicion: 'HABIDO',
          direccion: 'JR. CENTENARIO NRO 156',
          ubigeo: '150114',
          source: 'SUNAT',
          as_of: '2026-05-30',
        },
      }),
    );

    const result = await service.lookup('20100047218');

    expect(result.razonSocial).toBe('BANCO DE CREDITO DEL PERU');
    expect(result.ruc).toBe('20100047218');
  });

  it('maps provider 404 to NotFoundException', async () => {
    const axiosError = new AxiosError('Not Found');
    axiosError.response = {
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data: {},
    };

    (httpService.get as jest.Mock).mockReturnValue(throwError(() => axiosError));

    await expect(service.lookup('20100047218')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
