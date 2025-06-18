import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Inicializando datos de prueba...')

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.usuarios.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      rol: 'admin',
    },
  })
  console.log('✅ Usuario admin creado')

  // Crear formas de adquisición
  const formaCompra = await prisma.formaAdquisicion.upsert({
    where: { id_forma_adq: 1 },
    update: {},
    create: {
      forma: 'Compra directa',
    },
  })

  const formaAlquiler = await prisma.formaAdquisicion.upsert({
    where: { id_forma_adq: 2 },
    update: {},
    create: {
      forma: 'Alquiler',
    },
  })

  // Crear fechas de adquisición
  const fecha2023 = await prisma.fechaAdquisicion.upsert({
    where: { id_fecha: 1 },
    update: {},
    create: {
      mes: 6,
      anio: 2023,
      id_forma_adq: formaCompra.id_forma_adq,
    },
  })

  const fecha2024 = await prisma.fechaAdquisicion.upsert({
    where: { id_fecha: 2 },
    update: {},
    create: {
      mes: 3,
      anio: 2024,
      id_forma_adq: formaAlquiler.id_forma_adq,
    },
  })

  // Crear clientes de prueba
  const cliente1 = await prisma.cliente.upsert({
    where: { id_cedula: '12345678' },
    update: {},
    create: {
      id_cedula: '12345678',
      nombre: 'Juan',
      apellido: 'Pérez',
      direccion: 'Calle 123, Ciudad',
    },
  })

  const cliente2 = await prisma.cliente.upsert({
    where: { id_cedula: '87654321' },
    update: {},
    create: {
      id_cedula: '87654321',
      nombre: 'María',
      apellido: 'González',
      direccion: 'Avenida 456, Ciudad',
    },
  })

  // Crear contratos
  const contrato1 = await prisma.contrato.upsert({
    where: { id_contrato: 'CONT-001' },
    update: {},
    create: {
      id_contrato: 'CONT-001',
      numero_servicio: 'SRV-12345',
      ced_cliente: cliente1.id_cedula,
    },
  })

  const contrato2 = await prisma.contrato.upsert({
    where: { id_contrato: 'CONT-002' },
    update: {},
    create: {
      id_contrato: 'CONT-002',
      numero_servicio: 'SRV-67890',
      ced_cliente: cliente2.id_cedula,
    },
  })

  // Crear técnicos
  const tecnico1 = await prisma.tecnico.upsert({
    where: { id_tecnico: 1 },
    update: {},
    create: {
      nombre: 'Carlos',
      apellido: 'Rodríguez',
    },
  })

  const tecnico2 = await prisma.tecnico.upsert({
    where: { id_tecnico: 2 },
    update: {},
    create: {
      nombre: 'Ana',
      apellido: 'Martínez',
    },
  })

  // Crear equipos
  const equipo1 = await prisma.equipo.upsert({
    where: { serie: 'ONU-001' },
    update: {},
    create: {
      serie: 'ONU-001',
      modelo: 'Huawei HG8245H',
      estado: 'Nuevo',
      tipo: 'ONU',
      f_adquisicion: fecha2023.id_fecha,
      ubicacion: contrato1.id_contrato,
    },
  })

  const equipo2 = await prisma.equipo.upsert({
    where: { serie: 'ONT-002' },
    update: {},
    create: {
      serie: 'ONT-002',
      modelo: 'ZTE F670L',
      estado: 'Buen',
      tipo: 'ONT',
      f_adquisicion: fecha2024.id_fecha,
      ubicacion: contrato2.id_contrato,
    },
  })

  // Crear movimientos
  const movimiento1 = await prisma.movimientoEquipo.create({
    data: {
      tipo_movimiento: 'instalacion',
      contrato_actual: contrato1.id_contrato,
      observacion: 'Instalación inicial del equipo',
      id_tecnico: tecnico1.id_tecnico,
    },
  })

  const movimiento2 = await prisma.movimientoEquipo.create({
    data: {
      tipo_movimiento: 'cambio',
      contrato_anterior: contrato1.id_contrato,
      contrato_actual: contrato2.id_contrato,
      observacion: 'Cambio de ubicación por solicitud del cliente',
      id_tecnico: tecnico2.id_tecnico,
    },
  })

  console.log('✅ Datos de prueba creados exitosamente')
  console.log('📊 Resumen:')
  console.log(`- ${await prisma.cliente.count()} clientes`)
  console.log(`- ${await prisma.contrato.count()} contratos`)
  console.log(`- ${await prisma.equipo.count()} equipos`)
  console.log(`- ${await prisma.tecnico.count()} técnicos`)
  console.log(`- ${await prisma.movimientoEquipo.count()} movimientos`)
  console.log('- 1 usuario admin (username: admin, password: admin123)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })