#!/usr/bin/env tsx
/**
 * Script para traducir automáticamente archivos JSON de traducción
 * Usa OpenAI API (o puedes cambiarlo a Claude/DeepL)
 * 
 * Uso:
 *   npm run translate:auto
 * 
 * Requiere:
 *   - OPENAI_API_KEY en .env.local
 *   - Archivo base: messages/es.json (o el idioma que quieras usar como base)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BASE_LOCALE = 'es'; // Idioma base
const TARGET_LOCALES = ['en', 'fr']; // Idiomas a traducir

interface TranslationResult {
  [key: string]: any;
}

/**
 * Traduce un objeto JSON usando OpenAI
 */
async function translateWithOpenAI(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'es'
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada en .env.local');
  }

  const languageNames: { [key: string]: string } = {
    es: 'español',
    en: 'inglés',
    fr: 'francés',
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // Más barato, puedes usar 'gpt-4' para mejor calidad
      messages: [
        {
          role: 'system',
          content: `Eres un traductor profesional. Traduce el texto del ${languageNames[sourceLanguage]} al ${languageNames[targetLanguage]}. 
Mantén el mismo tono, estilo y formato. Si es un JSON, mantén la estructura exacta.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3, // Más determinista
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error de OpenAI: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

/**
 * Traduce recursivamente un objeto JSON
 */
async function translateObject(
  obj: any,
  targetLanguage: string,
  sourceLanguage: string = 'es'
): Promise<any> {
  if (typeof obj === 'string') {
    // Si es un string simple, traducirlo
    if (obj.trim().length === 0) return obj;
    return await translateWithOpenAI(obj, targetLanguage, sourceLanguage);
  } else if (Array.isArray(obj)) {
    // Si es un array, traducir cada elemento
    return Promise.all(
      obj.map((item) => translateObject(item, targetLanguage, sourceLanguage))
    );
  } else if (obj !== null && typeof obj === 'object') {
    // Si es un objeto, traducir recursivamente cada propiedad
    const translated: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // No traducir las keys, solo los valores
      translated[key] = await translateObject(value, targetLanguage, sourceLanguage);
      // Pequeña pausa para no sobrecargar la API
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return translated;
  } else {
    // Números, booleanos, null, etc. se mantienen igual
    return obj;
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando traducción automática...\n');

  if (!OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY no está configurada en .env.local');
    console.log('\n💡 Para usar este script:');
    console.log('1. Obtén una API key de OpenAI: https://platform.openai.com/api-keys');
    console.log('2. Agrega OPENAI_API_KEY=tu_key_aqui a .env.local');
    process.exit(1);
  }

  const messagesDir = path.join(process.cwd(), 'messages');
  const baseFile = path.join(messagesDir, `${BASE_LOCALE}.json`);

  if (!fs.existsSync(baseFile)) {
    console.error(`❌ Error: No se encontró ${baseFile}`);
    process.exit(1);
  }

  // Leer archivo base
  const baseContent = JSON.parse(fs.readFileSync(baseFile, 'utf-8'));
  console.log(`✅ Archivo base cargado: ${BASE_LOCALE}.json\n`);

  // Traducir a cada idioma objetivo
  for (const targetLocale of TARGET_LOCALES) {
    console.log(`📝 Traduciendo a ${targetLocale}...`);
    
    const targetFile = path.join(messagesDir, `${targetLocale}.json`);
    const existingContent = fs.existsSync(targetFile)
      ? JSON.parse(fs.readFileSync(targetFile, 'utf-8'))
      : {};

    try {
      // Traducir el contenido
      const translated = await translateObject(baseContent, targetLocale, BASE_LOCALE);

      // Combinar con contenido existente (preservar traducciones manuales)
      const merged = { ...existingContent, ...translated };

      // Guardar
      fs.writeFileSync(
        targetFile,
        JSON.stringify(merged, null, 2) + '\n',
        'utf-8'
      );

      console.log(`✅ Traducción completada: ${targetLocale}.json\n`);
    } catch (error: any) {
      console.error(`❌ Error traduciendo a ${targetLocale}:`, error.message);
      console.log('⚠️  Continuando con el siguiente idioma...\n');
    }
  }

  console.log('✨ ¡Traducción automática completada!');
  console.log('\n💡 Nota: Revisa las traducciones y ajusta manualmente si es necesario.');
}

main().catch(console.error);

