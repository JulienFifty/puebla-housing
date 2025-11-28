/**
 * Script para obtener coordenadas exactas de universidades usando Mapbox Geocoding API
 * 
 * Uso:
 * 1. Asegúrate de tener NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN en .env.local
 * 2. Ejecuta: npx tsx scripts/geocodificar-universidades.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

interface University {
  name: string;
  address: string;
}

const universities: University[] = [
  {
    name: 'BUAP - Benemérita Universidad Autónoma de Puebla',
    address: 'Ciudad Universitaria, Puebla, Puebla, México'
  },
  {
    name: 'UDLAP - Universidad de las Américas Puebla',
    address: 'Ex Hacienda Santa Catarina Mártir, Cholula, Puebla, México'
  },
  {
    name: 'Universidad Popular Autónoma del Estado de Puebla',
    address: '21 Sur 1103, Col. Santiago, Puebla, Puebla, México'
  },
  {
    name: 'Instituto Tecnológico de Puebla',
    address: 'Av. Tecnológico 420, Maravillas, Puebla, Puebla, México'
  },
  {
    name: 'Universidad Iberoamericana Puebla',
    address: 'Boulevard del Niño Poblano 2901, Reserva Territorial Atlixcáyotl, Puebla, Puebla, México'
  }
];

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  if (!token) {
    console.error('❌ Error: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN no encontrada en .env.local');
    return null;
  }

  const query = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&country=MX&limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    } else {
      console.warn(`⚠️ No se encontraron resultados para: ${address}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error al geocodificar "${address}":`, error);
    return null;
  }
}

async function main() {
  console.log('\n=== Geocodificación de Universidades en Puebla ===\n');

  const results: Array<{ name: string; lat: number; lng: number }> = [];

  for (const university of universities) {
    console.log(`📍 Geocodificando: ${university.name}...`);
    const coords = await geocodeAddress(university.address);
    
    if (coords) {
      results.push({
        name: university.name,
        lat: coords.lat,
        lng: coords.lng
      });
      console.log(`   ✅ Coordenadas: ${coords.lat}, ${coords.lng}\n`);
    } else {
      console.log(`   ❌ No se pudieron obtener coordenadas\n`);
    }

    // Esperar un poco para no exceder límites de la API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n=== Resultados ===\n');
  console.log('Copia y pega esto en components/NearbyLocationsMap.tsx:\n');
  console.log('university: [');
  results.forEach((result, index) => {
    const isLast = index === results.length - 1;
    const name = result.name.split(' - ')[0]; // Solo el nombre corto
    console.log(`  // ${name}`);
    console.log(`  { name: '${result.name}', distance: 0.5, category: 'university', lat: ${result.lat.toFixed(6)}, lng: ${result.lng.toFixed(6)} }${isLast ? '' : ','}`);
  });
  console.log('],\n');
}

main().catch(console.error);




