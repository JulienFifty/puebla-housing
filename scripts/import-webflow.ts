/**
 * Script para importar datos de Webflow CMS a la base de datos
 * 
 * Uso:
 * 1. Exporta tus datos de Webflow CMS como JSON
 * 2. Coloca el archivo JSON en este directorio
 * 3. Ajusta el mapeo de campos según tu estructura de Webflow
 * 4. Ejecuta: npx tsx scripts/import-webflow.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface WebflowProperty {
  // Ajusta estos campos según tu estructura de Webflow
  name: string;
  nameEn?: string;
  slug: string;
  location: string;
  locationEn?: string;
  address: string;
  zone: string;
  university: string;
  description: string;
  descriptionEn?: string;
  images: string[];
  bathroomTypes: string[];
  available?: boolean;
}

interface WebflowRoom {
  // Ajusta estos campos según tu estructura de Webflow
  propertySlug: string;
  roomNumber: string;
  type: 'private' | 'shared';
  bathroomType: 'private' | 'shared';
  description: string;
  descriptionEn?: string;
  images: string[];
  available?: boolean;
  semester?: string;
  amenities: string[];
}

async function importProperties(properties: WebflowProperty[]) {
  console.log(`Importando ${properties.length} propiedades...`);

  for (const prop of properties) {
    try {
      await prisma.property.create({
        data: {
          nameEs: prop.name,
          nameEn: prop.nameEn || prop.name,
          slug: prop.slug,
          locationEs: prop.location,
          locationEn: prop.locationEn || prop.location,
          address: prop.address,
          zone: prop.zone,
          university: prop.university,
          descriptionEs: prop.description,
          descriptionEn: prop.descriptionEn || prop.description,
          images: JSON.stringify(prop.images || []),
          bathroomTypes: JSON.stringify(prop.bathroomTypes || []),
          available: prop.available ?? true,
        },
      });
      console.log(`✓ Propiedad importada: ${prop.name}`);
    } catch (error: any) {
      console.error(`✗ Error importando ${prop.name}:`, error.message);
    }
  }
}

async function importRooms(rooms: WebflowRoom[]) {
  console.log(`Importando ${rooms.length} habitaciones...`);

  for (const room of rooms) {
    try {
      // Buscar la propiedad por slug
      const property = await prisma.property.findUnique({
        where: { slug: room.propertySlug },
      });

      if (!property) {
        console.error(`✗ Propiedad no encontrada: ${room.propertySlug}`);
        continue;
      }

      await prisma.room.create({
        data: {
          propertyId: property.id,
          roomNumber: room.roomNumber,
          type: room.type,
          bathroomType: room.bathroomType,
          descriptionEs: room.description,
          descriptionEn: room.descriptionEn || room.description,
          images: JSON.stringify(room.images || []),
          available: room.available ?? true,
          semester: room.semester || null,
          amenities: JSON.stringify(room.amenities || []),
        },
      });

      // Actualizar contador de habitaciones
      await prisma.property.update({
        where: { id: property.id },
        data: {
          totalRooms: {
            increment: 1,
          },
        },
      });

      console.log(`✓ Habitación importada: ${room.roomNumber}`);
    } catch (error: any) {
      console.error(`✗ Error importando habitación ${room.roomNumber}:`, error.message);
    }
  }
}

async function main() {
  try {
    // Leer archivos JSON (ajusta las rutas según donde guardes tus datos)
    const propertiesPath = path.join(process.cwd(), 'scripts', 'webflow-properties.json');
    const roomsPath = path.join(process.cwd(), 'scripts', 'webflow-rooms.json');

    if (fs.existsSync(propertiesPath)) {
      const propertiesData = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
      await importProperties(propertiesData);
    } else {
      console.log('No se encontró webflow-properties.json');
    }

    if (fs.existsSync(roomsPath)) {
      const roomsData = JSON.parse(fs.readFileSync(roomsPath, 'utf-8'));
      await importRooms(roomsData);
    } else {
      console.log('No se encontró webflow-rooms.json');
    }

    console.log('\n✓ Importación completada');
  } catch (error) {
    console.error('Error en la importación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

