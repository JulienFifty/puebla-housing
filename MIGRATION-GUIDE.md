# Guía de Migración a Supabase

## ✅ Lo que ya está migrado

- ✅ Cliente de Supabase configurado
- ✅ API routes actualizadas para usar Supabase
- ✅ Autenticación migrada a Supabase Auth
- ✅ Dashboard actualizado
- ✅ Middleware configurado
- ✅ Scripts de utilidad creados

## 📋 Pasos para completar la migración

### 1. Crear cuenta y proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta (gratis)
3. Crea un nuevo proyecto
4. Espera a que se complete el setup (2-3 minutos)

### 2. Obtener credenciales

En el dashboard de Supabase:
1. Ve a **Settings** → **API**
2. Copia:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon/public key** (API Key pública)
   - **service_role key** (API Key privada - ⚠️ mantener secreta)

### 3. Configurar variables de entorno

Crea/actualiza `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### 4. Crear tablas en Supabase

1. Ve al **SQL Editor** en el dashboard de Supabase
2. Copia y pega el contenido de `scripts/supabase-schema.sql`
3. Ejecuta el script
4. Verifica que las tablas se crearon correctamente

### 5. Crear usuario administrador

```bash
npm run create-admin-supabase
```

O manualmente desde el dashboard de Supabase:
1. Ve a **Authentication** → **Users**
2. Click en **Add user** → **Create new user**
3. Ingresa email y contraseña
4. Después, ejecuta este SQL para crear el perfil:

```sql
INSERT INTO public.profiles (id, email, role)
VALUES ('user-id-aqui', 'tu-email@ejemplo.com', 'owner');
```

### 6. Configurar Storage (opcional)

Para subir imágenes:

1. Ve a **Storage** en el dashboard
2. Crea un bucket llamado `property-images`
3. Configura políticas públicas:
   - **Policy name**: Public read access
   - **Allowed operation**: SELECT
   - **Policy definition**: `true` (permite lectura pública)

### 7. Probar la aplicación

```bash
npm run dev
```

1. Ve a `http://localhost:3001/dashboard/login`
2. Inicia sesión con tu usuario
3. Verifica que el dashboard funciona

## 🔄 Migrar datos existentes (si los tienes)

Si tienes datos en SQLite o Webflow:

1. Exporta tus datos como JSON
2. Usa el script `scripts/import-to-supabase.ts` (crear si es necesario)
3. O importa manualmente desde el dashboard de Supabase

## 📝 Cambios importantes

### Antes (Prisma + SQLite)
- Base de datos: SQLite local
- Autenticación: NextAuth
- Storage: Manual

### Ahora (Supabase)
- Base de datos: PostgreSQL en la nube
- Autenticación: Supabase Auth
- Storage: Integrado en Supabase

## 🚀 Ventajas obtenidas

✅ Base de datos PostgreSQL lista para producción
✅ Autenticación más simple y robusta
✅ Storage integrado para imágenes
✅ Dashboard visual para gestionar datos
✅ API REST automática
✅ Escalable sin cambios adicionales
✅ Plan gratuito generoso

## ⚠️ Notas importantes

1. **Service Role Key**: Nunca la expongas en el cliente. Solo úsala en scripts del servidor.

2. **Row Level Security (RLS)**: Las políticas están configuradas para que:
   - Cualquiera puede ver propiedades y habitaciones
   - Solo los dueños pueden crear/editar/eliminar sus propiedades

3. **Variables de entorno**: Asegúrate de que `.env.local` esté en `.gitignore`

## 🆘 Troubleshooting

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctas
- Asegúrate de usar `NEXT_PUBLIC_` para las variables del cliente

### Error: "relation does not exist"
- Ejecuta el script SQL en Supabase
- Verifica que las tablas se crearon correctamente

### Error de autenticación
- Verifica que el usuario existe en Supabase Auth
- Verifica que el perfil existe en la tabla `profiles`

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

