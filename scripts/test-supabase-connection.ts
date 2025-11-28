/**
 * Script para probar la conexión con Supabase
 * 
 * Uso: npx tsx scripts/test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

console.log('🔍 Verificando configuración de Supabase...\n');

// Verificar que las variables estén definidas
if (!supabaseUrl) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL no está configurada');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurada');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está configurada');
  process.exit(1);
}

console.log('✅ Variables de entorno encontradas');
console.log(`   URL: ${supabaseUrl?.substring(0, 30)}...`);
console.log(`   Anon Key: ${supabaseAnonKey?.substring(0, 20)}... (${supabaseAnonKey?.length} caracteres)`);
console.log(`   Service Role Key: ${serviceRoleKey?.substring(0, 20)}... (${serviceRoleKey?.length} caracteres)`);

// Verificar formato de las keys (deben ser JWT tokens)
if (!supabaseAnonKey?.startsWith('eyJ')) {
  console.warn('⚠️  Advertencia: Anon Key no parece ser un JWT válido');
}
if (!serviceRoleKey?.startsWith('eyJ')) {
  console.warn('⚠️  Advertencia: Service Role Key no parece ser un JWT válido');
}

// Verificar si la Service Role Key tiene el tamaño correcto (normalmente 200-300 caracteres)
if (serviceRoleKey && serviceRoleKey.length > 400) {
  console.warn('⚠️  Advertencia: Service Role Key parece muy larga');
  console.warn('   Esto podría indicar espacios o saltos de línea en el archivo .env.local');
  console.warn('   Verifica que la línea SUPABASE_SERVICE_ROLE_KEY=... no tenga espacios antes o después del =');
  console.warn(`   Primeros 50 caracteres: ${serviceRoleKey.substring(0, 50)}`);
  console.warn(`   Últimos 50 caracteres: ${serviceRoleKey.substring(serviceRoleKey.length - 50)}`);
}
console.log('');

// Probar conexión con anon key
console.log('🔌 Probando conexión con Anon Key...');
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Primero verificar que podemos hacer una petición básica a la API
    console.log('   Verificando respuesta del servidor...');
    const healthCheck = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
      }
    });

    if (!healthCheck.ok && healthCheck.status !== 404) {
      console.error(`❌ Error al conectar con Supabase: ${healthCheck.status}`);
      return;
    }

    console.log('✅ Servidor de Supabase responde correctamente');

    // Probar una consulta simple a la tabla profiles
    const { data, error } = await supabaseAnon
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      // Si la tabla no existe, es un error esperado pero la conexión funciona
      if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message.includes('does not exist') || error.message.includes('schema cache')) {
        console.log('⚠️  La tabla "profiles" no existe aún');
        console.log('   Esto es normal si no has ejecutado el SQL de creación de tablas');
        console.log('   La conexión con Supabase funciona correctamente ✅\n');
      } else {
        console.error('❌ Error en la conexión:', error.message);
        console.error('   Código:', error.code);
        return;
      }
    } else {
      console.log('✅ Conexión exitosa con Anon Key');
      console.log('   La tabla "profiles" existe y es accesible\n');
    }

    // Probar conexión con service role key
    console.log('🔌 Probando conexión con Service Role Key...');
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1);

    if (adminError) {
      if (adminError.code === 'PGRST116' || adminError.code === 'PGRST205' || adminError.message.includes('does not exist') || adminError.message.includes('schema cache')) {
        console.log('⚠️  La tabla "profiles" no existe aún');
        console.log('   La conexión con Service Role Key funciona correctamente ✅\n');
      } else {
        console.error('❌ Error con Service Role Key:', adminError.message);
        console.error('   Código:', adminError.code);
        return;
      }
    } else {
      console.log('✅ Conexión exitosa con Service Role Key\n');
    }

    // Verificar autenticación con Service Role Key
    console.log('🔐 Verificando servicio de autenticación con Service Role Key...');
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1
      });

      if (authError) {
        console.error('❌ Error al verificar autenticación:', authError.message);
        console.error('   Esto podría indicar que la Service Role Key es incorrecta');
        console.error('   Verifica que copiaste la clave correcta desde Supabase Dashboard\n');
      } else {
        console.log('✅ Servicio de autenticación funcionando correctamente');
        console.log(`   Usuarios en el sistema: ${authData.users.length > 0 ? authData.users.length : '0 (o más)'}\n`);
      }
    } catch (authErr: any) {
      console.error('❌ Error al acceder al servicio de autenticación:', authErr.message);
      console.error('   Verifica que la Service Role Key sea correcta\n');
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  ✅ CONEXIÓN CON SUPABASE EXITOSA');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    console.log('📋 Próximos pasos:');
    console.log('   1. Si las tablas no existen, ejecuta el SQL en Supabase Dashboard');
    console.log('   2. Crea un usuario administrador con: npm run create-admin-supabase');
    console.log('   3. Inicia el servidor con: npm run dev\n');

  } catch (error: any) {
    console.error('❌ Error inesperado:', error.message);
    console.error(error);
  }
}

testConnection();

