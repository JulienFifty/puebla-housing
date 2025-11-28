/**
 * Script para confirmar el email de un usuario en Supabase
 * 
 * Uso: npx tsx scripts/confirm-user-email.ts <email>
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  console.error('   Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('📝 Uso: npx tsx scripts/confirm-user-email.ts <email>');
    process.exit(1);
  }

  const email = args[0];

  try {
    console.log(`🔍 Buscando usuario con email: ${email}...\n`);

    // Buscar usuario por email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Error listando usuarios:', listError.message);
      process.exit(1);
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      console.error(`❌ No se encontró usuario con email: ${email}`);
      console.log('\n💡 Usuarios disponibles:');
      users.users.forEach(u => {
        console.log(`   - ${u.email} (${u.email_confirmed_at ? '✅ confirmado' : '❌ no confirmado'})`);
      });
      process.exit(1);
    }

    if (user.email_confirmed_at) {
      console.log('✅ El email de este usuario ya está confirmado');
      console.log(`   Confirmado el: ${new Date(user.email_confirmed_at).toLocaleString()}`);
      process.exit(0);
    }

    console.log('📧 Confirmando email del usuario...\n');

    // Confirmar email del usuario
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    });

    if (error) {
      console.error('❌ Error confirmando email:', error.message);
      process.exit(1);
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  ✅ EMAIL CONFIRMADO EXITOSAMENTE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`   Email: ${email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Estado: ✅ Email confirmado\n`);
    console.log('💡 El usuario ahora puede iniciar sesión normalmente.\n');

  } catch (error: any) {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  }
}

main();

