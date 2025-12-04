# 🎥 Cómo Agregar tus Videos de Vimeo

## 📍 Archivo a Editar

**Archivo**: `components/VideoTestimonials.tsx`

**Líneas**: 19-40 (aproximadamente)

---

## 🔍 Cómo Obtener el ID de un Video de Vimeo

### Opción 1: Desde la URL del Video
Si tu video está en: `https://vimeo.com/1234567890`

**El ID es**: `1234567890`

### Opción 2: Desde el Código de Embed
Si Vimeo te da un código como:
```html
<iframe src="https://player.vimeo.com/video/1234567890?..."
```

**El ID es**: `1234567890`

---

## ✏️ Editar el Archivo

### Paso 1: Abre el archivo
```bash
components/VideoTestimonials.tsx
```

### Paso 2: Busca la sección `testimonials`

Encontrarás algo como:

```typescript
const testimonials: VideoTestimonial[] = [
  {
    id: '1',
    vimeoId: '1234567890', // ← REEMPLAZAR AQUÍ
    studentName: 'María López',
    country: '🇫🇷 Francia',
    university: 'UDLAP',
  },
  // ...más testimonios
];
```

### Paso 3: Reemplaza los datos

**Ejemplo real:**

```typescript
const testimonials: VideoTestimonial[] = [
  {
    id: '1',
    vimeoId: '987654321',           // ← Tu ID de Vimeo
    studentName: 'Ana García',       // ← Nombre del estudiante
    country: '🇲🇽 México',          // ← Bandera + País
    university: 'BUAP',              // ← Universidad
  },
  {
    id: '2',
    vimeoId: '123456789',
    studentName: 'John Smith',
    country: '🇺🇸 USA',
    university: 'UDLAP',
  },
  {
    id: '3',
    vimeoId: '555666777',
    studentName: 'Yuki Tanaka',
    country: '🇯🇵 Japón',
    university: 'IBERO',
  },
];
```

---

## 🎨 Características de la Sección

✅ **Diseño vertical** (formato stories/reels)  
✅ **Reproductor de Vimeo** integrado  
✅ **Autoplay** al hacer clic  
✅ **3 videos** en grid responsive  
✅ **Botón play** con hover effect  
✅ **Información del estudiante** superpuesta  
✅ **Fondo morado degradado** con efectos  

---

## 📱 Vista Responsive

- **Mobile**: 1 columna
- **Tablet**: 2 columnas
- **Desktop**: 3 columnas

---

## 🔧 Agregar Más o Menos Videos

### Para agregar un 4to video:

```typescript
{
  id: '4',
  vimeoId: 'TU_ID_AQUI',
  studentName: 'Nombre',
  country: '🇫🇷 Francia',
  university: 'UPAEP',
},
```

### Para tener solo 2 videos:

Simplemente **elimina** el tercer objeto del array.

---

## ⚠️ Notas Importantes

1. **ID único**: Cada `id` debe ser diferente ('1', '2', '3', etc.)
2. **Privacidad**: Asegúrate de que tus videos en Vimeo estén configurados como "Públicos" o "Cualquiera con el enlace"
3. **Permisos**: Verifica que el embed esté habilitado en la configuración de cada video en Vimeo

---

## 🚀 Después de Editar

1. **Guarda el archivo**
2. **Haz commit**:
   ```bash
   git add components/VideoTestimonials.tsx
   git commit -m "Update Vimeo video IDs"
   git push
   ```
3. **Vercel** desplegará automáticamente los cambios

---

## 🎯 Ubicación en la Página

La sección aparece en la página principal (`/es`) entre:
- **Antes**: Sección "Sobre Nosotros"
- **Después**: Testimonios de texto

---

¿Necesitas ayuda? Los videos de prueba funcionan, solo reemplaza los IDs! 🎬

