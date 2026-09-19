import { Test, TestingModule } from '@nestjs/testing';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';

describe('WorkersController', () => {
  let controller: WorkersController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    updateActivo: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      updateActivo: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkersController],
      providers: [{ provide: WorkersService, useValue: service }],
    }).compile();

    controller = module.get<WorkersController>(WorkersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create delega al service', async () => {
    const dto = {
      name: 'Mozo',
      lastName: 'Test',
      email: 'mozo@turtle.pe',
      role: 'mozo',
    } as never;
    service.create.mockResolvedValue({ id: 3 });

    await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('findAll pasa el query al service', async () => {
    const query = { page: 2, limit: 5, search: 'mozo' } as never;
    service.findAll.mockResolvedValue({ data: [], meta: {} });

    await controller.findAll(query);

    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('findOne delega al service', async () => {
    service.findOne.mockResolvedValue({ id: 3 });

    await controller.findOne(3);

    expect(service.findOne).toHaveBeenCalledWith(3);
  });

  it('update delega al service', async () => {
    service.update.mockResolvedValue({ id: 3 });

    await controller.update(3, { name: 'Nuevo' });

    expect(service.update).toHaveBeenCalledWith(3, { name: 'Nuevo' });
  });

  it('updateActivo delega al service', async () => {
    service.updateActivo.mockResolvedValue({ id: 3 });

    await controller.updateActivo(3, { activo: false });

    expect(service.updateActivo).toHaveBeenCalledWith(3, { activo: false });
  });

  it('remove pasa deletedBy del decorator', async () => {
    service.remove.mockResolvedValue({ id: 3 });

    await controller.remove(3, 1);

    expect(service.remove).toHaveBeenCalledWith(3, 1);
  });
});
