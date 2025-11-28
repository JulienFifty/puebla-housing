import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

function verificarMapboxToken() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  console.log('\n--- Verificación de Mapbox Access Token ---');

  if (!token) {
    console.error('❌ Error: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN no encontrada en .env.local');
    console.log('Por favor, agrega tu Access Token de Mapbox al archivo .env.local de la siguiente manera:');
    console.log('\nNEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_access_token_aqui\n');
    console.log('Para obtener tu token gratuito:');
    console.log('  1. Ve a https://account.mapbox.com/');
    console.log('  2. Crea una cuenta (es gratis)');
    console.log('  3. Copia tu "Default public token"');
    console.log('  4. Agrega la línea anterior a .env.local');
    console.log('\nAsegúrate de que:');
    console.log('  - El nombre sea exactamente `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`');
    console.log('  - Empiece con `NEXT_PUBLIC_` para que esté disponible en el cliente');
    console.log('  - No tenga comillas alrededor del valor');
    console.log('  - No tenga espacios antes o después del `=`');
    console.log('\nDespués de agregarla, reinicia tu servidor de desarrollo (Ctrl+C y `npm run dev`).');
    return false;
  }

  if (token.trim().length === 0) {
    console.error('❌ Error: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN está vacía en .env.local');
    console.log('Por favor, asegúrate de que el valor de tu Access Token no esté vacío.');
    return false;
  }

  if (!token.startsWith('pk.')) {
    console.warn('⚠️ Advertencia: El Access Token no parece tener el formato estándar de Mapbox (pk....).');
    console.warn('Verifica que el Access Token sea correcto.');
  }

  console.log('✅ NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN encontrada y parece tener un formato válido.');
  console.log('Valor (parcial):', token.substring(0, 10) + '...');
  console.log('\nPasos adicionales para asegurar el funcionamiento del mapa:');
  console.log('1. En tu cuenta de Mapbox, asegúrate de que el token tenga permisos de lectura.');
  console.log('2. El plan gratuito incluye 50,000 cargas de mapa por mes, suficiente para desarrollo.');
  console.log('3. Reinicia tu servidor de desarrollo (Ctrl+C y `npm run dev`) para que los cambios surtan efecto.');
  return true;
}

verificarMapboxToken();




