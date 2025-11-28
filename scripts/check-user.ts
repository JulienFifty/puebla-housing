/**
 * Script para verificar el estado de un usuario en Supabase
 * 
 * Uso: npx tsx scripts/check-user.ts <email>
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
  const email = process.argv[2];

  if (!email) {
    console.log('📝 Uso: npx tsx scripts/check-user.ts <email>');
    process.exit(1);
  }

  try {
    console.log(`🔍 Verificando usuario: ${email}\n`);

    // Listar usuarios
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Error listando usuarios:', listError.message);
      return;
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      console.log('❌ Usuario no encontrado');
      console.log('\n📋 Usuarios disponibles:');
      users.users.forEach(u => {
        console.log(`   - ${u.email} (ID: ${u.id})`);
      });
      return;
    }

    console.log('✅ Usuario encontrado:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Email confirmado: ${user.email_confirmed_at ? '✅ Sí' : '❌ No'}`);
    console.log(`   Creado: ${user.created_at}`);
    console.log(`   Última actualización: ${user.updated_at}`);
    console.log(`   Último inicio de sesión: ${user.last_sign_in_at || 'Nunca'}`);

    // Verificar perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log('\n⚠️  Perfil no encontrado en la tabla profiles');
    } else {
      console.log('\n✅ Perfil encontrado:');
      console.log(`   Nombre: ${profile.name || '(no especificado)'}`);
      console.log(`   Rol: ${profile.role}`);
    }

    if (!user.email_confirmed_at) {
      console.log('\n⚠️  ADVERTENCIA: El email no está confirmado');
      console.log('   Esto puede causar problemas al iniciar sesión.');
      console.log('\n💡 Solución: Confirmar el email manualmente o recrear el usuario');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

main();




