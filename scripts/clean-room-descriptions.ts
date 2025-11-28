/**
 * Script para limpiar el HTML de las descripciones de habitaciones
 * Remueve atributos id="" vacíos y limpia el HTML
 * 
 * Uso: npx tsx scripts/clean-room-descriptions.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

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

async function cleanRoomDescriptions() {
  console.log('\n🧹 Limpiando descripciones de habitaciones...\n');

  // Obtener todas las habitaciones
  const { data: rooms, error: fetchError } = await supabase
    .from('rooms')
    .select('id, description_es, description_en');

  if (fetchError) {
    console.error('❌ Error obteniendo habitaciones:', fetchError.message);
    process.exit(1);
  }

  if (!rooms || rooms.length === 0) {
    console.log('⚠️  No se encontraron habitaciones');
    return;
  }

  console.log(`📊 Encontradas ${rooms.length} habitaciones para limpiar\n`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const room of rooms) {
    try {
      const cleanedEs = cleanHtml(room.description_es || '');
      const cleanedEn = cleanHtml(room.description_en || '');

      // Solo actualizar si hubo cambios
      if (cleanedEs !== room.description_es || cleanedEn !== room.description_en) {
        const { error: updateError } = await supabase
          .from('rooms')
          .update({
            description_es: cleanedEs,
            description_en: cleanedEn,
          })
          .eq('id', room.id);

        if (updateError) {
          console.error(`✗ Error actualizando habitación ${room.id}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✓ Habitación ${room.id} limpiada`);
          updatedCount++;
        }
      }
    } catch (error: any) {
      console.error(`✗ Error procesando habitación ${room.id}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✅ Limpieza completada: ${updatedCount} actualizadas, ${errorCount} errores\n`);
}

cleanRoomDescriptions();

