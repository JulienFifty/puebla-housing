# Instrucciones para Configurar Reseñas de Google My Business

Este documento explica cómo configurar la integración con Google My Business para mostrar reseñas reales en las páginas de propiedades.

## 📋 Requisitos Previos

1. Una cuenta de Google Cloud Platform
2. Un proyecto en Google Cloud Console
3. Google Places API habilitada
4. Una API Key de Google Places

## 🔑 Paso 1: Obtener la API Key de Google Places

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Places API**:
   - Ve a "APIs & Services" > "Library"
   - Busca "Places API"
   - Haz clic en "Enable"
4. Crea una API Key:
   - Ve a "APIs & Services" > "Credentials"
   - Haz clic en "Create Credentials" > "API Key"
   - Copia la API Key generada

## 🔒 Paso 2: Configurar Restricciones de la API Key (Recomendado)

Para mayor seguridad, configura restricciones en tu API Key:

1. En "Credentials", haz clic en tu API Key
2. En "API restrictions", selecciona "Restrict key"
3. Selecciona solo "Places API"
4. En "Application restrictions", puedes restringir por:
   - HTTP referrers (para uso en web)
   - IP addresses (para uso en servidor)

## ⚙️ Paso 3: Configurar Variable de Entorno

Agrega la siguiente variable de entorno a tu archivo `.env.local`:

```bash
GOOGLE_PLACES_API_KEY=tu_api_key_aqui
```

**Importante**: Esta variable debe estar en el servidor (no es pública), así que no uses `NEXT_PUBLIC_` como prefijo.

## 🏢 Paso 4: Obtener el Place ID de cada Propiedad

Cada propiedad necesita tener su **Google Place ID** asociado. Hay varias formas de obtenerlo:

### Opción A: Desde Google Maps (Más Fácil)

1. Ve a [Google Maps](https://www.google.com/maps)
2. Busca tu negocio/propiedad
3. Haz clic en el negocio para ver los detalles
4. En la URL, encontrarás el Place ID. Por ejemplo:
   ```
   https://www.google.com/maps/place/Casa+Mariachi/@19.123456,-98.123456,15z/data=!4m6!3m5!1s0x85cfc1234567890:0x1234567890abcdef!8m2!3d19.123456!4d-98.123456!16s%2Fg%2F11abc123def
   ```
   El Place ID es la parte después de `!1s0x` o puedes encontrarlo en el código fuente de la página.

### Opción B: Usando la API de Google Places

Puedes usar la API de Google Places para buscar el Place ID por dirección:

```bash
curl "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Casa%20Mariachi%20Puebla&inputtype=textquery&fields=place_id&key=TU_API_KEY"
```

### Opción C: Desde Google My Business

1. Inicia sesión en [Google My Business](https://business.google.com/)
2. Selecciona tu negocio
3. En la configuración, encontrarás el Place ID

## 💾 Paso 5: Agregar Place ID a las Propiedades

Una vez que tengas el Place ID de cada propiedad, agrégalo a la base de datos:

### Si usas Supabase:

```sql
UPDATE properties 
SET google_place_id = 'ChIJ...' 
WHERE slug = 'mariachi';
```

### Si usas Prisma:

Puedes actualizar las propiedades desde el dashboard o usando una migración.

## 🧪 Paso 6: Probar la Integración

1. Inicia el servidor de desarrollo: `npm run dev`
2. Ve a una página de propiedad que tenga un `google_place_id` configurado
3. Navega a la sección de "Reseñas"
4. Deberías ver las reseñas reales de Google My Business

## 📊 Estructura de Datos

La API devuelve las siguientes reseñas con esta estructura:

```typescript
{
  reviews: [
    {
      author_name: string;
      author_url?: string;
      profile_photo_url?: string;
      rating: number; // 1-5
      relative_time_description: string; // "hace 2 meses"
      text: string;
      time: number; // timestamp
    }
  ],
  rating: number; // Promedio de todas las reseñas
  totalReviews: number; // Total de reseñas
}
```

## ⚠️ Limitaciones y Consideraciones

1. **Límites de la API**: Google Places API tiene límites de uso. El plan gratuito permite:
   - $200 de crédito mensual
   - Aproximadamente 40,000 solicitudes de detalles de lugar por mes

2. **Caché**: Considera implementar caché para las reseñas para reducir llamadas a la API.

3. **Actualización**: Las reseñas se obtienen en tiempo real. Si quieres actualizarlas periódicamente, considera usar un job o webhook.

## 🔍 Solución de Problemas

### Error: "Google Places API key not configured"
- Verifica que la variable `GOOGLE_PLACES_API_KEY` esté configurada en `.env.local`
- Reinicia el servidor después de agregar la variable

### Error: "Google Places API error: REQUEST_DENIED"
- Verifica que la Places API esté habilitada en Google Cloud Console
- Verifica que la API Key tenga permisos para Places API
- Verifica las restricciones de la API Key

### No se muestran reseñas
- Verifica que el `google_place_id` esté correcto
- Verifica que el lugar tenga reseñas en Google My Business
- Revisa la consola del navegador para errores

## 📚 Recursos Adicionales

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Place Details API](https://developers.google.com/maps/documentation/places/web-service/details)
- [Cómo encontrar un Place ID](https://developers.google.com/maps/documentation/places/web-service/place-id)

