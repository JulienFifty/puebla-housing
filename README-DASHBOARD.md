# Dashboard de Puebla Housing

## Configuración Inicial

### 1. Base de Datos

La aplicación usa Prisma con SQLite (desarrollo) o PostgreSQL (producción).

```bash
# Generar cliente de Prisma
npm run db:generate

# Crear migraciones
npm run db:migrate

# Abrir Prisma Studio (interfaz visual de la BD)
npm run db:studio
```

### 2. Crear Usuario Administrador

```bash
npm run create-admin
```

Ingresa:
- Email
- Contraseña
- Nombre (opcional)

### 3. Importar Datos de Webflow

1. Exporta tus datos de Webflow CMS como JSON
2. Coloca los archivos en `scripts/`:
   - `webflow-properties.json` - Lista de propiedades
   - `webflow-rooms.json` - Lista de habitaciones

3. Ajusta el mapeo de campos en `scripts/import-webflow.ts` según tu estructura

4. Ejecuta:
```bash
npm run import-webflow
```

## Estructura de Datos

### Propiedades (Properties)
- `nameEs` / `nameEn` - Nombre en español/inglés
- `slug` - URL única
- `locationEs` / `locationEn` - Ubicación
- `address` - Dirección completa
- `zone` - Zona (tres-cruces, centro, cholula)
- `university` - Universidad (BUAP, Centro, UDLAP)
- `descriptionEs` / `descriptionEn` - Descripción
- `images` - Array JSON de URLs de imágenes
- `bathroomTypes` - Array JSON (["private", "shared"])
- `available` - Disponible (boolean)

### Habitaciones (Rooms)
- `propertyId` - ID de la propiedad
- `roomNumber` - Número de habitación
- `type` - Tipo (private, shared)
- `bathroomType` - Tipo de baño (private, shared)
- `descriptionEs` / `descriptionEn` - Descripción
- `images` - Array JSON de URLs de imágenes
- `available` - Disponible (boolean)
- `semester` - Semestre (enero-junio-2026, junio-diciembre-2026)
- `amenities` - Array JSON de amenidades

## API Routes

### Propiedades
- `GET /api/properties` - Listar todas
- `POST /api/properties` - Crear nueva
- `GET /api/properties/[id]` - Obtener una
- `PUT /api/properties/[id]` - Actualizar
- `DELETE /api/properties/[id]` - Eliminar

### Habitaciones
- `GET /api/rooms?propertyId=xxx&semester=xxx` - Listar (con filtros)
- `POST /api/rooms` - Crear nueva
- `GET /api/rooms/[id]` - Obtener una
- `PUT /api/rooms/[id]` - Actualizar
- `DELETE /api/rooms/[id]` - Eliminar

## Dashboard

Accede al dashboard en: `http://localhost:3001/dashboard`

### Páginas Disponibles
- `/dashboard` - Panel principal con estadísticas
- `/dashboard/properties` - Lista de propiedades
- `/dashboard/properties/new` - Crear nueva propiedad
- `/dashboard/properties/[id]` - Editar propiedad
- `/dashboard/rooms` - Lista de habitaciones
- `/dashboard/rooms/new` - Crear nueva habitación
- `/dashboard/rooms/[id]` - Editar habitación

## Autenticación

El dashboard usa NextAuth.js con autenticación por credenciales.

- Login: `/dashboard/login`
- Las rutas del dashboard requieren autenticación
- Solo usuarios con rol "owner" pueden gestionar datos

## Migración a PostgreSQL (Producción)

1. Cambia el provider en `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
}
```

2. Actualiza `DATABASE_URL` en `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/puebla_housing"
```

3. Ejecuta migraciones:
```bash
npm run db:migrate
```

