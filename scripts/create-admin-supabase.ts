/**
 * Script para crear un usuario administrador en Supabase
 * 
 * Uso: npx tsx scripts/create-admin-supabase.ts
 * 
 * NOTA: Este script requiere que tengas configuradas las variables de entorno
 * NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar configuradas en .env.local');
  process.exit(1);
}

// Usar service role key para poder crear usuarios directamente
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  try {
    console.log('Crear usuario administrador en Supabase\n');

    const email = await question('Email: ');
    const password = await question('Contraseña: ');
    const name = await question('Nombre (opcional): ');

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automáticamente
    });

    if (authError) {
      console.error('✗ Error creando usuario:', authError.message);
      return;
    }

    if (!authData.user) {
      console.error('✗ Error: No se pudo crear el usuario');
      return;
    }

    // Crear perfil en la tabla profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        name: name || null,
        role: 'owner',
      });

    if (profileError) {
      console.error('✗ Error creando perfil:', profileError.message);
      // Intentar eliminar el usuario de auth si falla el perfil
      await supabase.auth.admin.deleteUser(authData.user.id);
      return;
    }

    console.log(`\n✓ Usuario creado exitosamente: ${email}`);
    console.log(`  ID: ${authData.user.id}`);
  } catch (error: any) {
    console.error('✗ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();

