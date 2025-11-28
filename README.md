# Puebla Housing

Plataforma moderna de alojamiento estudiantil para estudiantes internacionales en Puebla, México. Construida con Next.js 14, TypeScript, TailwindCSS y next-intl para soporte bilingüe (ES/EN).

## 🚀 Características

- **Bilingüe**: Soporte completo para Español e Inglés
- **Búsqueda avanzada**: Filtros por zona, universidad, tipo de habitación y baño
- **Diseño moderno**: UI limpia y profesional estilo Airbnb/AmberStudent
- **SEO optimizado**: Metadata en todas las páginas
- **Responsive**: Diseño adaptativo para todos los dispositivos
- **Integración WhatsApp**: Click-to-chat con WhatsApp Business
- **Server Components**: Optimizado con Next.js App Router

## 🛠️ Tecnologías

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **next-intl** (i18n)
- **next/image** (optimización de imágenes)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (puerto 3001)
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción (puerto 3001)
npm start
```

## 📁 Estructura del Proyecto

```
puebla-housing/
├── app/
│   ├── [locale]/          # Rutas con internacionalización
│   │   ├── page.tsx       # Home
│   │   ├── casas/         # Listado y detalle de propiedades
│   │   ├── eventos/       # Eventos
│   │   ├── listar-propiedad/  # Listar propiedad
│   │   └── contacto/      # Contacto
│   ├── globals.css        # Estilos globales
│   └── layout.tsx         # Layout raíz
├── components/            # Componentes reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── SearchBar.tsx
│   ├── PropertyCard.tsx
│   └── ...
├── data/                 # Datos dummy
│   ├── properties.ts
│   ├── events.ts
│   └── testimonials.ts
├── messages/             # Traducciones
│   ├── es.json
│   └── en.json
├── i18n.ts               # Configuración i18n
└── middleware.ts         # Middleware para routing
```

## 🎨 Branding

- **Primary**: #592C82 (Purple)
- **Secondary**: #F2C100 (Yellow)
- **Text Main**: #1A1A1A
- **Text Secondary**: #64748B
- **Background**: #FFFFFF
- **Background Gray**: #F8FAFC
- **Font**: Inter

## 📝 Páginas

- **Home** (`/es` o `/en`): Hero, propiedades destacadas, eventos, testimonios
- **Casas** (`/casas`): Listado de todas las propiedades con filtros
- **Detalle de Casa** (`/casas/[slug]`): Galería, descripción, servicios, reserva
- **Eventos** (`/eventos`): Listado de eventos
- **Listar Propiedad** (`/listar-propiedad`): Formulario para propietarios
- **Contacto** (`/contacto`): Formulario, WhatsApp, direcciones

## 🔧 Configuración

### WhatsApp Business

Actualiza el número de WhatsApp en:
- `components/Footer.tsx`
- `app/[locale]/casas/[slug]/page.tsx`
- `app/[locale]/contacto/page.tsx`

Reemplaza `5212221234567` con tu número real de WhatsApp Business.

### Imágenes

Las imágenes actualmente usan Unsplash. Para producción, reemplaza con imágenes reales de las propiedades.

## 📄 Licencia

Este proyecto es privado y propiedad de Puebla Housing.

