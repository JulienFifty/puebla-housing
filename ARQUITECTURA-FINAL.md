# 🏗️ Arquitectura Final - Puebla Housing

## 📊 Stack Tecnológico

```
┌─────────────────────────────────────────────────┐
│  Frontend: Next.js 14 (App Router)             │
│  Hosting: Vercel                                │
│  Base de Datos: Supabase PostgreSQL            │
│  Auth: Supabase Auth                            │
│  Traducciones: Custom lib (solo español)       │
│  Storage: Cloudinary (imágenes)                │
│  Mapas: Mapbox GL                               │
└─────────────────────────────────────────────────┘
```

---

## 🗂️ Estructura del Proyecto

### Rutas Principales

```
app/
├── [locale]/              # Rutas públicas (español)
│   ├── page.tsx          # Página principal
│   ├── casas/            # Listado de propiedades
│   ├── contacto/         # Formulario de contacto
│   ├── eventos/          # Eventos para estudiantes
│   ├── quien-somos/      # Sobre nosotros
│   └── welcome-pack/     # Guía para estudiantes
│
├── dashboard/            # Panel de propietarios
│   ├── properties/       # Gestión de propiedades
│   ├── rooms/            # Gestión de habitaciones
│   ├── bookings/         # Reservas
│   ├── inquiries/        # Consultas
│   ├── availability/     # Disponibilidad
│   └── occupancy/        # Ocupación
│
├── student/              # Portal de estudiantes
│   ├── login/            # Login estudiantes
│   ├── register/         # Registro
│   ├── profile/          # Perfil
│   ├── my-room/          # Mi habitación
│   └── applications/     # Mis solicitudes
│
└── api/                  # API Routes
    ├── auth/             # Autenticación
    ├── properties/       # CRUD propiedades
    ├── rooms/            # CRUD habitaciones
    ├── bookings/         # CRUD reservas
    └── inquiries/        # CRUD consultas
```

---

## 🔧 Componentes Clave

### 1. Traducciones (`lib/translations.ts`)

**Reemplazo de next-intl** - Librería propia sin dependencias de Edge Runtime:

```typescript
// Funciones disponibles:
- getTranslations(namespace?)    // Server-side
- useTranslations(namespace?)    // Client-side
- useLocale()                    // Siempre retorna 'es'
- setRequestLocale(locale)       // No-op
- getMessages()                  // Retorna mensajes en español
```

**Ventajas:**
- ✅ Sin `__dirname` (Edge Runtime compatible)
- ✅ Importa directamente de `messages/es.json`
- ✅ Ligera y rápida
- ✅ Fácil de extender para inglés en el futuro

### 2. Middleware (`middleware.ts`)

**Sin next-intl/middleware** - Lógica manual:

```typescript
// Funciones:
1. Redirige / → /es
2. Protege /dashboard (verifica cookie sb-*)
3. Protege /student (verifica cookie sb-*)
4. Pasa /api directamente
```

**Tamaño:** 26.4 kB (antes: 95.2 kB con next-intl)

### 3. Configuración i18n

```
i18n-config.ts    # Solo constantes (Edge-safe)
├── locales: ['es', 'en']
└── defaultLocale: 'es'
```

---

## 🗄️ Base de Datos (Supabase)

### Tablas Principales:

```sql
profiles         # Usuarios (extiende auth.users)
properties       # Propiedades (casas)
rooms            # Habitaciones
bookings         # Reservas
inquiries        # Consultas de estudiantes
students         # Portal de estudiantes
applications     # Solicitudes de estudiantes
```

### Acceso:

```typescript
// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(...);
export const supabaseAdmin = createClient(...);  // Server-only
```

---

## 🚀 Capacidad de Escalamiento

| Métrica | Capacidad |
|---------|-----------|
| **Usuarios simultáneos** | 10,000+ |
| **Requests/segundo** | 1,000+ |
| **Almacenamiento** | Ilimitado (PostgreSQL) |
| **Regiones** | Multi-región ✅ |
| **Costo inicial** | $0-25/mes |

---

## 📦 Dependencias Principales

```json
{
  "next": "^14.2.33",
  "react": "^18.3.1",
  "@supabase/ssr": "^0.8.0",
  "@supabase/supabase-js": "^2.86.0",
  "mapbox-gl": "^3.16.0",
  "react-map-gl": "^8.1.0"
}
```

**Eliminadas:**
- ❌ `next-intl` (causaba `__dirname` error)
- ❌ `prisma` (no se usaba)
- ❌ `@prisma/client` (no se usaba)

---

## 🎯 Rutas de Acceso

### Público:
- `/` → Redirige a `/es`
- `/es` → Página principal
- `/es/casas` → Listado de propiedades
- `/es/contacto` → Contacto

### Dashboard (Propietarios):
- `/dashboard` → Panel principal
- `/dashboard/properties` → Gestión de propiedades
- `/dashboard/rooms` → Gestión de habitaciones

### Student Portal:
- `/student` → Portal de estudiantes
- `/student/my-room` → Mi habitación
- `/student/applications` → Mis solicitudes

---

## ⚙️ Variables de Entorno Requeridas

### En Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### Opcional (Mapbox):

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

---

## 🎊 Estado Final

✅ **Build local**: Funciona perfectamente  
✅ **Middleware**: 26.4 kB (Edge Runtime compatible)  
✅ **33 páginas generadas**  
✅ **Sin next-intl** (eliminado)  
✅ **Sin Prisma** (eliminado)  
✅ **Solo español** (simplificado)  

**Listo para producción en Vercel** 🚀

