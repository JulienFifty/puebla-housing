# 📸 Cómo Agregar Fotos de la Comunidad

## 📍 Archivo a Editar

**Archivo**: `components/CommunityGallery.tsx`

**Líneas**: 17-48 (aproximadamente)

---

## 🎯 Tipos de Fotos Recomendadas

Para dar un toque humano y cálido a la página, incluye:

### ✅ Fotos Ideales:
- 👥 **Grupos de estudiantes** sonriendo juntos
- 🎉 **Eventos** (noches de bienvenida, fiestas, celebraciones)
- 🌮 **Actividades** (tours gastronómicos, clases de salsa)
- 🏠 **Vida cotidiana** (estudiantes en las casas, cocinando, estudiando)
- 🎓 **Momentos universitarios** (campus, clases)
- 🌆 **Puebla** (pirámides, centro histórico con estudiantes)
- 🤗 **Momentos genuinos** (risas, conversaciones, amistades)

### ❌ Evitar:
- Fotos muy posadas o "stock"
- Imágenes borrosas o mal iluminadas
- Fotos sin estudiantes (solo lugares)
- Imágenes demasiado oscuras

---

## 📝 Cómo Agregar tus Fotos

### Paso 1: Sube tus fotos

**Opciones:**

1. **Cloudinary** (recomendado si ya lo usas):
   ```
   https://res.cloudinary.com/tu-cloud-name/image/upload/v1234567890/foto.jpg
   ```

2. **Carpeta pública** del proyecto:
   - Coloca la imagen en: `/public/community/`
   - Usa la ruta: `/community/foto.jpg`

### Paso 2: Edita el archivo

Abre: `components/CommunityGallery.tsx`

Busca el array `images`:

```typescript
const images: GalleryImage[] = [
  {
    id: '1',
    src: 'TU_URL_AQUI',
    alt: 'Descripción de la foto',
    category: 'community', // event, community, activity, lifestyle
  },
  // ... más fotos
];
```

### Paso 3: Agrega tu foto

**Ejemplo:**

```typescript
{
  id: '7',
  src: '/community/fiesta-bienvenida.jpg',
  alt: 'Fiesta de bienvenida septiembre 2024',
  category: 'event',
},
{
  id: '8',
  src: '/community/estudiantes-cocina.jpg',
  alt: 'Estudiantes cocinando juntos',
  category: 'lifestyle',
},
```

---

## 🏷️ Categorías Disponibles

Usa estas categorías para el badge que aparece al hacer hover:

| Categoría | Emoji | Español | Inglés |
|-----------|-------|---------|--------|
| `event` | 🎉 | Evento | Event |
| `community` | 👥 | Comunidad | Community |
| `activity` | 🎯 | Actividad | Activity |
| `lifestyle` | 🏠 | Vida | Lifestyle |

---

## 🎨 Diseño de la Sección

### Características:
- ✨ **Grid masonry** (algunas fotos más altas)
- 🖼️ **Lightbox** al hacer clic (foto en grande)
- 🎭 **Hover effects** con overlay
- 📱 **Responsive**: 2/3/4 columnas según dispositivo
- 🏷️ **Badges** con categorías

### Layout:
```
┌────┬────┬────┬────┐
│ 1  │ 3  │ 5  │ 7  │
│    ├────┼────┼────┤
│    │ 4  │ 6  │ 8  │
├────┤    ├────┤    │
│ 2  │    │ 9  │    │
└────┴────┴────┴────┘
```

---

## 📏 Tamaño de Fotos Recomendado

- **Ancho**: 800-1200px
- **Formato**: JPG (optimizado)
- **Peso**: < 500KB por foto
- **Proporción**: Cuadrada (1:1) o vertical (3:4)

---

## 🚀 Después de Agregar Fotos

1. **Guarda el archivo**
2. **Prueba localmente**:
   ```bash
   npm run dev
   ```
3. **Haz commit**:
   ```bash
   git add components/CommunityGallery.tsx
   git add public/community/*  # Si usaste fotos locales
   git commit -m "Add community photos"
   git push
   ```

---

## 💡 Tips para Fotos de Calidad

1. **Diversidad**: Muestra estudiantes de diferentes países
2. **Emociones**: Captura sonrisas genuinas y momentos reales
3. **Contexto**: Incluye elementos de Puebla (arquitectura, comida)
4. **Consistencia**: Mantén un estilo similar en iluminación
5. **Cantidad**: 12-20 fotos es ideal para el carrusel

---

## 📍 Ubicación en la Página

La galería aparece en la homepage después de:
- ✅ Sección de habitaciones
- ✅ Antes de "Sobre Nosotros"

---

## 🎯 Objetivo de esta Sección

Esta galería debe transmitir:
- 🤝 **Comunidad**: No estás solo
- 😊 **Felicidad**: Estudiantes contentos
- 🌍 **Internacional**: Diversidad cultural
- 🎉 **Diversión**: Vida social activa
- 🏡 **Hogar**: Ambiente familiar y acogedor

¡Las fotos son la clave para conectar emocionalmente con futuros estudiantes! 📸✨

