# Cómo Obtener Coordenadas Exactas de Universidades

## Método 1: Google Maps (Recomendado - Más Preciso)

1. Abre [Google Maps](https://www.google.com/maps)
2. Busca la universidad (ejemplo: "BUAP Puebla")
3. Haz clic derecho en el punto exacto del campus principal
4. Selecciona "¿Qué hay aquí?" o las coordenadas aparecerán en la parte inferior
5. Copia las coordenadas (formato: `19.043720, -98.198149`)

## Método 2: Usar la API de Geocodificación de Mapbox

Ya que estás usando Mapbox, puedes usar su API de geocodificación para obtener coordenadas exactas:

### Ejemplo con cURL:

```bash
# Reemplaza YOUR_MAPBOX_TOKEN con tu token
curl "https://api.mapbox.com/geocoding/v5/mapbox.places/BUAP%20Puebla.json?access_token=YOUR_MAPBOX_TOKEN&country=MX"
```

### Ejemplo con JavaScript:

```javascript
async function obtenerCoordenadas(direccion) {
  const token = 'TU_MAPBOX_TOKEN';
  const query = encodeURIComponent(direccion);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&country=MX&limit=1`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.features && data.features.length > 0) {
    const [lng, lat] = data.features[0].center;
    console.log(`Coordenadas: ${lat}, ${lng}`);
    return { lat, lng };
  }
}

// Uso:
obtenerCoordenadas('BUAP Benemérita Universidad Autónoma de Puebla');
```

## Coordenadas Actuales (Verificar y Actualizar)

Las coordenadas actuales en el código son:

- **BUAP**: `18.999849, -98.199150`
- **UDLAP**: `19.062778, -98.303056`
- **UPAEP**: `19.040556, -98.206111`
- **ITP**: `19.058474, -98.151620`
- **Ibero**: `19.043720, -98.198149`

## Verificar Precisión

1. Abre Google Maps
2. Pega las coordenadas en la barra de búsqueda (formato: `19.043720, -98.198149`)
3. Verifica que el marcador esté exactamente en el campus de la universidad
4. Si no está correcto, obtén nuevas coordenadas usando el Método 1

## Actualizar en el Código

Una vez que tengas las coordenadas exactas:

1. Abre `components/NearbyLocationsMap.tsx`
2. Busca la sección `nearbyLocations.university`
3. Actualiza las coordenadas `lat` y `lng` para cada universidad
4. Guarda el archivo
5. Recarga la página para ver los cambios

## Notas Importantes

- Las coordenadas deben tener al menos 6 decimales para precisión de metros
- Formato: `lat: 19.043720, lng: -98.198149` (sin espacios)
- Longitud en Puebla es negativa (Oeste): `-98.xxxxx`
- Latitud en Puebla es positiva (Norte): `19.xxxxx`






