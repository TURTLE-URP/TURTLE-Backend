import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Solo desarrollo: jamás vaciar una base productiva.
if (process.env.NODE_ENV === 'production') {
  console.error('❌ unseed bloqueado en producción');
  process.exit(1);
}

// Todas las tablas del schema (33 únicas). Con CASCADE el orden no importa,
// se listan en orden inverso a las dependencias por claridad.
// OJO: _prisma_migrations NO se toca (el historial de migraciones se conserva).
const TABLES = [
  'Evidencia_Merma',
  'Merma_Insumo',
  'Movimiento_Almacen',
  'Stock_Almacen',
  'Detalles_Distribucion_Abasto',
  'Distribucion_Abasto',
  'Detalles_Arribo_Abasto',
  'Arribo_Abasto',
  'Detalles_Orden_Abasto',
  'Orden_Abasto',
  'Pagos_Factura',
  'Factura',
  'Detalles_Pago_Cliente',
  'Detalles_Pedido',
  'Pago_Cliente',
  'Movimientos_Cocina',
  'Detalles_Comanda',
  'Comanda',
  'Pedido',
  'Ingredientes_Plato',
  'Productos_Proveedor',
  'Proveedor_Contacto',
  'Proveedor',
  'Insumo_Medidas',
  'Insumo',
  'Unidad_Medida',
  'Almacen',
  'Mesa',
  'Cliente_Digital',
  'Trabajador',
  'Usuario',
  'Platos_Menu',
  'Auditoria_Sistema',
];

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const quoted = TABLES.map((t) => `"${t}"`).join(', ');
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`,
  );
  console.log('✅ Base vaciada (33 tablas, migraciones intactas)');
}

main()
  .catch((e) => {
    console.error('❌ Unseed falló:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
