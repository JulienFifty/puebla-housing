# Quick Start Guide

## Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:3001/es (Español)
# http://localhost:3001/en (English)
# 
# Nota: Este proyecto usa el puerto 3001 para no conflictuar
# con otros proyectos Next.js que puedan estar en el puerto 3000
```

## Estructura de Rutas

- `/es` o `/en` - Página principal
- `/es/casas` o `/en/casas` - Listado de propiedades
- `/es/casas/mariachi` - Detalle Casa Mariachi
- `/es/casas/centro` - Detalle Casa Centro
- `/es/casas/piramide` - Detalle Casa Pirámide
- `/es/eventos` - Eventos
- `/es/listar-propiedad` - Listar propiedad
- `/es/contacto` - Contacto

## Configuración Importante

### WhatsApp Business
Actualiza el número de WhatsApp en:
- `components/Footer.tsx` (línea ~20)
- `app/[locale]/casas/[slug]/page.tsx` (línea ~20)
- `app/[locale]/contacto/page.tsx` (línea ~15)

Busca `5212221234567` y reemplázalo con tu número real.

### Imágenes
Las imágenes actualmente usan Unsplash. Para producción:
1. Reemplaza las URLs en `data/properties.ts`
2. Asegúrate de que las imágenes estén optimizadas
3. Considera usar un CDN como Cloudinary

## Características Implementadas

✅ Bilingüe (ES/EN) con next-intl
✅ Búsqueda con filtros (zona, universidad, tipo de habitación/baño)
✅ Cards de propiedades responsive
✅ Páginas de detalle de cada casa
✅ Galería de imágenes
✅ Sección de eventos
✅ Testimonios
✅ Formulario de contacto
✅ Integración WhatsApp Business
✅ SEO metadata en todas las páginas
✅ Diseño responsive
✅ Header y Footer completos

## Próximos Pasos

1. Reemplazar imágenes de Unsplash con fotos reales
2. Conectar formulario de contacto a backend/email
3. Implementar sistema de reservas real
4. Agregar mapa real (Google Maps o similar)
5. Conectar a base de datos para propiedades y disponibilidad
6. Agregar sistema de autenticación si es necesario
7. Implementar pagos (si aplica)

