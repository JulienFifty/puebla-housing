# Instrucciones para Configurar Mapbox

## ¿Por qué Mapbox?

Mapbox es una excelente alternativa a Google Maps que ofrece:
- ✅ **Mejor control sobre marcadores** - Puedes personalizar completamente los marcadores
- ✅ **API más moderna y flexible** - Mejor experiencia de desarrollo
- ✅ **Plan gratuito generoso** - 50,000 cargas de mapa por mes (suficiente para desarrollo y producción pequeña)
- ✅ **Mejor personalización** - Más fácil de personalizar estilos y comportamientos
- ✅ **Sin problemas de parámetros** - No tiene las limitaciones de Google Maps Embed API

## Pasos para Configurar

### 1. Obtener tu Access Token de Mapbox

1. Ve a [https://account.mapbox.com/](https://account.mapbox.com/)
2. Crea una cuenta (es completamente gratis)
3. Una vez dentro de tu cuenta, ve a la sección **"Access tokens"**
4. Copia tu **"Default public token"** (empieza con `pk.`)

### 2. Agregar el Token a tu Proyecto

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Agrega la siguiente línea:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_access_token_aqui
```

**Importante:**
- Reemplaza `tu_access_token_aqui` con tu token real
- No agregues comillas alrededor del valor
- No agregues espacios antes o después del `=`
- El nombre debe ser exactamente `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

### 3. Verificar la Configuración

Ejecuta el script de verificación:

```bash
npx tsx scripts/verificar-mapbox-token.ts
```

Este script te dirá si el token está configurado correctamente.

### 4. Reiniciar el Servidor

Después de agregar el token, **reinicia tu servidor de desarrollo**:

```bash
# Detén el servidor (Ctrl+C)
# Luego inicia de nuevo
npm run dev
```

## Características del Mapa

El componente `NearbyLocationsMap` ahora incluye:

- 🗺️ **Mapa interactivo** con zoom y pan
- 📍 **Marcadores personalizados** para la propiedad y ubicaciones cercanas
- 🎨 **Colores por categoría** (azul para universidades, verde para supermercados, etc.)
- 💬 **Popups informativos** al hacer clic en los marcadores
- 🔍 **Búsqueda** de ubicaciones por nombre
- 📱 **Diseño responsive** que funciona en móviles y desktop
- 🖱️ **Interacción bidireccional** - Clic en la lista centra el mapa, clic en marcador muestra popup

## Límites del Plan Gratuito

El plan gratuito de Mapbox incluye:
- **50,000 cargas de mapa por mes** - Más que suficiente para desarrollo y sitios pequeños/medianos
- **Sin límite de tiempo** - No expira
- **Soporte completo** - Todas las funcionalidades están disponibles

Para sitios con mucho tráfico, considera actualizar a un plan de pago, pero para la mayoría de casos, el plan gratuito es suficiente.

## Solución de Problemas

### El mapa no se muestra

1. Verifica que el token esté en `.env.local`
2. Verifica que el token empiece con `pk.`
3. Reinicia el servidor de desarrollo
4. Ejecuta `npx tsx scripts/verificar-mapbox-token.ts` para diagnosticar

### Error: "Invalid token"

- Asegúrate de que el token sea el "Default public token" (no un token secreto)
- Verifica que no haya espacios o caracteres extra en el token
- Asegúrate de que el token no haya expirado en tu cuenta de Mapbox

### Los marcadores no aparecen

- Verifica que las ubicaciones tengan coordenadas (`lat` y `lng`)
- Revisa la consola del navegador para errores
- Asegúrate de que el componente esté recibiendo las props correctas

## Migración desde Google Maps

Si tenías configurado Google Maps anteriormente:

1. **No necesitas eliminar** la variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (puedes dejarla)
2. **Agrega** la nueva variable `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
3. El componente ahora usa Mapbox automáticamente si el token está disponible






