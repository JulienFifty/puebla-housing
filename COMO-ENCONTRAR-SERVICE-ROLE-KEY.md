# 🔑 Cómo Encontrar el Service Role Key en Supabase

## Pasos para encontrar el Service Role Key:

1. **Ve a tu proyecto en Supabase**
   - https://app.supabase.com
   - Selecciona tu proyecto

2. **Ve a Settings → API**
   - Click en el ícono de ⚙️ (Settings) en el menú lateral izquierdo
   - Click en **"API"** en el submenú

3. **Busca la sección "Project API keys"**
   - Verás varias keys listadas
   - Busca específicamente la que dice **"service_role"** o **"service_role key"**

4. **Si no lo ves inmediatamente:**
   - Scroll hacia abajo en la página
   - A veces está en una sección separada
   - Puede estar marcado como "secret" o tener un ícono de candado 🔒

5. **Click en "Reveal" o "Show"** para verlo
   - Algunas veces está oculto por seguridad
   - Click en el botón para revelarlo

## ⚠️ Importante:

- El **service_role key** es MUY SENSIBLE
- **NUNCA** lo expongas en el código del cliente
- Solo úsalo en:
  - Variables de entorno del servidor
  - Scripts del servidor
  - Nunca en el navegador

## 📝 Estructura de las Keys:

En la página de API verás algo como:

```
Project URL
https://xxxxx.supabase.co

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  [Reveal]

service_role (secret)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  [Reveal] ← ESTA ES LA QUE NECESITAS
```

## 🔄 Si no puedes encontrarlo:

1. Asegúrate de estar en la sección correcta: **Settings → API**
2. Scroll hacia abajo - a veces está más abajo
3. Busca texto que diga "service_role" o "secret"
4. Si aún no lo encuentras, puedes regenerarlo (pero esto invalidará el anterior)

## ✅ Una vez que lo tengas:

Agrégalo a tu `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

