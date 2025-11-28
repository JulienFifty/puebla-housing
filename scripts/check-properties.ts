/**
 * Script para verificar propiedades en Supabase
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

async function main() {
  console.log('🔍 Verificando propiedades en Supabase...\n');

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error.message);
    console.error('   Código:', error.code);
    return;
  }

  console.log(`✅ Encontradas ${data?.length || 0} propiedades:\n`);

  if (data && data.length > 0) {
    data.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.name_es} (${prop.slug})`);
      console.log(`   ID: ${prop.id}`);
      console.log(`   Ubicación: ${prop.location_es}`);
      console.log(`   Habitaciones: ${prop.total_rooms || 0}`);
      console.log(`   Disponible: ${prop.available ? 'Sí' : 'No'}`);
      console.log('');
    });
  } else {
    console.log('⚠️  No hay propiedades en la base de datos');
  }
}

main();




