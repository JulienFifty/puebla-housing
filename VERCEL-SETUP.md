# 🚀 Deploy en Vercel - Puebla Housing

## Paso 1: Crear cuenta en Vercel
1. Ve a https://vercel.com/signup
2. Selecciona "Continue with GitHub"
3. Autoriza a Vercel para acceder a tus repositorios

## Paso 2: Importar el proyecto
1. Una vez logeado, haz clic en "Add New..." → "Project"
2. Busca y selecciona el repositorio `puebla-housing`
3. Haz clic en "Import"

## Paso 3: Configurar el proyecto
En la pantalla de configuración:

### Framework Preset
- **Framework**: Next.js (debería detectarse automáticamente)
- **Root Directory**: `./` (dejar por defecto)
- **Build Command**: `npm run build` (por defecto)
- **Output Directory**: `.next` (por defecto)

### Environment Variables (Variables de Entorno)
**⚠️ IMPORTANTE:** Debes agregar estas variables antes de hacer deploy.

Haz clic en "Environment Variables" y agrega las siguientes (copia los valores de tu archivo `.env.local`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Google APIs
GOOGLE_PLACES_API_KEY=tu_google_places_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key

# Mapbox (opcional)
NEXT_PUBLIC_MAPBOX_TOKEN=tu_mapbox_token

# NextAuth (genera una nueva para producción)
NEXTAUTH_SECRET=genera_un_secret_nuevo_aqui
NEXTAUTH_URL=https://tu-proyecto.vercel.app
```

### Cómo obtener tus valores:
1. Abre tu archivo local `.env.local`
2. Copia cada valor y pégalo en Vercel
3. Para `NEXTAUTH_SECRET`, genera uno nuevo:
   ```bash
   openssl rand -base64 32
   ```

### ⚠️ Configuración de NEXTAUTH_URL
- Durante el primer deploy, deja este campo vacío o usa un placeholder
- Después del primer deploy, Vercel te dará una URL (ej: `puebla-housing.vercel.app`)
- Actualiza `NEXTAUTH_URL` con esa URL completa: `https://puebla-housing.vercel.app`
- Redeploya el proyecto

## Paso 4: Deploy
1. Verifica que todas las variables estén configuradas
2. Haz clic en "Deploy"
3. Espera 2-5 minutos mientras Vercel construye tu proyecto
4. ¡Listo! 🎉

## Paso 5: Configurar dominio personalizado (opcional)
1. Ve a tu proyecto en Vercel
2. Click en "Settings" → "Domains"
3. Agrega tu dominio personalizado si tienes uno

## 🔧 Configuración Post-Deploy

### Actualizar Supabase
Después del deploy, actualiza la configuración de Supabase:

1. Ve a tu proyecto en Supabase
2. Settings → Authentication → URL Configuration
3. Agrega tu URL de Vercel a:
   - **Site URL**: `https://tu-proyecto.vercel.app`
   - **Redirect URLs**: 
     - `https://tu-proyecto.vercel.app/dashboard`
     - `https://tu-proyecto.vercel.app/student`
     - `https://tu-proyecto.vercel.app/api/auth/callback/credentials`

### Actualizar Google Cloud Console
Si usas Google Maps/Places:
1. Ve a Google Cloud Console
2. APIs & Services → Credentials
3. Edita tu API Key
4. En "Application restrictions" → "HTTP referrers"
5. Agrega: `https://tu-proyecto.vercel.app/*`

## 📝 Deploy Automático
Cada vez que hagas push a la rama `main` en GitHub, Vercel automáticamente:
- ✅ Construye tu proyecto
- ✅ Ejecuta los tests
- ✅ Hace deploy si todo sale bien

## 🔍 Monitoreo
- **Dashboard de Vercel**: https://vercel.com/dashboard
- **Logs en tiempo real**: Click en tu proyecto → "Deployments" → Click en cualquier deployment
- **Analytics**: Vercel ofrece analytics gratis

## 🆘 Troubleshooting

### Error de Build
- Revisa los logs en Vercel
- Asegúrate de que todas las variables de entorno estén configuradas
- Verifica que el proyecto compile localmente: `npm run build`

### Error 500
- Revisa los Function Logs en Vercel
- Verifica las credenciales de Supabase
- Asegúrate de que `NEXTAUTH_URL` esté configurado correctamente

### Problemas de autenticación
- Verifica que las URLs de callback estén configuradas en Supabase
- Confirma que `NEXTAUTH_SECRET` esté configurado
- Revisa que `NEXTAUTH_URL` apunte a tu dominio de producción

## 📚 Recursos
- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel + Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)



