import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const existing = await this.prisma.units_of_measurement.findFirst();
    if (existing) {
      return {
        message:
          'La base de datos ya contiene datos. Ejecuta POST /prune primero si deseas reiniciar.',
      };
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Units of measurement
      const units = await Promise.all([
        tx.units_of_measurement.create({
          data: { name: 'Kilogramo', symbol: 'kg' },
        }),
        tx.units_of_measurement.create({
          data: { name: 'Gramo', symbol: 'g' },
        }),
        tx.units_of_measurement.create({
          data: { name: 'Litro', symbol: 'L' },
        }),
        tx.units_of_measurement.create({
          data: { name: 'Mililitro', symbol: 'mL' },
        }),
        tx.units_of_measurement.create({
          data: { name: 'Unidad', symbol: 'unid' },
        }),
        tx.units_of_measurement.create({
          data: { name: 'Docena', symbol: 'docena' },
        }),
        tx.units_of_measurement.create({
          data: { name: 'Bolsa', symbol: 'bolsa' },
        }),
        tx.units_of_measurement.create({
          data: { name: 'Caja', symbol: 'caja' },
        }),
      ]);
      const uom = Object.fromEntries(
        units.map((u) => [u.symbol, u.unit_of_measurement_id]),
      );

      // 2. Storage rooms
      const rooms = await Promise.all([
        tx.storage_rooms.create({
          data: {
            name: 'Cámara de Frío',
            description: 'Refrigeración para pescados, mariscos y lácteos',
            location: 'Planta baja - ala norte',
          },
        }),
        tx.storage_rooms.create({
          data: {
            name: 'Despensa Seca',
            description: 'Almacén de granos, harinas y conservas',
            location: 'Planta baja - ala sur',
          },
        }),
        tx.storage_rooms.create({
          data: {
            name: 'Congelador',
            description: 'Congelación profunda para carnes y mariscos',
            location: 'Sótano',
          },
        }),
        tx.storage_rooms.create({
          data: {
            name: 'Bodega de Bebidas',
            description: 'Almacén de bebidas y licores',
            location: 'Planta baja - ala este',
          },
        }),
        tx.storage_rooms.create({
          data: {
            name: 'Almacén General',
            description: 'Insumos varios y empaques',
            location: 'Planta alta',
          },
        }),
      ]);
      const roomMap = Object.fromEntries(
        rooms.map((r) => [r.name, r.storage_room_id]),
      );

      // 3. Restaurant tables (20 mesas)
      const tableConfigs = [
        { number: 1, capacity: 2 },
        { number: 2, capacity: 4 },
        { number: 3, capacity: 4 },
        { number: 4, capacity: 6 },
        { number: 5, capacity: 2 },
        { number: 6, capacity: 4 },
        { number: 7, capacity: 4 },
        { number: 8, capacity: 8 },
        { number: 9, capacity: 2 },
        { number: 10, capacity: 4 },
        { number: 11, capacity: 6 },
        { number: 12, capacity: 4 },
        { number: 13, capacity: 4 },
        { number: 14, capacity: 2 },
        { number: 15, capacity: 6 },
        { number: 16, capacity: 4 },
        { number: 17, capacity: 8 },
        { number: 18, capacity: 4 },
        { number: 19, capacity: 2 },
        { number: 20, capacity: 4 },
      ];
      const tables = await Promise.all(
        tableConfigs.map((t) =>
          tx.restaurant_table.create({
            data: {
              table_number: t.number,
              capacity: t.capacity,
              status: 'available',
              qrtoken: `mesa-${t.number}-${Date.now()}`,
            },
          }),
        ),
      );

      // 4. Internal supply tags
      const supplyTags = await Promise.all([
        tx.internal_supply_tags.create({
          data: {
            name: 'Perecible',
            description: 'Insumo que requiere refrigeración',
          },
        }),
        tx.internal_supply_tags.create({
          data: {
            name: 'Importado',
            description: 'Insumo de procedencia importada',
          },
        }),
        tx.internal_supply_tags.create({
          data: { name: 'Local', description: 'Insumo de producción nacional' },
        }),
      ]);
      const tagMap = Object.fromEntries(
        supplyTags.map((t) => [t.name, t.internal_supply_tag_id]),
      );

      // 5. Internal supplies (insumos)
      const supplyData = [
        {
          code: 'COR-001',
          name: 'Corvina',
          uomSymbol: 'kg',
          maxStock: 50,
          minStock: 5,
          currentStock: 30,
          room: 'Cámara de Frío',
          tags: ['Perecible', 'Local'],
        },
        {
          code: 'LIM-001',
          name: 'Limón',
          uomSymbol: 'kg',
          maxStock: 40,
          minStock: 10,
          currentStock: 25,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
        {
          code: 'CEB-001',
          name: 'Cebolla Roja',
          uomSymbol: 'kg',
          maxStock: 40,
          minStock: 8,
          currentStock: 20,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
        {
          code: 'AJI-001',
          name: 'Ají Limo',
          uomSymbol: 'kg',
          maxStock: 15,
          minStock: 3,
          currentStock: 5,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
        {
          code: 'CAM-001',
          name: 'Camote',
          uomSymbol: 'kg',
          maxStock: 30,
          minStock: 10,
          currentStock: 18,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
        {
          code: 'CHO-001',
          name: 'Choclo',
          uomSymbol: 'unid',
          maxStock: 80,
          minStock: 20,
          currentStock: 40,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
        {
          code: 'ACE-001',
          name: 'Aceite Vegetal',
          uomSymbol: 'L',
          maxStock: 30,
          minStock: 4,
          currentStock: 8,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
        {
          code: 'PAP-001',
          name: 'Papa Amarilla',
          uomSymbol: 'kg',
          maxStock: 60,
          minStock: 10,
          currentStock: 35,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
        {
          code: 'ARR-001',
          name: 'Arroz',
          uomSymbol: 'kg',
          maxStock: 80,
          minStock: 15,
          currentStock: 50,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
        {
          code: 'CAL-001',
          name: 'Calamar',
          uomSymbol: 'kg',
          maxStock: 25,
          minStock: 4,
          currentStock: 10,
          room: 'Congelador',
          tags: ['Perecible', 'Importado'],
        },
        {
          code: 'LAN-001',
          name: 'Langostino',
          uomSymbol: 'kg',
          maxStock: 30,
          minStock: 5,
          currentStock: 12,
          room: 'Congelador',
          tags: ['Perecible', 'Importado'],
        },
        {
          code: 'CON-001',
          name: 'Conchas',
          uomSymbol: 'kg',
          maxStock: 20,
          minStock: 3,
          currentStock: 8,
          room: 'Cámara de Frío',
          tags: ['Perecible', 'Local'],
        },
        {
          code: 'RES-001',
          name: 'Lomo de Res',
          uomSymbol: 'kg',
          maxStock: 40,
          minStock: 8,
          currentStock: 15,
          room: 'Congelador',
          tags: ['Perecible', 'Local'],
        },
        {
          code: 'GAL-001',
          name: 'Gallina',
          uomSymbol: 'kg',
          maxStock: 30,
          minStock: 5,
          currentStock: 10,
          room: 'Congelador',
          tags: ['Perecible', 'Local'],
        },
        {
          code: 'PIS-001',
          name: 'Pisco',
          uomSymbol: 'L',
          maxStock: 20,
          minStock: 3,
          currentStock: 6,
          room: 'Bodega de Bebidas',
          tags: ['Importado'],
        },
        {
          code: 'MAR-001',
          name: 'Maracuyá',
          uomSymbol: 'kg',
          maxStock: 15,
          minStock: 3,
          currentStock: 7,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
        {
          code: 'MAI-001',
          name: 'Maíz Morado',
          uomSymbol: 'kg',
          maxStock: 20,
          minStock: 5,
          currentStock: 10,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
        {
          code: 'ZAP-001',
          name: 'Zapallo',
          uomSymbol: 'kg',
          maxStock: 25,
          minStock: 5,
          currentStock: 12,
          room: 'Despensa Seca',
          tags: ['Local'],
        },
      ];

      const supplies = await Promise.all(
        supplyData.map((s) =>
          tx.internal_supplies.create({
            data: {
              code: s.code,
              name: s.name,
              unit_of_measurement_id: uom[s.uomSymbol],
              max_stock: s.maxStock,
              min_stock: s.minStock,
              current_stock: s.currentStock,
            },
          }),
        ),
      );
      const supplyMap = Object.fromEntries(
        supplies.map((s) => [s.code, s.internal_supply_id]),
      );

      // 6. Internal supplies location
      await Promise.all(
        supplyData.map((s) =>
          tx.internal_supplies_location.create({
            data: {
              internal_supply_id: supplyMap[s.code],
              storage_room_id: roomMap[s.room],
              current_stock: s.currentStock,
            },
          }),
        ),
      );

      // 7. Supply tagging
      await Promise.all(
        supplyData.flatMap((s) =>
          s.tags.map((tag) =>
            tx.supply_tagging.create({
              data: {
                internal_supply_id: supplyMap[s.code],
                internal_supply_tag_id: tagMap[tag],
              },
            }),
          ),
        ),
      );

      // 8. Menu item tags
      const menuTags = await Promise.all([
        tx.menu_item_tags.create({
          data: {
            name: 'Popular',
            description: 'Plato más pedido por los clientes',
          },
        }),
        tx.menu_item_tags.create({
          data: {
            name: 'Nuevo',
            description: 'Plato recién incorporado al menú',
          },
        }),
        tx.menu_item_tags.create({
          data: { name: 'Recomendado', description: 'Recomendación del chef' },
        }),
        tx.menu_item_tags.create({
          data: {
            name: 'Del Mar',
            description: 'Platos de pescados y mariscos',
          },
        }),
        tx.menu_item_tags.create({
          data: {
            name: 'Criolla',
            description: 'Platos de la cocina criolla peruana',
          },
        }),
        tx.menu_item_tags.create({
          data: { name: 'Bebidas', description: 'Bebidas y tragos' },
        }),
        tx.menu_item_tags.create({
          data: { name: 'Postres', description: 'Postres y dulces' },
        }),
      ]);
      const menuTagMap = Object.fromEntries(
        menuTags.map((t) => [t.name, t.menu_item_tag_id]),
      );

      // 9. Menu items (platos)
      const menuItemData = [
        {
          name: 'Ceviche Clásico',
          description: 'Corvina, limón, ají limo, cebolla morada',
          price: 35,
          type: 'item' as const,
          popular: true,
          category: 'Del Mar',
        },
        {
          name: 'Jalea Mixta',
          description: 'Pescado, calamar, langostino, yuca frita',
          price: 42,
          type: 'item' as const,
          popular: true,
          category: 'Del Mar',
        },
        {
          name: 'Sudado de Corvina',
          description: 'Corvina en salsa criolla al wok',
          price: 45,
          type: 'item' as const,
          popular: false,
          category: 'Del Mar',
        },
        {
          name: 'Arroz con Mariscos',
          description: 'Arroz, conchas, langostinos, cilantro',
          price: 48,
          type: 'item' as const,
          popular: false,
          category: 'Del Mar',
        },
        {
          name: 'Lomo Saltado',
          description: 'Res, tomate, cebolla roja, papas fritas',
          price: 38,
          type: 'item' as const,
          popular: true,
          category: 'Criolla',
        },
        {
          name: 'Ají de Gallina',
          description: 'Gallina, ají amarillo, pan, nuez',
          price: 32,
          type: 'item' as const,
          popular: false,
          category: 'Criolla',
        },
        {
          name: 'Carapulcra',
          description: 'Papa seca, cerdo, maní, maíz',
          price: 30,
          type: 'item' as const,
          popular: false,
          category: 'Criolla',
        },
        {
          name: 'Causa Rellena',
          description: 'Papa amarilla, atún, palta, mayonesa',
          price: 28,
          type: 'item' as const,
          popular: false,
          category: 'Criolla',
        },
        {
          name: 'Chicha Morada',
          description: 'Chicha artesanal de la casa',
          price: 8,
          type: 'item' as const,
          popular: true,
          category: 'Bebidas',
        },
        {
          name: 'Maracuyá Sour',
          description: 'Maracuyá, limón, pisco, jarabe',
          price: 18,
          type: 'item' as const,
          popular: false,
          category: 'Bebidas',
        },
        {
          name: 'Agua Mineral',
          description: '500ml con o sin gas',
          price: 5,
          type: 'item' as const,
          popular: false,
          category: 'Bebidas',
        },
        {
          name: 'Arroz con Leche',
          description: 'Arroz, leche evaporada, canela',
          price: 14,
          type: 'item' as const,
          popular: false,
          category: 'Postres',
        },
        {
          name: 'Mazamorra Morada',
          description: 'Maíz morado, frutas, chuño',
          price: 14,
          type: 'item' as const,
          popular: false,
          category: 'Postres',
        },
        {
          name: 'Picarones',
          description: 'Anillos de zapallo con miel de higo',
          price: 16,
          type: 'item' as const,
          popular: true,
          category: 'Postres',
        },
        {
          name: 'Tiradito de Lenguado',
          description: 'Lenguado, crema de ají amarillo',
          price: 40,
          type: 'item' as const,
          popular: false,
          category: 'Del Mar',
        },
        {
          name: 'Chupe de Camarones',
          description: 'Camarones, papa amarilla, leche',
          price: 38,
          type: 'item' as const,
          popular: false,
          category: 'Del Mar',
        },
        {
          name: 'Combo Ceviche + Chicha',
          description: 'Ceviche clásico + chicha morada',
          price: 39,
          type: 'combo' as const,
          popular: true,
          category: null,
        },
        {
          name: 'Combo Lomo + Maracuyá',
          description: 'Lomo saltado + maracuyá sour',
          price: 50,
          type: 'combo' as const,
          popular: false,
          category: null,
        },
      ];

      const menuItems = await Promise.all(
        menuItemData.map((item) =>
          tx.menu_items.create({
            data: {
              name: item.name,
              description: item.description,
              unit_price: item.price,
              status: 'available',
              type: item.type,
            },
          }),
        ),
      );
      const menuItemMap = Object.fromEntries(
        menuItems.map((m) => [m.name, m.menu_item_id]),
      );

      // 10. Menu item tagging
      const taggingData: { menu_item_id: number; menu_item_tag_id: number }[] =
        [];
      for (const m of menuItemData) {
        if (m.popular) {
          taggingData.push({
            menu_item_id: menuItemMap[m.name],
            menu_item_tag_id: menuTagMap['Popular'],
          });
        }
        if (m.category) {
          taggingData.push({
            menu_item_id: menuItemMap[m.name],
            menu_item_tag_id: menuTagMap[m.category],
          });
        }
      }
      await tx.menu_item_tagging.createMany({ data: taggingData });

      // 11. Combo descriptions
      const comboData = [
        {
          comboName: 'Combo Ceviche + Chicha',
          items: [
            { name: 'Ceviche Clásico', factor: 1 },
            { name: 'Chicha Morada', factor: 1 },
          ],
        },
        {
          comboName: 'Combo Lomo + Maracuyá',
          items: [
            { name: 'Lomo Saltado', factor: 1 },
            { name: 'Maracuyá Sour', factor: 1 },
          ],
        },
      ];

      await Promise.all(
        comboData.flatMap((combo) =>
          combo.items.map((item) =>
            tx.combo_description.create({
              data: {
                menu_item_id: menuItemMap[combo.comboName],
                combo_item_id: menuItemMap[item.name],
                equivalence_factor: item.factor,
              },
            }),
          ),
        ),
      );

      // 12. Menu item ingredients
      const ingredientsData = [
        {
          menuItem: 'Ceviche Clásico',
          supplyCode: 'COR-001',
          factor: 0.2,
          room: 'Cámara de Frío',
        },
        {
          menuItem: 'Ceviche Clásico',
          supplyCode: 'LIM-001',
          factor: 0.1,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Ceviche Clásico',
          supplyCode: 'CEB-001',
          factor: 0.05,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Ceviche Clásico',
          supplyCode: 'AJI-001',
          factor: 0.02,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Ceviche Clásico',
          supplyCode: 'CAM-001',
          factor: 0.15,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Jalea Mixta',
          supplyCode: 'COR-001',
          factor: 0.15,
          room: 'Cámara de Frío',
        },
        {
          menuItem: 'Jalea Mixta',
          supplyCode: 'CAL-001',
          factor: 0.1,
          room: 'Congelador',
        },
        {
          menuItem: 'Jalea Mixta',
          supplyCode: 'LAN-001',
          factor: 0.08,
          room: 'Congelador',
        },
        {
          menuItem: 'Jalea Mixta',
          supplyCode: 'ACE-001',
          factor: 0.1,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Sudado de Corvina',
          supplyCode: 'COR-001',
          factor: 0.25,
          room: 'Cámara de Frío',
        },
        {
          menuItem: 'Sudado de Corvina',
          supplyCode: 'CEB-001',
          factor: 0.05,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Sudado de Corvina',
          supplyCode: 'AJI-001',
          factor: 0.02,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Arroz con Mariscos',
          supplyCode: 'ARR-001',
          factor: 0.2,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Arroz con Mariscos',
          supplyCode: 'CON-001',
          factor: 0.1,
          room: 'Cámara de Frío',
        },
        {
          menuItem: 'Arroz con Mariscos',
          supplyCode: 'LAN-001',
          factor: 0.08,
          room: 'Congelador',
        },
        {
          menuItem: 'Arroz con Mariscos',
          supplyCode: 'CAL-001',
          factor: 0.08,
          room: 'Congelador',
        },
        {
          menuItem: 'Lomo Saltado',
          supplyCode: 'RES-001',
          factor: 0.2,
          room: 'Congelador',
        },
        {
          menuItem: 'Lomo Saltado',
          supplyCode: 'CEB-001',
          factor: 0.05,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Lomo Saltado',
          supplyCode: 'PAP-001',
          factor: 0.15,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Lomo Saltado',
          supplyCode: 'ACE-001',
          factor: 0.05,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Ají de Gallina',
          supplyCode: 'GAL-001',
          factor: 0.2,
          room: 'Congelador',
        },
        {
          menuItem: 'Ají de Gallina',
          supplyCode: 'ARR-001',
          factor: 0.1,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Ají de Gallina',
          supplyCode: 'PAP-001',
          factor: 0.1,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Carapulcra',
          supplyCode: 'PAP-001',
          factor: 0.15,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Carapulcra',
          supplyCode: 'CEB-001',
          factor: 0.05,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Causa Rellena',
          supplyCode: 'PAP-001',
          factor: 0.2,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Causa Rellena',
          supplyCode: 'LIM-001',
          factor: 0.05,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Chicha Morada',
          supplyCode: 'MAI-001',
          factor: 0.1,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Maracuyá Sour',
          supplyCode: 'MAR-001',
          factor: 0.08,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Maracuyá Sour',
          supplyCode: 'PIS-001',
          factor: 0.05,
          room: 'Bodega de Bebidas',
        },
        {
          menuItem: 'Maracuyá Sour',
          supplyCode: 'LIM-001',
          factor: 0.03,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Arroz con Leche',
          supplyCode: 'ARR-001',
          factor: 0.1,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Mazamorra Morada',
          supplyCode: 'MAI-001',
          factor: 0.12,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Picarones',
          supplyCode: 'ZAP-001',
          factor: 0.15,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Picarones',
          supplyCode: 'ACE-001',
          factor: 0.1,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Tiradito de Lenguado',
          supplyCode: 'COR-001',
          factor: 0.18,
          room: 'Cámara de Frío',
        },
        {
          menuItem: 'Tiradito de Lenguado',
          supplyCode: 'LIM-001',
          factor: 0.05,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Tiradito de Lenguado',
          supplyCode: 'AJI-001',
          factor: 0.02,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Chupe de Camarones',
          supplyCode: 'LAN-001',
          factor: 0.12,
          room: 'Congelador',
        },
        {
          menuItem: 'Chupe de Camarones',
          supplyCode: 'PAP-001',
          factor: 0.15,
          room: 'Despensa Seca',
        },
        {
          menuItem: 'Chupe de Camarones',
          supplyCode: 'ACE-001',
          factor: 0.03,
          room: 'Despensa Seca',
        },
      ];

      await Promise.all(
        ingredientsData.map((ing) =>
          tx.menu_item_ingredients.create({
            data: {
              menu_item_id: menuItemMap[ing.menuItem],
              internal_supply_id: supplyMap[ing.supplyCode],
              storage_room_to_extract_id: roomMap[ing.room],
              equivalence_factor: ing.factor,
            },
          }),
        ),
      );

      // 13. Suppliers (proveedores)
      const supplierData = [
        {
          ruc: '20123456789',
          companyName: 'Pesquera El Marino S.A.C.',
          contacts: [
            { method: 'phone' as const, contact: '+51 991 234 567' },
            { method: 'WhatsApp' as const, contact: '+51 991 234 567' },
          ],
          catalog: [
            {
              code: 'ELM-COR-001',
              name: 'Corvina entera 10kg',
              supply: 'COR-001',
              uom: 'kg',
              price: 32,
              factor: 1,
            },
            {
              code: 'ELM-CAL-001',
              name: 'Calamar limpio 5kg',
              supply: 'CAL-001',
              uom: 'kg',
              price: 18,
              factor: 1,
            },
            {
              code: 'ELM-LAN-001',
              name: 'Langostino 5kg',
              supply: 'LAN-001',
              uom: 'kg',
              price: 35,
              factor: 1,
            },
            {
              code: 'ELM-CON-001',
              name: 'Conchas de abanico',
              supply: 'CON-001',
              uom: 'kg',
              price: 12,
              factor: 1,
            },
          ],
        },
        {
          ruc: '20345678901',
          companyName: 'AgroAndina Distribuciones S.A.C.',
          contacts: [
            { method: 'phone' as const, contact: '+51 992 345 678' },
            { method: 'email' as const, contact: 'ventas@agroandina.pe' },
          ],
          catalog: [
            {
              code: 'AGR-LIM-001',
              name: 'Limón verde por caja',
              supply: 'LIM-001',
              uom: 'kg',
              price: 3.5,
              factor: 1,
            },
            {
              code: 'AGR-CEB-001',
              name: 'Cebolla roja por saco',
              supply: 'CEB-001',
              uom: 'kg',
              price: 2.5,
              factor: 1,
            },
            {
              code: 'AGR-AJI-001',
              name: 'Ají limo fresco',
              supply: 'AJI-001',
              uom: 'kg',
              price: 8,
              factor: 1,
            },
            {
              code: 'AGR-CAM-001',
              name: 'Camote amarillo',
              supply: 'CAM-001',
              uom: 'kg',
              price: 2,
              factor: 1,
            },
            {
              code: 'AGR-PAP-001',
              name: 'Papa amarilla selecta',
              supply: 'PAP-001',
              uom: 'kg',
              price: 1.8,
              factor: 1,
            },
            {
              code: 'AGR-ZAP-001',
              name: 'Zapallo loche',
              supply: 'ZAP-001',
              uom: 'kg',
              price: 1.5,
              factor: 1,
            },
            {
              code: 'AGR-MAR-001',
              name: 'Maracuyá dulce',
              supply: 'MAR-001',
              uom: 'kg',
              price: 6,
              factor: 1,
            },
            {
              code: 'AGR-MAI-001',
              name: 'Maíz morado',
              supply: 'MAI-001',
              uom: 'kg',
              price: 4,
              factor: 1,
            },
            {
              code: 'AGR-CHO-001',
              name: 'Choclo desgranado',
              supply: 'CHO-001',
              uom: 'unid',
              price: 1.5,
              factor: 1,
            },
          ],
        },
        {
          ruc: '20456789012',
          companyName: 'Mercado Central del Norte S.A.C.',
          contacts: [
            { method: 'phone' as const, contact: '+51 993 456 789' },
            { method: 'WhatsApp' as const, contact: '+51 993 456 789' },
          ],
          catalog: [
            {
              code: 'MCN-ARR-001',
              name: 'Arroz superior x25kg',
              supply: 'ARR-001',
              uom: 'kg',
              price: 4.2,
              factor: 1,
            },
            {
              code: 'MCN-ACE-001',
              name: 'Aceite vegetal x20L',
              supply: 'ACE-001',
              uom: 'L',
              price: 12,
              factor: 1,
            },
            {
              code: 'MCN-GAL-001',
              name: 'Gallina eviscerada',
              supply: 'GAL-001',
              uom: 'kg',
              price: 9.5,
              factor: 1,
            },
            {
              code: 'MCN-RES-001',
              name: 'Lomo de res',
              supply: 'RES-001',
              uom: 'kg',
              price: 28,
              factor: 1,
            },
          ],
        },
        {
          ruc: '20567890123',
          companyName: 'Bebidas y Licores Norte EIRL',
          contacts: [
            { method: 'email' as const, contact: 'pedidos@bylnorte.pe' },
          ],
          catalog: [
            {
              code: 'BLN-PIS-001',
              name: 'Pisco puro quebranta',
              supply: 'PIS-001',
              uom: 'L',
              price: 45,
              factor: 1,
            },
          ],
        },
      ];

      const suppliers = await Promise.all(
        supplierData.map((s) =>
          tx.suppliers.create({
            data: {
              ruc: s.ruc,
              company_name: s.companyName,
              supplier_contact_methods: {
                create: s.contacts.map((c) => ({
                  method: c.method,
                  contact: c.contact,
                })),
              },
              supplier_catalog_items: {
                create: s.catalog.map((ci) => ({
                  code: ci.code,
                  name: ci.name,
                  unit_price: ci.price,
                  conversion_factor: ci.factor,
                  unit_of_measurement_id: uom[ci.uom],
                  internal_supply_id: supplyMap[ci.supply],
                })),
              },
            },
          }),
        ),
      );
      const catalogItemCount = supplierData.reduce(
        (sum, s) => sum + s.catalog.length,
        0,
      );

      return {
        units_of_measurement: units.length,
        storage_rooms: rooms.length,
        restaurant_tables: tables.length,
        internal_supply_tags: supplyTags.length,
        internal_supplies: supplies.length,
        menu_item_tags: menuTags.length,
        menu_items: menuItems.length,
        combo_descriptions: comboData.reduce(
          (sum, c) => sum + c.items.length,
          0,
        ),
        menu_item_ingredients: ingredientsData.length,
        suppliers: suppliers.length,
        supplier_contact_methods: supplierData.reduce(
          (sum, s) => sum + s.contacts.length,
          0,
        ),
        supplier_catalog_items: catalogItemCount,
      };
    });

    return { message: 'Base de datos poblada exitosamente', counts: result };
  }

  async prune() {
    const result = await this.prisma.$transaction(async (tx) => {
      const deleted = {
        menu_item_ingredients: await tx.menu_item_ingredients.deleteMany(),
        combo_description: await tx.combo_description.deleteMany(),
        menu_item_tagging: await tx.menu_item_tagging.deleteMany(),
        menu_item_tags: await tx.menu_item_tags.deleteMany(),
        supply_tagging: await tx.supply_tagging.deleteMany(),
        internal_supply_tags: await tx.internal_supply_tags.deleteMany(),
        internal_supplies_location:
          await tx.internal_supplies_location.deleteMany(),
        internal_supplies: await tx.internal_supplies.deleteMany(),
        restaurant_table: await tx.restaurant_table.deleteMany(),
        storage_rooms: await tx.storage_rooms.deleteMany(),
        units_of_measurement: await tx.units_of_measurement.deleteMany(),
        menu_items: await tx.menu_items.deleteMany(),
        customer_order_items: await tx.customer_order_items.deleteMany(),
        customer_order: await tx.customer_order.deleteMany(),
        supplier_catalog_items: await tx.supplier_catalog_items.deleteMany(),
        supplier_contact_methods:
          await tx.supplier_contact_methods.deleteMany(),
        suppliers: await tx.suppliers.deleteMany(),
      };
      return Object.fromEntries(
        Object.entries(deleted).map(([key, val]) => [key, val.count]),
      );
    });

    return {
      message: 'Base de datos vaciada exitosamente',
      deleted_counts: result,
    };
  }
}
