# Verificación de Google Maps API Key

## Pasos para verificar y configurar la API key

### 1. Verificar que la variable esté en .env.local

Asegúrate de que tu archivo `.env.local` contenga:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

**Importante:**
- El nombre debe ser exactamente `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Debe empezar con `NEXT_PUBLIC_` para que esté disponible en el cliente
- No debe tener espacios alrededor del `=`
- No debe tener comillas alrededor del valor

### 2. Verificar en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **APIs & Services** > **Library**
4. Busca y habilita estas APIs:
   - ✅ **Maps Embed API** (obligatoria para iframes)
   - ✅ **Maps JavaScript API** (opcional, para funcionalidades avanzadas)
   - ✅ **Geocoding API** (opcional, para convertir direcciones a coordenadas)

### 3. Verificar restricciones de la API key

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en tu API key
3. Verifica las **Application restrictions**:
   - Para desarrollo local: Puedes dejarlo sin restricciones o usar "HTTP referrers" con `localhost:3001/*`
   - Para producción: Usa "HTTP referrers" con tu dominio

4. Verifica las **API restrictions**:
   - Asegúrate de que "Maps Embed API" esté permitida
   - O selecciona "Don't restrict key" para desarrollo

### 4. Reiniciar el servidor de desarrollo

Después de agregar o modificar variables en `.env.local`:

```bash
# Detén el servidor (Ctrl+C)
# Luego reinícialo
npm run dev
```

### 5. Verificar en el navegador

1. Abre la consola del navegador (F12)
2. Busca errores relacionados con Google Maps
3. Si ves errores como "This API key is not authorized", verifica los pasos anteriores

### 6. Probar la API key directamente

Puedes probar tu API key con esta URL (reemplaza `TU_API_KEY` y `DIRECCION`):

```
https://www.google.com/maps/embed/v1/view?key=TU_API_KEY&center=DIRECCION&zoom=14
```

### Errores comunes

**Error: "This API key is not authorized"**
- Solución: Habilita "Maps Embed API" en Google Cloud Console

**Error: "RefererNotAllowedMapError"**
- Solución: Agrega tu dominio a las restricciones de HTTP referrers

**El mapa no carga**
- Verifica que la variable esté en `.env.local` (no en `.env`)
- Verifica que empiece con `NEXT_PUBLIC_`
- Reinicia el servidor de desarrollo

**Los marcadores no aparecen**
- Verifica que las coordenadas estén correctas
- La API Embed puede tener limitaciones con muchos marcadores
- Considera usar la API JavaScript para más control






