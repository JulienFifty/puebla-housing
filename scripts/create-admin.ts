/**
 * Script para crear un usuario administrador
 * 
 * Uso: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

// Usar Prisma Client con la configuración estándar
// Para scripts, necesitamos pasar la URL directamente
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    },
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
    console.log('Crear usuario administrador\n');

    const email = await question('Email: ');
    const password = await question('Contraseña: ');
    const name = await question('Nombre (opcional): ');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'owner',
      },
    });

    console.log(`\n✓ Usuario creado: ${user.email}`);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error('✗ Error: Este email ya está registrado');
    } else {
      console.error('✗ Error:', error.message);
    }
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();

