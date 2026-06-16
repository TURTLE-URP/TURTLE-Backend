import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { contact_method_type } from '@src/generated/prisma/client';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/create-supplier.dto';

const include = {
  supplier_contact_methods: true,
  supplier_catalog_items: {
    include: { units_of_measurement: true, internal_supplies: true },
  },
};

@Injectable()
export class AdminSuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.suppliers.findMany({ include, orderBy: { supplier_id: 'asc' } });
  }

  async findOne(id: number) {
    const item = await this.prisma.suppliers.findUnique({
      where: { supplier_id: id },
      include,
    });
    if (!item) throw new NotFoundException(`Proveedor #${id} no encontrado`);
    return item;
  }

  async create(dto: CreateSupplierDto) {
    const { contactMethods, catalogItems, ...data } = dto;
    return this.prisma.suppliers.create({
      data: {
        ruc: data.ruc,
        company_name: data.companyName,
        ...(contactMethods?.length
          ? {
              supplier_contact_methods: {
                create: contactMethods.map((cm) => ({
                  method: cm.method as contact_method_type,
                  contact: cm.contact,
                })),
              },
            }
          : {}),
        ...(catalogItems?.length
          ? {
              supplier_catalog_items: {
                create: catalogItems.map((ci) => ({
                  code: ci.code,
                  name: ci.name,
                  unit_price: ci.unitPrice,
                  conversion_factor: ci.conversionFactor ?? 1,
                  unit_of_measurement_id: ci.unitOfMeasurementId,
                  internal_supply_id: ci.internalSupplyId,
                })),
              },
            }
          : {}),
      },
      include,
    });
  }

  async update(id: number, dto: UpdateSupplierDto) {
    await this.findOne(id);
    const { contactMethods, catalogItems, ...data } = dto;

    const updateData: any = {};
    if (data.companyName !== undefined) updateData.company_name = data.companyName;

    if (contactMethods !== undefined) {
      await this.prisma.supplier_contact_methods.deleteMany({ where: { supplier_id: id } });
      if (contactMethods.length) {
        await this.prisma.supplier_contact_methods.createMany({
          data: contactMethods.map((cm) => ({
            supplier_id: id,
            method: cm.method as contact_method_type,
            contact: cm.contact,
          })),
        });
      }
    }

    if (catalogItems !== undefined) {
      await this.prisma.supplier_catalog_items.deleteMany({ where: { supplier_id: id } });
      if (catalogItems.length) {
        await this.prisma.supplier_catalog_items.createMany({
          data: catalogItems.map((ci) => ({
            supplier_id: id,
            code: ci.code,
            name: ci.name,
            unit_price: ci.unitPrice,
            conversion_factor: ci.conversionFactor ?? 1,
            unit_of_measurement_id: ci.unitOfMeasurementId,
            internal_supply_id: ci.internalSupplyId,
          })),
        });
      }
    }

    if (Object.keys(updateData).length) {
      await this.prisma.suppliers.update({ where: { supplier_id: id }, data: updateData });
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.suppliers.delete({ where: { supplier_id: id } });
    return { deleted: true };
  }
}
