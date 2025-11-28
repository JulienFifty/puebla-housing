# 📥 Instrucciones para Importar Datos desde CSV de Webflow

## Paso 1: Preparar tus archivos CSV

Coloca tus archivos CSV en el directorio `scripts/` o proporciona la ruta completa.

### Formato del CSV de Propiedades

El archivo CSV de propiedades debe tener estas columnas (puedes usar nombres en español o inglés):

**Columnas requeridas:**
- `name_es` o `name` - Nombre en español
- `slug` - Identificador único (URL-friendly)
- `address` - Dirección completa
- `zone` - Zona (ej: tres-cruces, centro, cholula)
- `university` - Universidad (ej: BUAP, Centro, UDLAP)

**Columnas opcionales:**
- `name_en` - Nombre en inglés (si no se proporciona, usa name_es)
- `location_es` o `location` - Ubicación en español
- `location_en` - Ubicación en inglés
- `description_es` o `description` - Descripción en español
- `description_en` - Descripción en inglés
- `images` - Array JSON de URLs de imágenes o URLs separadas por comas
- **Múltiples columnas de imágenes**: El script detecta automáticamente columnas como:
  - `Imagen Principal`, `Imagen principal`, `imagen principal`
  - `Galeria Imagen 1`, `Galeria Imagen 2`, etc.
  - `Gallery Image 1`, `Gallery Image 2`, etc.
  - Cualquier columna que contenga "imagen", "galeria", "image" o "gallery"
  - **Todas estas imágenes se combinan automáticamente en un solo array**
- `bathroom_types` - Array JSON (ej: `["private","shared"]`) o valores separados por comas
- `available` - `true` o `false` (por defecto: true)
- `total_rooms` - Número total de habitaciones (por defecto: 0)

**Ejemplo de CSV de propiedades:**
```csv
name_es,name_en,slug,location_es,address,zone,university,description_es,images,bathroom_types,available
Casa Mariachi,Casa Mariachi,mariachi,Tres Cruces,Fray Andrés de Olmos 2621,tres-cruces,BUAP,Ambiente social e internacional,"[""https://example.com/img1.jpg"",""https://example.com/img2.jpg""]","[""private"",""shared""]",true
```

### Formato del CSV de Habitaciones

El archivo CSV de habitaciones debe tener estas columnas:

**Columnas requeridas:**
- `property_slug` o `property_id` - Slug o ID de la propiedad
- `room_number` - Número de habitación

**Columnas opcionales:**
- `type` - `private` o `shared` (por defecto: private)
- `bathroom_type` - `private` o `shared` (por defecto: private)
- `description_es` o `description` - Descripción corta en español
- **Descripción larga**: El script detecta automáticamente columnas como:
  - `Description rich del cuarto`, `Description Rich del Cuarto`
  - `Descripción Larga`, `Descripcion Larga`
  - `Description Long`, `Long Description`
  - Cualquier columna que contenga "rich", "larga", "long" o "completa"
  - **Si hay descripción corta y larga, se combinan automáticamente**
- `description_en` - Descripción en inglés
- `images` - Array JSON de URLs o URLs separadas por comas
- **Múltiples columnas de imágenes**: El script detecta automáticamente columnas como:
  - `Imagen Principal`, `Imagen principal`, `imagen principal`
  - `Galeria Imagen 1`, `Galeria Imagen 2`, etc.
  - `Gallery Image 1`, `Gallery Image 2`, etc.
  - Cualquier columna que contenga "imagen", "galeria", "image" o "gallery"
  - **Todas estas imágenes se combinan automáticamente en un solo array**
- `available` - `true` o `false` (por defecto: true)
- `semester` - `enero-junio-2026` o `junio-diciembre-2026`
- **Período de disponibilidad**: El script detecta automáticamente columnas como:
  - `Período de disponibilidad`, `Periodo de disponibilidad`
  - `Period`, `Availability Period`
  - `Semestre`
  - El script convierte automáticamente formatos como "Enero - Junio 2026" o "Enero/Junio 2026" al formato correcto
- `amenities` - Array JSON de amenidades o valores separados por comas

**Ejemplo de CSV de habitaciones:**
```csv
property_slug,room_number,type,bathroom_type,description_es,available,semester
mariachi,101,private,private,Habitación privada con baño privado,true,enero-junio-2026
mariachi,102,shared,shared,Habitación compartida,true,enero-junio-2026
```

## Paso 2: Ejecutar el script de importación

### Importar solo propiedades:
```bash
npx tsx scripts/import-csv-supabase.ts tu-archivo-properties.csv
```

### Importar propiedades y habitaciones:
```bash
npx tsx scripts/import-csv-supabase.ts tu-archivo-properties.csv tu-archivo-rooms.csv
```

### Con rutas absolutas:
```bash
npx tsx scripts/import-csv-supabase.ts /ruta/completa/properties.csv /ruta/completa/rooms.csv
```

## Paso 3: Verificar la importación

1. Ve al dashboard: `http://localhost:3001/dashboard`
2. Revisa las propiedades en: `http://localhost:3001/dashboard/properties`
3. Revisa las habitaciones en: `http://localhost:3001/dashboard/rooms`

## Notas importantes

- **Duplicados**: Si una propiedad con el mismo `slug` ya existe, el script intentará actualizarla en lugar de crear un duplicado.
- **Arrays JSON**: Para campos como `images`, `bathroom_types`, y `amenities`, puedes usar:
  - Formato JSON: `["valor1","valor2"]`
  - Valores separados por comas: `valor1,valor2`
- **Encoding**: Asegúrate de que tu CSV esté en UTF-8 para caracteres especiales.
- **Primera fila**: La primera fila debe contener los nombres de las columnas (headers).

## Ejemplos de archivos

Puedes ver ejemplos en:
- `scripts/ejemplo-properties.csv`
- `scripts/ejemplo-rooms.csv`

## Solución de problemas

### Error: "Propiedad no encontrada"
- Asegúrate de que el `property_slug` en el CSV de habitaciones coincida exactamente con el `slug` en el CSV de propiedades.
- Importa primero las propiedades antes de importar las habitaciones.

### Error: "falta slug o nombre"
- Verifica que tu CSV tenga las columnas requeridas.
- Los nombres de las columnas son case-sensitive.

### Error de encoding
- Abre tu CSV en un editor de texto y guárdalo como UTF-8.
- En Excel: Guardar como → CSV UTF-8 (delimitado por comas)

