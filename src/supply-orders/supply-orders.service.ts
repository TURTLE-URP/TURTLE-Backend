//
import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { orden_estado, Prisma } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateSupplyOrderDto } from './dto/create-supply-order.dto';

type SupplierOption = {
  productoProveedorId: number;
  supplierId: number;
  supplierName: string;
  productName: string;
  unitPrice: number | null;
  conversionFactor: number;
};

@Injectable()
export class SupplyOrdersService {
 
}
