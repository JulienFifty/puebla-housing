# 🚀 Setup Rápido de Supabase

## Paso 1: Crear Proyecto en Supabase

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Click en **"New Project"**
3. Completa:
   - **Name**: `puebla-housing` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (guárdala)
   - **Region**: Elige la más cercana (ej: `US East`)
4. Click en **"Create new project"**
5. ⏳ Espera 2-3 minutos mientras se crea el proyecto

## Paso 2: Obtener Credenciales

1. En el dashboard de tu proyecto, ve a **Settings** (⚙️) → **API**
2. En la sección **Project API keys**, copia:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon public** key (la clave pública)
   - **service_role** key (la clave privada - ⚠️ mantener secreta)

## Paso 3: Configurar Variables de Entorno

1. En tu proyecto, crea/actualiza el archivo `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

2. Reemplaza los valores con los que copiaste en el Paso 2

## Paso 4: Crear Tablas en Supabase

1. En el dashboard de Supabase, ve a **SQL Editor** (en el menú lateral)
2. Click en **"New query"**
3. Abre el archivo `scripts/supabase-schema.sql` en tu editor
4. Copia TODO el contenido del archivo
5. Pégalo en el SQL Editor de Supabase
6. Click en **"Run"** (o presiona Cmd/Ctrl + Enter)
7. ✅ Deberías ver "Success. No rows returned"

## Paso 5: Verificar que las Tablas se Crearon

1. En el dashboard, ve a **Table Editor** (en el menú lateral)
2. Deberías ver 3 tablas:
   - `profiles`
   - `properties`
   - `rooms`

## Paso 6: Crear Usuario Administrador

### Opción A: Desde el Dashboard (Recomendado)

1. Ve a **Authentication** → **Users**
2. Click en **"Add user"** → **"Create new user"**
3. Completa:
   - **Email**: tu email (ej: `jthibo49@gmail.com`)
   - **Password**: tu contraseña
   - **Auto Confirm User**: ✅ Activa esta opción
4. Click en **"Create user"**
5. Copia el **User UID** que se genera

6. Ve a **SQL Editor** y ejecuta (reemplaza con tu UID y email):

```sql
INSERT INTO public.profiles (id, email, role)
VALUES ('TU_USER_UID_AQUI', 'tu-email@ejemplo.com', 'owner');
```

### Opción B: Con el Script

1. Asegúrate de que `.env.local` tiene las variables configuradas
2. Ejecuta:
```bash
npm run create-admin-supabase
```

## Paso 7: Probar que Todo Funciona

1. Inicia el servidor:
```bash
npm run dev
```

2. Ve a: `http://localhost:3001/dashboard/login`
3. Inicia sesión con el email y contraseña que creaste
4. ✅ Deberías ver el dashboard

## ✅ Checklist

- [ ] Proyecto creado en Supabase
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] SQL ejecutado (tablas creadas)
- [ ] Usuario administrador creado
- [ ] Login funciona correctamente

## 🆘 Si algo no funciona

### Error: "Invalid API key"
- Verifica que copiaste las keys correctas
- Asegúrate de que `.env.local` existe y tiene las variables

### Error: "relation does not exist"
- Verifica que ejecutaste el SQL completo
- Revisa en Table Editor que las tablas existen

### Error de login
- Verifica que el usuario existe en Authentication → Users
- Verifica que el perfil existe en la tabla `profiles`

