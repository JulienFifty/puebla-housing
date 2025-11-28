/**
 * Script para verificar cómo se ven las descripciones de habitaciones
 * 
 * Uso: npx tsx scripts/check-room-description.ts
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

async function checkRoomDescriptions() {
  console.log('\n🔍 Verificando descripciones de habitaciones...\n');

  // Buscar habitaciones con el texto específico que mencionó el usuario
  const { data: roomsWithText, error: searchError } = await supabase
    .from('rooms')
    .select('id, room_number, description_es, description_en')
    .ilike('description_es', '%Habitación luminosa%')
    .limit(5);

  if (searchError) {
    console.error('❌ Error buscando habitaciones:', searchError.message);
  }

  // También obtener todas las habitaciones que tengan HTML
  const { data: allRooms, error: fetchError } = await supabase
    .from('rooms')
    .select('id, room_number, description_es, description_en')
    .limit(10);

  if (fetchError) {
    console.error('❌ Error obteniendo habitaciones:', fetchError.message);
    process.exit(1);
  }

  if (!allRooms || allRooms.length === 0) {
    console.log('⚠️  No se encontraron habitaciones');
    return;
  }

  // Filtrar habitaciones que tengan HTML
  const roomsWithHtml = allRooms.filter(r => 
    (r.description_es && r.description_es.includes('<')) || 
    (r.description_en && r.description_en.includes('<'))
  );

  // Si encontramos habitaciones con el texto específico, mostrarlas primero
  if (roomsWithText && roomsWithText.length > 0) {
    console.log(`📋 Encontradas ${roomsWithText.length} habitaciones con "Habitación luminosa"\n`);
    for (const room of roomsWithText) {
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`Habitación #${room.room_number} (ID: ${room.id.substring(0, 8)}...)`);
      console.log('═══════════════════════════════════════════════════════════════');
      
      const descEs = room.description_es || '(vacía)';
      console.log('\n📝 Descripción (ES):');
      console.log('─'.repeat(60));
      console.log(descEs.substring(0, 500) + (descEs.length > 500 ? '...' : ''));
      
      const hasEmptyIds = /id\s*=\s*["']\s*["']/i.test(descEs);
      if (hasEmptyIds) {
        console.log('\n⚠️  AÚN CONTIENE atributos id="" vacíos');
      } else {
        console.log('\n✅ Sin atributos id="" vacíos');
      }
      
      const htmlTags = (descEs.match(/<[^>]+>/g) || []).length;
      console.log(`📊 Tags HTML encontrados: ${htmlTags}`);
      console.log('\n');
    }
    return;
  }

  if (roomsWithHtml.length === 0) {
    console.log('✅ No se encontraron habitaciones con HTML');
    console.log('\nRevisando algunas habitaciones aleatorias:\n');
    
    // Mostrar las primeras 3
    for (const room of allRooms.slice(0, 3)) {
      console.log('─'.repeat(60));
      console.log(`Habitación #${room.room_number}`);
      console.log(`Descripción: ${(room.description_es || '').substring(0, 100)}...`);
      console.log('');
    }
    return;
  }

  console.log(`📊 Encontradas ${roomsWithHtml.length} habitaciones con HTML\n`);

  for (const room of roomsWithHtml.slice(0, 3)) {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`Habitación #${room.room_number} (ID: ${room.id.substring(0, 8)}...)`);
    console.log('═══════════════════════════════════════════════════════════════');
    
    console.log('\n📝 Descripción (ES):');
    console.log('─'.repeat(60));
    const descEs = room.description_es || '(vacía)';
    console.log(descEs.substring(0, 300) + (descEs.length > 300 ? '...' : ''));
    
    // Verificar si tiene atributos id="" vacíos
    const hasEmptyIds = /id\s*=\s*["']\s*["']/i.test(descEs);
    if (hasEmptyIds) {
      console.log('\n⚠️  AÚN CONTIENE atributos id="" vacíos');
    } else {
      console.log('\n✅ Sin atributos id="" vacíos');
    }
    
    // Contar tags HTML
    const htmlTags = (descEs.match(/<[^>]+>/g) || []).length;
    console.log(`📊 Tags HTML encontrados: ${htmlTags}`);
    
    // Mostrar algunos tags para verificar
    const tags = descEs.match(/<[^>]+>/g) || [];
    if (tags.length > 0) {
      console.log(`\nEjemplo de tags: ${tags.slice(0, 3).join(', ')}`);
    }
    
    console.log('\n');
  }

  console.log('═══════════════════════════════════════════════════════════════\n');
}

checkRoomDescriptions();
