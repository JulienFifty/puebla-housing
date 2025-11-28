/**
 * Script para importar datos desde CSV de Webflow a Supabase
 * 
 * Uso: npx tsx scripts/import-csv-supabase.ts <archivo-properties.csv> [archivo-rooms.csv]
 * 
 * Ejemplo:
 *   npx tsx scripts/import-csv-supabase.ts webflow-properties.csv webflow-rooms.csv
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface PropertyRow {
  // Ajusta estos nombres según las columnas de tu CSV
  name?: string;
  name_es?: string;
  name_en?: string;
  slug?: string;
  location?: string;
  location_es?: string;
  location_en?: string;
  address?: string;
  zone?: string;
  university?: string;
  description?: string;
  description_es?: string;
  description_en?: string;
  images?: string; // JSON string o URLs separadas por comas
  bathroom_types?: string; // JSON string o valores separados por comas
  available?: string; // 'true' o 'false'
  total_rooms?: string;
  [key: string]: any; // Para campos adicionales
}

interface RoomRow {
  property_slug?: string;
  property_id?: string;
  room_number?: string;
  type?: string; // 'private' o 'shared'
  bathroom_type?: string; // 'private' o 'shared'
  description?: string;
  description_es?: string;
  description_en?: string;
  images?: string;
  available?: string;
  semester?: string;
  amenities?: string;
  [key: string]: any;
}

function parseArray(value: string | undefined): string[] {
  if (!value) return [];
  
  // Intentar parsear como JSON
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Si no es JSON, separar por comas
    return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return true;
  return value.toLowerCase() === 'true' || value === '1' || value === 'yes';
}

/**
 * Extrae todas las imágenes de un row, buscando columnas que contengan:
 * - "imagen" (principal, principal, etc.)
 * - "galeria" (imagen 1, imagen 2, etc.)
 * - "image" (principal, principal, etc.)
 * - "gallery" (image 1, image 2, etc.)
 * 
 * Combina todas las imágenes encontradas en un solo array
 */
function parseImagesFromRow(row: any): string[] {
  const images: string[] = [];
  
  // Buscar en todas las columnas del row
  for (const [key, value] of Object.entries(row)) {
    if (!value || typeof value !== 'string') continue;
    
    const keyLower = key.toLowerCase();
    const valueTrimmed = (value as string).trim();
    
    // Si la columna contiene "imagen" o "galeria" o "image" o "gallery"
    if (
      keyLower.includes('imagen') || 
      keyLower.includes('galeria') || 
      keyLower.includes('image') || 
      keyLower.includes('gallery')
    ) {
      // Si el valor es una URL válida, agregarlo
      if (valueTrimmed && (valueTrimmed.startsWith('http://') || valueTrimmed.startsWith('https://'))) {
        images.push(valueTrimmed);
      }
      // Si el valor es un array JSON o valores separados por comas, parsearlo
      else if (valueTrimmed) {
        const parsed = parseArray(valueTrimmed);
        images.push(...parsed);
      }
    }
  }
  
  // Eliminar duplicados y valores vacíos
  return [...new Set(images.filter(img => img && img.length > 0))];
}

/**
 * Limpia el HTML removiendo atributos id="" vacíos y otros atributos innecesarios
 */
function cleanHtml(html: string): string {
  if (!html) return '';
  
  // Remover atributos id="" vacíos
  let cleaned = html.replace(/id\s*=\s*["']\s*["']/gi, '');
  
  // Remover espacios extra dentro de los tags (ej: <h3 > -> <h3>)
  cleaned = cleaned.replace(/<\s*([^>]+)\s*>/g, (match, content) => {
    // Remover espacios al inicio y final del contenido del tag
    const cleanedContent = content.trim().replace(/\s+/g, ' ');
    return `<${cleanedContent}>`;
  });
  
  // Remover espacios extra entre tags
  cleaned = cleaned.replace(/>\s+</g, '><');
  
  // Remover espacios múltiples en el texto (pero mantener un espacio)
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned.trim();
}

/**
 * Busca y combina descripciones cortas y largas de un row
 * Busca columnas que contengan "description", "descripcion", "rich"
 * Retorna la descripción combinada (corta + larga si ambas existen)
 * Limpia el HTML automáticamente
 */
function parseDescriptionFromRow(row: any, language: 'es' | 'en' = 'es'): string {
  let shortDesc = '';
  let longDesc = '';
  
  // Buscar en todas las columnas del row
  for (const [key, value] of Object.entries(row)) {
    if (!value || typeof value !== 'string') continue;
    
    const keyLower = key.toLowerCase();
    const valueTrimmed = (value as string).trim();
    
    if (!valueTrimmed) continue;
    
    // Buscar descripción corta
    if (
      (language === 'es' && (keyLower === 'description_es' || keyLower === 'descripcion_es')) ||
      (language === 'en' && keyLower === 'description_en') ||
      (keyLower === 'description' && !keyLower.includes('rich') && !keyLower.includes('larga') && !keyLower.includes('long'))
    ) {
      shortDesc = valueTrimmed;
    }
    
    // Buscar descripción larga/rich
    if (
      keyLower.includes('rich') ||
      keyLower.includes('larga') ||
      keyLower.includes('long') ||
      (keyLower.includes('description') && (keyLower.includes('rich') || keyLower.includes('completa')))
    ) {
      // Verificar que sea del idioma correcto o sin especificar idioma
      if (
        (language === 'es' && (keyLower.includes('es') || !keyLower.includes('en'))) ||
        (language === 'en' && keyLower.includes('en'))
      ) {
        longDesc = valueTrimmed;
      }
    }
  }
  
  // Combinar: si hay descripción larga, usarla; si no, usar la corta
  // Si ambas existen, combinar (corta + larga)
  let result = '';
  if (longDesc && shortDesc) {
    result = `${shortDesc}\n\n${longDesc}`;
  } else if (longDesc) {
    result = longDesc;
  } else if (shortDesc) {
    result = shortDesc;
  }
  
  // Limpiar HTML antes de retornar
  return cleanHtml(result);
}

/**
 * Parsea el período de disponibilidad y lo convierte al formato de semester
 * Acepta formatos como:
 * - "enero-junio-2026" o "enero junio 2026"
 * - "junio-diciembre-2026" o "junio diciembre 2026"
 * - "Enero - Junio 2026"
 * - "Enero/Junio 2026"
 */
function parseSemesterFromPeriod(period: string | undefined): string | null {
  if (!period) return null;
  
  const periodLower = period.toLowerCase().trim();
  
  // Buscar patrones comunes
  if (periodLower.includes('enero') && periodLower.includes('junio')) {
    return 'enero-junio-2026';
  }
  
  if (periodLower.includes('junio') && periodLower.includes('diciembre')) {
    return 'junio-diciembre-2026';
  }
  
  // Si ya está en el formato correcto
  if (periodLower === 'enero-junio-2026' || periodLower === 'junio-diciembre-2026') {
    return periodLower;
  }
  
  return null;
}

async function importProperties(csvPath: string) {
  console.log(`\n📥 Leyendo propiedades desde: ${csvPath}\n`);

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Archivo no encontrado: ${csvPath}`);
    return;
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records: PropertyRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`📊 Encontradas ${records.length} propiedades para importar\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const row of records) {
    try {
      // Mapear campos del CSV a la estructura de Supabase
      // Combinar todas las imágenes de diferentes columnas
      const allImages = parseImagesFromRow(row);
      const imagesFromColumn = parseArray(row.images);
      const combinedImages = [...new Set([...allImages, ...imagesFromColumn])];
      
      const propertyData = {
        name_es: row.name_es || row.name || '',
        name_en: row.name_en || row.name || row.name_es || '',
        slug: row.slug || '',
        location_es: row.location_es || row.location || '',
        location_en: row.location_en || row.location || row.location_es || '',
        address: row.address || '',
        zone: row.zone || '',
        university: row.university || '',
        description_es: row.description_es || row.description || '',
        description_en: row.description_en || row.description || row.description_es || '',
        images: combinedImages,
        bathroom_types: parseArray(row.bathroom_types),
        available: parseBoolean(row.available),
        total_rooms: parseInt(row.total_rooms || '0', 10),
      };

      // Validar campos requeridos
      if (!propertyData.slug || !propertyData.name_es) {
        console.error(`⚠️  Saltando propiedad: falta slug o nombre`);
        errorCount++;
        continue;
      }

      // Insertar en Supabase
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();

      if (error) {
        // Si el error es por duplicado, intentar actualizar
        if (error.code === '23505' || error.message.includes('duplicate')) {
          console.log(`⚠️  Propiedad ya existe: ${propertyData.slug}, actualizando...`);
          
          const { error: updateError } = await supabase
            .from('properties')
            .update(propertyData)
            .eq('slug', propertyData.slug);

          if (updateError) {
            console.error(`✗ Error actualizando ${propertyData.slug}:`, updateError.message);
            errorCount++;
          } else {
            console.log(`✓ Propiedad actualizada: ${propertyData.name_es}`);
            successCount++;
          }
        } else {
          console.error(`✗ Error importando ${propertyData.slug}:`, error.message);
          errorCount++;
        }
      } else {
        console.log(`✓ Propiedad importada: ${propertyData.name_es}`);
        successCount++;
      }
    } catch (error: any) {
      console.error(`✗ Error procesando fila:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✅ Propiedades: ${successCount} importadas, ${errorCount} errores\n`);
}

async function importRooms(csvPath: string) {
  console.log(`\n📥 Leyendo habitaciones desde: ${csvPath}\n`);

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Archivo no encontrado: ${csvPath}`);
    return;
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records: RoomRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`📊 Encontradas ${records.length} habitaciones para importar\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const row of records) {
    try {
      // Buscar la propiedad
      let propertyId: string | null = null;
      
      // Buscar property_slug, property_id, Slug, o slug (case insensitive)
      const propertySlug = row.property_slug || row.Slug || row.slug || row.property_id;
      
      if (row.property_id && !row.property_slug && !row.Slug && !row.slug) {
        // Si solo tiene property_id (UUID), usarlo directamente
        propertyId = row.property_id;
      } else if (propertySlug) {
        // Buscar por slug
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('id')
          .eq('slug', propertySlug)
          .single();

        if (propertyError || !property) {
          console.error(`✗ Propiedad no encontrada: ${propertySlug}`);
          errorCount++;
          continue;
        }
        propertyId = property.id;
      } else {
        console.error(`⚠️  Saltando habitación: falta property_slug, property_id, Slug o slug`);
        errorCount++;
        continue;
      }

      // Combinar todas las imágenes de diferentes columnas
      const allImages = parseImagesFromRow(row);
      const imagesFromColumn = parseArray(row.images);
      const combinedImages = [...new Set([...allImages, ...imagesFromColumn])];
      
      // Buscar descripciones (corta y larga) y combinarlas
      let descriptionEs = parseDescriptionFromRow(row, 'es') || row.description_es || row.description || '';
      let descriptionEn = parseDescriptionFromRow(row, 'en') || row.description_en || row.description || descriptionEs;
      
      // Limpiar HTML si no fue procesado por parseDescriptionFromRow
      if (descriptionEs && !descriptionEs.includes('<')) {
        // Si no tiene HTML, no necesita limpieza
      } else {
        descriptionEs = cleanHtml(descriptionEs);
      }
      if (descriptionEn && !descriptionEn.includes('<')) {
        // Si no tiene HTML, no necesita limpieza
      } else {
        descriptionEn = cleanHtml(descriptionEn);
      }
      
      // Buscar período de disponibilidad
      let semester = row.semester || null;
      if (!semester) {
        // Buscar en columnas que contengan "periodo", "disponibilidad", "period", "availability"
        for (const [key, value] of Object.entries(row)) {
          if (!value || typeof value !== 'string') continue;
          const keyLower = key.toLowerCase();
          if (
            keyLower.includes('periodo') || 
            keyLower.includes('disponibilidad') || 
            keyLower.includes('period') || 
            keyLower.includes('availability') ||
            keyLower.includes('semestre')
          ) {
            semester = parseSemesterFromPeriod(value as string);
            if (semester) break;
          }
        }
      } else {
        semester = parseSemesterFromPeriod(semester);
      }
      
      const roomData = {
        property_id: propertyId,
        room_number: row.room_number || '',
        type: (row.type?.toLowerCase() === 'private' || row.type?.toLowerCase() === 'shared') 
          ? row.type.toLowerCase() 
          : 'private',
        bathroom_type: (row.bathroom_type?.toLowerCase() === 'private' || row.bathroom_type?.toLowerCase() === 'shared')
          ? row.bathroom_type.toLowerCase()
          : 'private',
        description_es: descriptionEs,
        description_en: descriptionEn,
        images: combinedImages,
        available: parseBoolean(row.available),
        semester: semester,
        amenities: parseArray(row.amenities),
      };

      // Validar campos requeridos
      if (!roomData.room_number) {
        console.error(`⚠️  Saltando habitación: falta room_number`);
        errorCount++;
        continue;
      }

      // Insertar en Supabase
      const { error } = await supabase
        .from('rooms')
        .insert(roomData);

      if (error) {
        console.error(`✗ Error importando habitación ${roomData.room_number}:`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Habitación importada: ${roomData.room_number} (${row.property_slug || propertyId})`);
        successCount++;
      }
    } catch (error: any) {
      console.error(`✗ Error procesando fila:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✅ Habitaciones: ${successCount} importadas, ${errorCount} errores\n`);
}

/**
 * Detecta si un archivo CSV es de habitaciones o propiedades
 * basándose en las columnas que contiene
 */
function detectFileType(csvPath: string): 'rooms' | 'properties' | null {
  if (!fs.existsSync(csvPath)) return null;
  
  try {
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      to: 1, // Solo leer la primera fila (headers)
    });
    
    if (records.length === 0) return null;
    
    const headers = Object.keys(records[0] || {});
    const headersLower = headers.map(h => h.toLowerCase());
    
    // Si tiene property_slug, property_id, Slug, slug o room_number, es de habitaciones
    if (
      headersLower.includes('property_slug') || 
      headersLower.includes('property_id') || 
      headersLower.includes('room_number') ||
      (headersLower.includes('slug') && headersLower.includes('room_number'))
    ) {
      return 'rooms';
    }
    
    // Si tiene slug y name_es o name, es de propiedades
    if (headersLower.includes('slug') && (headersLower.includes('name_es') || headersLower.includes('name'))) {
      return 'properties';
    }
    
    return null;
  } catch {
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('📝 Uso: npx tsx scripts/import-csv-supabase.ts <archivo-properties.csv> [archivo-rooms.csv]');
    console.log('   O: npx tsx scripts/import-csv-supabase.ts <archivo-rooms.csv> (solo habitaciones)');
    console.log('');
    console.log('Ejemplo:');
    console.log('  npx tsx scripts/import-csv-supabase.ts webflow-properties.csv webflow-rooms.csv');
    console.log('  npx tsx scripts/import-csv-supabase.ts export-habitaciones.csv');
    console.log('');
    console.log('Nota: Coloca los archivos CSV en el directorio scripts/ o proporciona la ruta completa');
    process.exit(1);
  }

  // Manejar rutas: si ya incluye 'scripts/', usar directamente, sino agregarlo
  let firstPath: string;
  if (path.isAbsolute(args[0])) {
    firstPath = args[0];
  } else if (args[0].includes('scripts/') || args[0].includes('scripts\\')) {
    firstPath = path.join(process.cwd(), args[0]);
  } else {
    firstPath = path.join(process.cwd(), 'scripts', args[0]);
  }

  // Detectar tipo de archivo
  const firstFileType = detectFileType(firstPath);
  
  if (firstFileType === 'rooms') {
    // Si el primer archivo es de habitaciones, importarlo directamente
    console.log('📋 Detectado: Archivo de habitaciones\n');
    await importRooms(firstPath);
  } else if (firstFileType === 'properties') {
    // Si es de propiedades, importar propiedades y luego habitaciones si hay
    await importProperties(firstPath);

    if (args[1]) {
      let roomsPath: string;
      if (path.isAbsolute(args[1])) {
        roomsPath = args[1];
      } else if (args[1].includes('scripts/') || args[1].includes('scripts\\')) {
        roomsPath = path.join(process.cwd(), args[1]);
      } else {
        roomsPath = path.join(process.cwd(), 'scripts', args[1]);
      }
      
      await importRooms(roomsPath);
    }
  } else {
    // Si no se puede detectar, intentar como propiedades primero
    console.log('⚠️  No se pudo detectar el tipo de archivo, intentando como propiedades...\n');
    await importProperties(firstPath);

    if (args[1]) {
      let roomsPath: string;
      if (path.isAbsolute(args[1])) {
        roomsPath = args[1];
      } else if (args[1].includes('scripts/') || args[1].includes('scripts\\')) {
        roomsPath = path.join(process.cwd(), args[1]);
      } else {
        roomsPath = path.join(process.cwd(), 'scripts', args[1]);
      }
      
      await importRooms(roomsPath);
    }
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  ✅ IMPORTACIÓN COMPLETADA');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main();

