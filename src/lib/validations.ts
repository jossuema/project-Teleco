import { z } from "zod"

// Cliente
export const clienteSchema = z.object({
  id_cedula: z.string().min(1, "Cédula es requerida").max(50),
  nombre: z.string().min(1, "Nombre es requerido").max(50),
  apellido: z.string().min(1, "Apellido es requerido").max(50),
  direccion: z.string().min(1, "Dirección es requerida").max(100),
})

// Contrato
export const contratoSchema = z.object({
  id_contrato: z.string().min(1, "ID de contrato es requerido").max(50),
  numero_servicio: z.string().min(1, "Número de servicio es requerido").max(50),
  ced_cliente: z.string().min(1, "Cédula del cliente es requerida").max(50),
})

// Equipo
export const equipoSchema = z.object({
  serie: z.string().min(1, "Serie es requerida").max(50),
  modelo: z.string().min(1, "Modelo es requerido").max(50),
  f_adquisicion: z.number().optional().nullable(),
  estado: z.enum(["Nuevo", "Buen", "Mal"]).optional().nullable(),
  tipo: z.enum(["ONU", "ONT", "R_compl"]).optional().nullable(),
  ubicacion: z.string().max(50).optional().nullable(),
})

// Técnico
export const tecnicoSchema = z.object({
  nombre: z.string().min(1, "Nombre es requerido").max(50),
  apellido: z.string().min(1, "Apellido es requerido").max(50),
})

// Movimiento Equipo
export const movimientoEquipoSchema = z.object({
  contrato_anterior: z.string().max(50).optional().nullable(),
  contrato_actual: z.string().max(50).optional().nullable(),
  tipo_movimiento: z.enum(["cambio", "instalacion"]).optional().nullable(),
  observacion: z.string().optional().nullable(),
  id_tecnico: z.number().optional().nullable(),
})

// Forma Adquisición
export const formaAdquisicionSchema = z.object({
  forma: z.string().min(1, "Forma de adquisición es requerida").max(50),
})

// Fecha Adquisición
export const fechaAdquisicionSchema = z.object({
  id_forma_adq: z.number().optional().nullable(),
  mes: z.number().min(1).max(12),
  anio: z.number().min(1900).max(new Date().getFullYear() + 10),
})

// Usuario
export const usuarioSchema = z.object({
  username: z.string().min(1, "Usuario es requerido").max(50),
  password: z.string().min(6, "Contraseña mínimo 6 caracteres").max(255),
  rol: z.enum(["admin", "cliente"]),
})

export type Cliente = z.infer<typeof clienteSchema>
export type Contrato = z.infer<typeof contratoSchema>
export type Equipo = z.infer<typeof equipoSchema>
export type Tecnico = z.infer<typeof tecnicoSchema>
export type MovimientoEquipo = z.infer<typeof movimientoEquipoSchema>
export type FormaAdquisicion = z.infer<typeof formaAdquisicionSchema>
export type FechaAdquisicion = z.infer<typeof fechaAdquisicionSchema>
export type Usuario = z.infer<typeof usuarioSchema>