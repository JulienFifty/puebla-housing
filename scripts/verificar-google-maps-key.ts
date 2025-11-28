/**
 * Script para verificar la configuración de Google Maps API Key
 * 
 * Ejecuta: npx tsx scripts/verificar-google-maps-key.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

console.log('\n🔍 Verificación de Google Maps API Key\n');
console.log('=' .repeat(50));

if (!apiKey) {
  console.log('❌ ERROR: La variable NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no está configurada\n');
  console.log('📝 Pasos para configurarla:');
  console.log('   1. Abre el archivo .env.local');
  console.log('   2. Agrega esta línea:');
  console.log('      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui');
  console.log('   3. Reemplaza "tu_api_key_aqui" con tu API key real');
  console.log('   4. Guarda el archivo');
  console.log('   5. Reinicia el servidor de desarrollo (npm run dev)\n');
  process.exit(1);
}

console.log('✅ Variable encontrada en .env.local');
console.log(`   Longitud: ${apiKey.length} caracteres`);
console.log(`   Primeros 10 caracteres: ${apiKey.substring(0, 10)}...`);

// Verificar formato básico
if (apiKey.length < 20) {
  console.log('⚠️  ADVERTENCIA: La API key parece muy corta. Verifica que sea correcta.\n');
}

// Verificar que no tenga espacios
if (apiKey.includes(' ') || apiKey.includes('\n') || apiKey.includes('\r')) {
  console.log('⚠️  ADVERTENCIA: La API key contiene espacios o saltos de línea. Asegúrate de que esté en una sola línea.\n');
}

console.log('\n📋 Próximos pasos:');
console.log('   1. Ve a Google Cloud Console: https://console.cloud.google.com/');
console.log('   2. Verifica que estas APIs estén habilitadas:');
console.log('      - Maps Embed API (obligatoria)');
console.log('      - Maps JavaScript API (opcional)');
console.log('   3. Verifica las restricciones de tu API key');
console.log('   4. Reinicia el servidor de desarrollo\n');

console.log('🧪 Prueba la API key con esta URL:');
console.log(`   https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=Puebla,Mexico&zoom=12\n`);

console.log('=' .repeat(50));
console.log('✅ Verificación completada\n');




