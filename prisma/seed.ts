import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const now = () => new Date();

// Solo desarrollo: jamás sembrar usuarios de prueba en producción.
if (process.env.NODE_ENV === 'production') {
  throw new Error('Seed bloqueado en producción');
}

// Clave única para los 4 trabajadores seed (solo dev, ver docs/07-api.md).
// Se hashea una vez: bcrypt.compare del login jamás aceptaría texto plano.
const SEED_PASSWORD = 'changeme123';
const SEED_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);
const passwordHash = hashSync(SEED_PASSWORD, SEED_ROUNDS);

async function main() {
  // ---------- Usuarios (primero: su id se usa como created_by) ----------
  // Sin ids explícitos: la BD los genera y se reutilizan los retornados.
  // Así la secuencia jamás se desincroniza y no hay setval que mantener.
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@turtle.pe' },
    update: {},
    create: {
      email: 'admin@turtle.pe',
      tipo_usuario: 'trabajador',
      created_at: now(),
    },
  });
  const ADMIN_ID = admin.id;
  await prisma.trabajador.upsert({
    where: { id: admin.id },
    update: { password_hash: passwordHash, activo: true },
    create: {
      id: admin.id,
      nombre: 'Admin',
      apellido: 'Turtle',
      password_hash: passwordHash,
      rol: 'administrador',
      activo: true,
    },
  });

  for (const [email, nombre, rol] of [
    ['jefe@turtle.pe', 'Jefe', 'jefe'],
    ['mozo@turtle.pe', 'Mozo', 'mozo'],
    ['cocinero@turtle.pe', 'Cocinero', 'cocinero'],
  ] as const) {
    const user = await prisma.usuario.upsert({
      where: { email },
      update: {},
      create: {
        email,
        tipo_usuario: 'trabajador',
        created_at: now(),
      },
    });
    await prisma.trabajador.upsert({
      where: { id: user.id },
      update: { password_hash: passwordHash, activo: true },
      create: {
        id: user.id,
        nombre,
        apellido: 'Demo',
        password_hash: passwordHash,
        rol,
        activo: true,
      },
    });
  }

  const demoClient = await prisma.usuario.upsert({
    where: { email: 'cliente@turtle.pe' },
    update: {},
    create: {
      email: 'cliente@turtle.pe',
      tipo_usuario: 'cliente_digital',
      created_at: now(),
    },
  });
  await prisma.cliente_Digital.upsert({
    where: { provider_user_id: 'demo-google-id-1' },
    update: {},
    create: {
      id: demoClient.id,
      nombre_completo: 'Cliente Demo',
      auth_provider: 'google',
      provider_user_id: 'demo-google-id-1',
    },
  });

  // ---------- Unidades de medida (sin unique: findOrCreate por nombre) ----------
  async function unidad(
    nombre: string,
    abreviatura: string,
    tipo: 'masa' | 'volumen' | 'unidad',
    factor: string,
  ) {
    const existing = await prisma.unidad_Medida.findFirst({
      where: { nombre },
    });
    if (existing) return existing;
    return prisma.unidad_Medida.create({
      data: { nombre, abreviatura, tipo, factor_canonico: factor },
    });
  }

  const kg = await unidad('Kilogramo', 'kg', 'masa', '1');
  const g = await unidad('Gramo', 'g', 'masa', '0.001');
  const litro = await unidad('Litro', 'L', 'volumen', '1');
  const und = await unidad('Unidad', 'und', 'unidad', '1');

  // ---------- Insumos + medidas ----------
  async function insumo(codigo: string, nombre: string, unidadId: number) {
    return prisma.insumo.upsert({
      where: { codigo },
      update: {},
      create: {
        codigo,
        nombre,
        id_unidad_base: unidadId,
        created_at: now(),
        created_by: ADMIN_ID,
      },
    });
  }

  async function medida(
    insumoId: number,
    nombre: string,
    abreviatura: string,
    factor: string,
  ) {
    const existing = await prisma.insumo_Medidas.findFirst({
      where: { id_insumo: insumoId, nombre },
    });
    if (existing) return existing;
    return prisma.insumo_Medidas.create({
      data: { nombre, abreviatura, factor_a_base: factor, id_insumo: insumoId },
    });
  }

  const pollo = await insumo('INS-POLLO', 'Pollo entero', kg.id);
  const arroz = await insumo('INS-ARROZ', 'Arroz superior', kg.id);
  const papa = await insumo('INS-PAPA', 'Papa amarilla', kg.id);
  const aceite = await insumo('INS-ACEITE', 'Aceite vegetal', litro.id);
  const sal = await insumo('INS-SAL', 'Sal de cocina', g.id);
  const huevo = await insumo('INS-HUEVO', 'Huevo', und.id);

  const polloKg = await medida(pollo.id, 'Kilogramo', 'kg', '1');
  await medida(arroz.id, 'Kilogramo', 'kg', '1');
  await medida(arroz.id, 'Saco 50kg', 'saco', '50');
  const papaKg = await medida(papa.id, 'Kilogramo', 'kg', '1');
  const aceiteL = await medida(aceite.id, 'Litro', 'L', '1');
  const salG = await medida(sal.id, 'Gramo', 'g', '1');
  await medida(huevo.id, 'Unidad', 'und', '1');

  // ---------- Almacenes ----------
  async function almacen(codigo: string, nombre: string, ubicacion: string) {
    return prisma.almacen.upsert({
      where: { codigo },
      update: {},
      create: {
        codigo,
        nombre,
        ubicacion,
        descripcion: `${nombre} (demo)`,
        created_at: now(),
        created_by: ADMIN_ID,
      },
    });
  }

  const almacenPrincipal = await almacen(
    'ALM-01',
    'Almacén principal',
    'Sótano',
  );
  const almacenCocina = await almacen(
    'ALM-02',
    'Almacén cocina',
    'Primer piso',
  );

  // ---------- Stock por almacén (umbrales viven aquí, no en Insumo) ----------
  async function stock(
    almacenId: number,
    insumoId: number,
    min: string,
    ideal: string,
  ) {
    const existing = await prisma.stock_Almacen.findFirst({
      where: { id_almacen: almacenId, id_insumo: insumoId },
    });
    if (existing) return existing;
    return prisma.stock_Almacen.create({
      data: {
        id_almacen: almacenId,
        id_insumo: insumoId,
        stock_actual: '0',
        stock_min: min,
        stock_ideal: ideal,
        updated_at: now(),
      },
    });
  }

  for (const ins of [pollo, arroz, papa, aceite, sal, huevo]) {
    await stock(almacenPrincipal.id, ins.id, '10', '100');
    await stock(almacenCocina.id, ins.id, '5', '30');
  }

  // ---------- Proveedor + producto ----------
  const proveedor = await prisma.proveedor.upsert({
    where: { codigo: 'PROV-01' },
    update: {},
    create: {
      codigo: 'PROV-01',
      ruc: '20100047218',
      razon_social: 'Distribuidora Demo S.A.C.',
      estado: 'ACTIVO',
      condicion: 'HABIDO',
      direccion: 'Av. Demo 123',
      created_at: now(),
      created_by: ADMIN_ID,
    },
  });

  const contacto = await prisma.proveedor_Contacto.findFirst({
    where: { id_proveedor: proveedor.id, contacto: '+51999999999' },
  });
  if (!contacto) {
    await prisma.proveedor_Contacto.create({
      data: {
        id_proveedor: proveedor.id,
        nombre_contacto: 'Contacto Demo',
        tipo: 'WhatsApp',
        contacto: '+51999999999',
        created_at: now(),
        created_by: ADMIN_ID,
      },
    });
  }

  await prisma.productos_Proveedor.upsert({
    where: { codigo: 'PP-POLLO-KG' },
    update: {},
    create: {
      codigo: 'PP-POLLO-KG',
      nombre: 'Pollo entero x kg',
      id_insumo: pollo.id,
      id_insumo_medida: polloKg.id,
      factor_conversion: '1',
      id_proveedor: proveedor.id,
      created_at: now(),
      created_by: ADMIN_ID,
      precio_referencial: '12.50',
    },
  });

  // ---------- Platos + ingredientes ----------
  async function plato(
    nombre: string,
    descripcion: string,
    precio: string,
    categoria: 'entrada' | 'principal' | 'postre' | 'refresco',
  ) {
    const existing = await prisma.platos_Menu.findFirst({ where: { nombre } });
    if (existing) return existing;
    return prisma.platos_Menu.create({
      data: {
        nombre,
        descripcion,
        precio,
        categoria,
        created_at: now(),
        created_by: ADMIN_ID,
      },
    });
  }

  async function ingrediente(
    platoId: number,
    insumoId: number,
    medidaId: number,
    cantidad: string,
    almacenId: number,
  ) {
    const existing = await prisma.ingredientes_Plato.findFirst({
      where: { id_plato: platoId, id_insumo: insumoId },
    });
    if (existing) return existing;
    return prisma.ingredientes_Plato.create({
      data: {
        id_plato: platoId,
        id_insumo: insumoId,
        id_medida_insumo: medidaId,
        cantidad,
        id_almacen_sustraccion: almacenId,
      },
    });
  }

  const polloBrasa = await plato(
    'Pollo a la brasa',
    'Cuarto de pollo con papas',
    '45.90',
    'principal',
  );
  const causa = await plato(
    'Causa limeña',
    'Causa de pollo',
    '18.50',
    'entrada',
  );
  const suspiro = await plato(
    'Suspiro a la limeña',
    'Postre tradicional',
    '12.00',
    'postre',
  );
  await plato('Chicha morada', 'Vaso de chicha', '8.00', 'refresco');

  await ingrediente(
    polloBrasa.id,
    pollo.id,
    polloKg.id,
    '1.2',
    almacenCocina.id,
  );
  await ingrediente(
    polloBrasa.id,
    aceite.id,
    aceiteL.id,
    '0.1',
    almacenCocina.id,
  );
  await ingrediente(polloBrasa.id, sal.id, salG.id, '50', almacenCocina.id);
  await ingrediente(causa.id, papa.id, papaKg.id, '0.4', almacenCocina.id);
  await ingrediente(causa.id, pollo.id, polloKg.id, '0.2', almacenCocina.id);
  void suspiro;

  // ---------- Mesas ----------
  async function mesa(
    codigo: string,
    numero: number,
    piso: 'piso_1' | 'piso_2',
  ) {
    return prisma.mesa.upsert({
      where: { codigo },
      update: {},
      create: {
        codigo,
        numero_mesa: numero,
        capacidad: 4,
        piso,
        created_at: now(),
        created_by: ADMIN_ID,
      },
    });
  }

  const mesa1 = await mesa('M-P1-01', 1, 'piso_1');
  await mesa('M-P1-02', 2, 'piso_1');
  await mesa('M-P1-03', 3, 'piso_1');
  await mesa('M-P2-01', 5, 'piso_2');

  // ---------- Pedido + detalle + pago de ejemplo ----------
  const pedido = await prisma.pedido.upsert({
    where: { codigo: 'PED-0001' },
    update: {},
    create: {
      codigo: 'PED-0001',
      IGV: '6.96',
      subtotal: '45.90',
      tipo: 'local',
      id_mesa: mesa1.id,
      id_cliente_digital: demoClient.id,
      created_at: now(),
      created_by: ADMIN_ID,
      updated_at: now(),
      updated_by: ADMIN_ID,
    },
  });

  const detalles = await prisma.detalles_Pedido.count({
    where: { id_pedido: pedido.id },
  });
  if (detalles === 0) {
    await prisma.detalles_Pedido.create({
      data: {
        id_menu_item: polloBrasa.id,
        cantidad: 1,
        subtotal: '45.90',
        id_pedido: pedido.id,
      },
    });
  }

  await prisma.pago_Cliente.upsert({
    where: { codigo: 'PAG-0001' },
    update: {},
    create: {
      codigo: 'PAG-0001',
      medio_pago: 'efectivo',
      monto: '52.86',
      id_pedido: pedido.id,
      created_at: now(),
    },
  });

  console.log('✅ Seed demo completo (idempotente, re-ejecutable)');
  console.log(
    `   almacenes: ${almacenPrincipal.codigo}, ${almacenCocina.codigo} · pedido: PED-0001`,
  );
  console.log('   trabajadores seed (password: changeme123):');
  console.log('     admin@turtle.pe · cocinero@turtle.pe');
  console.log('     jefe@turtle.pe · mozo@turtle.pe');
}

main()
  .catch((e) => {
    console.error('❌ Seed falló:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
