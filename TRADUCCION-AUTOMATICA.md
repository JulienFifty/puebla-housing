# 🌍 Traducción Automática

## Comparación de Métodos

### ✅ Lo que hice (Manual)
**Ventajas:**
- ✅ **Control total**: Revisas cada traducción
- ✅ **Calidad**: Traducciones precisas y contextuales
- ✅ **Sin costos**: No requiere APIs pagas
- ✅ **Mantenible**: Fácil de actualizar

**Desventajas:**
- ❌ **Lento**: Requiere tiempo manual
- ❌ **Repetitivo**: Mucho copy-paste

### 🚀 Opción Automática (Script con IA)

**Ventajas:**
- ✅ **Rápido**: Traduce todo en minutos
- ✅ **Escalable**: Fácil agregar nuevos idiomas
- ✅ **Consistente**: Mismo estilo en todas las traducciones

**Desventajas:**
- ❌ **Costo**: Requiere API key de OpenAI (~$0.01-0.10 por traducción completa)
- ❌ **Revisión necesaria**: A veces necesita ajustes manuales
- ❌ **Dependencia**: Requiere conexión a internet y API key

## 🎯 Uso del Script Automático

### 1. Configurar API Key

Agrega a `.env.local`:
```bash
OPENAI_API_KEY=sk-tu-api-key-aqui
```

Obtén tu API key en: https://platform.openai.com/api-keys

### 2. Ejecutar Traducción

```bash
npm run translate:auto
```

El script:
1. Lee `messages/es.json` como base
2. Traduce automáticamente a `en` y `fr`
3. Preserva traducciones manuales existentes
4. Guarda los archivos actualizados

### 3. Revisar y Ajustar

Después de la traducción automática, revisa los archivos:
- `messages/en.json`
- `messages/fr.json`

Ajusta manualmente si hay traducciones que no te gusten.

## 💰 Costo Estimado

Para traducir todos los archivos JSON:
- **OpenAI GPT-4o-mini**: ~$0.10 - $0.50
- **OpenAI GPT-4**: ~$1.00 - $5.00 (mejor calidad)

## 🔄 Flujo Recomendado

1. **Primera vez**: Usa el script automático para generar traducciones base
2. **Revisión**: Revisa y ajusta manualmente las traducciones importantes
3. **Actualizaciones**: Cuando agregues nuevos textos en español:
   - Ejecuta el script para traducir solo lo nuevo
   - O traduce manualmente si son pocos cambios

## 🛠️ Personalizar el Script

Puedes modificar `scripts/auto-translate.ts` para:
- Cambiar el idioma base (`BASE_LOCALE`)
- Agregar más idiomas (`TARGET_LOCALES`)
- Usar otro modelo de IA (Claude, DeepL, etc.)
- Ajustar la temperatura (creatividad) de las traducciones

## 📝 Notas

- El script preserva traducciones manuales existentes
- Traduce recursivamente objetos anidados
- Mantiene la estructura JSON exacta
- Incluye pausas para no sobrecargar la API

