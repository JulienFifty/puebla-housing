/**
 * Script para resetear la contraseña de un usuario en Supabase
 * 
 * Uso: npx tsx scripts/reset-password.ts <email> <nueva-contraseña>
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
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('📝 Uso: npx tsx scripts/reset-password.ts <email> <nueva-contraseña>');
    console.log('');
    console.log('Ejemplo:');
    console.log('  npx tsx scripts/reset-password.ts jthibo49@gmail.com MiNuevaPassword123');
    process.exit(1);
  }

  try {
    console.log(`🔐 Reseteando contraseña para: ${email}\n`);

    // Buscar usuario
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listando usuarios:', listError.message);
      return;
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      console.error('❌ Usuario no encontrado');
      return;
    }

    // Actualizar contraseña
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      console.error('❌ Error actualizando contraseña:', error.message);
      return;
    }

    console.log('✅ Contraseña actualizada exitosamente');
    console.log(`   Email: ${email}`);
    console.log(`   Nueva contraseña: ${newPassword}`);
    console.log('\n📋 Ahora puedes iniciar sesión con estas credenciales');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

main();




