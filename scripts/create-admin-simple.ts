/**
 * Script simplificado para crear un usuario administrador
 * Usa SQLite directamente sin Prisma Client
 */

import * as readline from 'readline';
import * as bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import * as path from 'path';

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const db = new Database(dbPath);

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

    // Verificar si el usuario ya existe
    const existing = db.prepare('SELECT id FROM User WHERE email = ?').get(email);
    if (existing) {
      console.error('✗ Error: Este email ya está registrado');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    db.prepare(
      'INSERT INTO User (id, email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(
      id,
      email,
      hashedPassword,
      name || null,
      'owner',
      new Date().toISOString(),
      new Date().toISOString()
    );

    console.log(`\n✓ Usuario creado: ${email}`);
  } catch (error: any) {
    console.error('✗ Error:', error.message);
  } finally {
    rl.close();
    db.close();
  }
}

main();

