# Instrucciones para Agregar Coordenadas a las Propiedades

## Problema Resuelto

Se han corregido dos problemas:
1. ✅ **Universidades mal ubicadas**: Actualizadas con coordenadas reales de Puebla
2. ✅ **Casas no aparecen**: Agregado soporte para coordenadas de propiedades

## Pasos para Configurar

### 1. Agregar Campos de Coordenadas a la Base de Datos

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Agregar columnas de latitud y longitud
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Crear índice para búsquedas geográficas
CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON public.properties(latitude, longitude);
```

O ejecuta el script completo:
```bash
# El archivo está en: scripts/add-property-coordinates.sql
```

### 2. Obtener Coordenadas de las Propiedades

Tienes dos opciones:

#### Opción A: Usar Google Maps (Recomendado)

1. Abre [Google Maps](https://www.google.com/maps)
2. Busca la dirección de la propiedad
3. Haz clic derecho en el marcador
4. Selecciona las coordenadas (aparecerán en la parte superior)
5. Copia la latitud y longitud

**Formato:**
- Latitud: `19.0414` (para Puebla, México)
- Longitud: `-98.2061` (para Puebla, México)

#### Opción B: Usar Geocoding API

Puedes usar una API de geocoding para convertir direcciones en coordenadas automáticamente.

### 3. Agregar Coordenadas desde el Dashboard

1. Ve al dashboard: `/dashboard/properties`
2. Haz clic en "Editar" en la propiedad que quieres actualizar
3. Agrega los campos `latitude` y `longitude` (si están disponibles en el formulario)

**Nota:** Si el formulario de edición no tiene estos campos, puedes agregarlos manualmente desde Supabase:

1. Ve a Supabase Dashboard → Table Editor → `properties`
2. Selecciona la propiedad
3. Agrega los valores en las columnas `latitude` y `longitude`

### 4. Verificar que Funciona

1. Ve a cualquier página de propiedad: `/casas/[slug]`
2. Desplázate hasta la sección "Ubicaciones Cercanas y Mapa"
3. Deberías ver:
   - ✅ Un marcador rojo con "P" para la propiedad
   - ✅ Marcadores numerados para las ubicaciones cercanas
   - ✅ Distancias calculadas dinámicamente desde la propiedad

## Coordenadas de Referencia para Puebla

- **Centro de Puebla**: `19.0414, -98.2061`
- **BUAP (Ciudad Universitaria)**: `19.0006, -98.2044`
- **UDLAP (Cholula)**: `19.0628, -98.3031`
- **UPAEP**: `19.0406, -98.2061`

## Características Implementadas

✅ **Cálculo dinámico de distancias**: Las distancias se calculan automáticamente desde la propiedad usando la fórmula de Haversine

✅ **Ordenamiento por distancia**: Las ubicaciones se ordenan de más cercana a más lejana

✅ **Marcador de propiedad**: Se muestra un marcador rojo con "P" en la ubicación de la propiedad

✅ **Coordenadas reales de universidades**: Actualizadas con ubicaciones reales en Puebla

## Solución de Problemas

### El marcador de la propiedad no aparece

- Verifica que la propiedad tenga `latitude` y `longitude` en la base de datos
- Asegúrate de que los valores sean números válidos (no strings)
- Verifica que las coordenadas estén en el rango correcto:
  - Latitud: -90 a 90
  - Longitud: -180 a 180

### Las distancias no se calculan correctamente

- Verifica que la propiedad tenga coordenadas válidas
- Asegúrate de que las ubicaciones cercanas también tengan coordenadas
- Las distancias se calculan en línea recta (no por carretera)

### Las universidades siguen mal ubicadas

- Las coordenadas han sido actualizadas con datos reales
- Si alguna universidad sigue mal, puedes actualizar sus coordenadas en el código:
  - Archivo: `components/NearbyLocationsMap.tsx`
  - Busca la sección `nearbyLocations.university`




