/**
 * Script simplificado para crear un usuario administrador en Supabase
 * 
 * Uso: npx tsx scripts/create-admin-simple-supabase.ts <email> <password> [name]
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar configuradas en .env.local');
  process.exit(1);
}

// Usar service role key para poder crear usuarios directamente
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('📝 Uso: npx tsx scripts/create-admin-simple-supabase.ts <email> <password> [name]');
    console.log('');
    console.log('Ejemplo:');
    console.log('  npx tsx scripts/create-admin-simple-supabase.ts admin@ejemplo.com miPassword123 "Juan Pérez"');
    process.exit(1);
  }

  const email = args[0];
  const password = args[1];
  const name = args[2] || null;

  try {
    console.log('🔐 Creando usuario administrador en Supabase...\n');
    console.log(`   Email: ${email}`);
    console.log(`   Nombre: ${name || '(no especificado)'}\n`);

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automáticamente
    });

    if (authError) {
      console.error('❌ Error creando usuario:', authError.message);
      process.exit(1);
    }

    if (!authData.user) {
      console.error('❌ Error: No se pudo crear el usuario');
      process.exit(1);
    }

    // Crear o actualizar perfil en la tabla profiles
    // Usar upsert para manejar el caso donde el perfil ya existe (por el trigger)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: authData.user.email,
        name: name || null,
        role: 'owner',
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('❌ Error creando/actualizando perfil:', profileError.message);
      // No eliminar el usuario si el perfil ya existe (es normal)
      if (!profileError.message.includes('duplicate key')) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        process.exit(1);
      } else {
        console.log('⚠️  El perfil ya existía, se actualizó con los nuevos datos');
      }
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  ✅ USUARIO CREADO EXITOSAMENTE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`   Email: ${email}`);
    console.log(`   ID: ${authData.user.id}`);
    console.log(`   Rol: owner\n`);
    console.log('📋 Próximos pasos:');
    console.log('   1. Inicia sesión en: http://localhost:3001/dashboard/login');
    console.log('   2. Usa el email y contraseña que acabas de crear\n');

  } catch (error: any) {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  }
}

main();

