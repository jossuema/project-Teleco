# Panel de Administración

Panel de administración web desarrollado con Next.js 14, Prisma ORM y PostgreSQL.

## Tecnologías

- **Frontend**: Next.js 14 (App Router)
- **UI**: ShadCN UI + Tailwind CSS
- **Backend**: API Routes de Next.js
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Autenticación**: NextAuth.js
- **Validación**: Zod
- **Formularios**: React Hook Form
- **Estado**: TanStack Query
- **Gráficos**: Recharts

## Instalación

1. Clona el repositorio
```bash
git clone <tu-repo>
cd panel-administracion
```

2. Instala las dependencias
```bash
npm install
```

3. Configura las variables de entorno
```bash
cp .env.example .env
```

4. Configura tu base de datos PostgreSQL en `.env`

5. Genera el cliente de Prisma
```bash
npx prisma generate
```

6. Sincroniza con tu base de datos existente
```bash
npx prisma db pull
npx prisma generate
```

7. Ejecuta el proyecto
```bash
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run start` - Servidor de producción
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:generate` - Generar cliente de Prisma

## Estructura del Proyecto

```
src/
├── app/                    # Rutas y páginas
│   ├── api/               # API Routes
│   ├── dashboard/         # Páginas del dashboard
│   └── auth/             # Páginas de autenticación
├── components/           # Componentes UI
├── lib/                 # Utilidades y configuración
└── types/              # Tipos TypeScript
```

## Usuarios por Defecto

- **Admin**: username `admin`, password `admin123`
