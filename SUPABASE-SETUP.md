# Configuración de Supabase para Puebla Housing

## Ventajas de Supabase

✅ **PostgreSQL** - Base de datos robusta para producción
✅ **Autenticación integrada** - Más simple que NextAuth
✅ **Storage** - Para imágenes de propiedades y habitaciones
✅ **API REST automática** - Generada automáticamente
✅ **Dashboard visual** - Fácil gestión de datos
✅ **Real-time** - Actualizaciones en tiempo real (opcional)
✅ **Escalable** - Listo para crecer

## Pasos de Configuración

### 1. Crear cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Anota tu:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon/public key** (API Key pública)
   - **service_role key** (API Key privada - solo para servidor)

### 2. Configurar variables de entorno

Crea/actualiza `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### 3. Crear tablas en Supabase

Ve al SQL Editor en el dashboard de Supabase y ejecuta:

```sql
-- Tabla de usuarios (Supabase ya tiene auth.users, esta es para datos adicionales)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de propiedades
CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location_es TEXT NOT NULL,
  location_en TEXT NOT NULL,
  address TEXT NOT NULL,
  zone TEXT NOT NULL,
  university TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  total_rooms INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  images TEXT[], -- Array de URLs
  bathroom_types TEXT[], -- Array: ['private', 'shared']
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de habitaciones
CREATE TABLE public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  room_number TEXT NOT NULL,
  type TEXT NOT NULL, -- 'private' o 'shared'
  bathroom_type TEXT NOT NULL, -- 'private' o 'shared'
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  images TEXT[], -- Array de URLs
  available BOOLEAN DEFAULT true,
  semester TEXT, -- 'enero-junio-2026' o 'junio-diciembre-2026'
  amenities TEXT[], -- Array de amenidades
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_rooms_property_id ON public.rooms(property_id);
CREATE INDEX idx_rooms_semester ON public.rooms(semester);
CREATE INDEX idx_rooms_available ON public.rooms(available);
CREATE INDEX idx_properties_slug ON public.properties(slug);
CREATE INDEX idx_properties_zone ON public.properties(zone);
CREATE INDEX idx_properties_university ON public.properties(university);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para propiedades (solo owners pueden editar sus propiedades)
CREATE POLICY "Users can view all properties"
  ON public.properties FOR SELECT
  USING (true);

CREATE POLICY "Owners can insert their properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = owner_id);

-- Políticas RLS para habitaciones
CREATE POLICY "Users can view all rooms"
  ON public.rooms FOR SELECT
  USING (true);

CREATE POLICY "Owners can manage rooms of their properties"
  ON public.rooms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = rooms.property_id
      AND properties.owner_id = auth.uid()
    )
  );
```

### 4. Configurar Storage para imágenes

En el dashboard de Supabase:
1. Ve a **Storage**
2. Crea un bucket llamado `property-images`
3. Configura políticas públicas para lectura
4. Crea otro bucket `room-images` si quieres separarlos

### 5. Migrar datos existentes (si los tienes)

Puedes usar el script `scripts/import-to-supabase.ts` que crearemos.

## Comparación con Prisma

| Característica | Prisma + SQLite | Supabase |
|---------------|----------------|----------|
| Base de datos | SQLite (dev) / PostgreSQL (prod) | PostgreSQL (siempre) |
| Autenticación | NextAuth (manual) | Integrada |
| Storage | Manual (S3, etc) | Integrado |
| API REST | Manual | Automática |
| Dashboard | Prisma Studio | Supabase Dashboard |
| Escalabilidad | Requiere más config | Listo para escalar |
| Costo | Servidor + BD | Plan gratuito generoso |

## Próximos pasos

1. ✅ Instalar Supabase client
2. ⏳ Crear cuenta y proyecto en Supabase
3. ⏳ Configurar variables de entorno
4. ⏳ Ejecutar SQL para crear tablas
5. ⏳ Actualizar código para usar Supabase
6. ⏳ Configurar autenticación
7. ⏳ Migrar datos si es necesario

¿Quieres que continúe con la migración completa a Supabase?

