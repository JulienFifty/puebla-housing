/**
 * Script para actualizar las áreas comunes de la casa Mariachi
 * 
 * Ejecutar con: npx tsx scripts/update-mariachi-common-areas.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno');
  console.error('Necesitas: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const commonAreas = [
  'Terraza',
  'Patio',
  'Jardín',
  'Roof garden',
  'Asador',
  'Salas',
  'Cocinas',
  'Zona de ejercicio'
];

async function updateMariachiCommonAreas() {
  try {
    console.log('🔍 Buscando casa Mariachi...');
    
    // Buscar la propiedad por slug
    const { data: property, error: fetchError } = await supabase
      .from('properties')
      .select('id, name_es, slug')
      .eq('slug', 'mariachi')
      .single();

    if (fetchError || !property) {
      console.error('❌ Error: No se encontró la casa Mariachi');
      console.error(fetchError);
      process.exit(1);
    }

    console.log(`✅ Casa encontrada: ${property.name_es} (${property.slug})`);

    // Actualizar las áreas comunes
    console.log('📝 Actualizando áreas comunes...');
    const { data, error: updateError } = await supabase
      .from('properties')
      .update({ common_areas: commonAreas })
      .eq('slug', 'mariachi')
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error al actualizar:', updateError);
      process.exit(1);
    }

    console.log('✅ Áreas comunes actualizadas exitosamente!');
    console.log('\n📋 Áreas comunes agregadas:');
    data.common_areas.forEach((area: string, index: number) => {
      console.log(`   ${index + 1}. ${area}`);
    });
    
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

updateMariachiCommonAreas();

