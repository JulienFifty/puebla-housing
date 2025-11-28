# Instrucciones para Configurar el Sistema de Solicitudes

Este sistema permite recibir y gestionar solicitudes de información y reservas desde los formularios de la página pública.

## 1. Configurar la Base de Datos

Ejecuta el script SQL en el SQL Editor de Supabase:

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `scripts/add-inquiries-schema.sql`
4. Haz clic en **Run** (o presiona Cmd/Ctrl + Enter)

El script creará:
- La tabla `inquiries` para almacenar las solicitudes
- Índices para mejorar el rendimiento
- Políticas RLS (Row Level Security) para controlar el acceso
- Un trigger para actualizar automáticamente `updated_at`

## 2. Funcionalidades

### Formularios Públicos

Los formularios en la página pública ahora envían solicitudes a la base de datos:

- **Página de Contacto** (`/contacto`): Formulario de contacto general
- **Página de Detalle de Propiedad** (`/casas/[slug]`): Puede incluir formulario de reserva
- **Página de Listar Propiedad**: Formulario para propietarios que quieren listar su propiedad

### Tipos de Solicitudes

- `contact`: Contacto general
- `reservation`: Solicitud de reserva de habitación
- `property_listing`: Solicitud para listar una propiedad

### Estados de Solicitudes

- `new`: Nueva solicitud (sin procesar)
- `contacted`: Ya se contactó al solicitante
- `reserved`: Se completó la reserva
- `rejected`: Solicitud rechazada
- `archived`: Solicitud archivada

## 3. Dashboard de Solicitudes

Accede a `/dashboard/inquiries` para:

- Ver todas las solicitudes recibidas
- Filtrar por estado y tipo
- Ver estadísticas (total, nuevas, contactadas, reservadas)
- Editar el estado y agregar notas
- Eliminar solicitudes

## 4. Uso de los Formularios

### Formulario de Contacto General

El componente `ContactForm` se usa en:
- `/contacto` - Página de contacto
- `/listar-propiedad` - Página para listar propiedades

Por defecto envía solicitudes de tipo `contact`.

### Formulario de Reserva

Para usar el formulario de reserva en una página de propiedad:

```tsx
import ReservationForm from '@/components/ReservationForm';

<ReservationForm
  propertyId="uuid-de-la-propiedad"
  propertyName="Nombre de la Propiedad"
  roomId="uuid-de-la-habitacion" // opcional
  roomNumber="101" // opcional
/>
```

O si solo tienes el slug de la propiedad:

```tsx
import ContactForm from '@/components/ContactForm';

<ContactForm
  type="reservation"
  propertySlug="slug-de-la-propiedad"
/>
```

## 5. API Endpoints

### POST `/api/inquiries`
Crea una nueva solicitud (público, no requiere autenticación)

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+52 222 123 4567", // opcional
  "message": "Estoy interesado en reservar...",
  "type": "reservation", // "contact", "reservation", o "property_listing"
  "propertyId": "uuid", // opcional
  "propertySlug": "slug", // opcional, se busca el propertyId si no se proporciona
  "roomId": "uuid" // opcional
}
```

### GET `/api/inquiries`
Obtiene todas las solicitudes (requiere autenticación)

**Query params:**
- `status`: Filtrar por estado (new, contacted, reserved, rejected, archived)
- `type`: Filtrar por tipo (contact, reservation, property_listing)

### GET `/api/inquiries/[id]`
Obtiene una solicitud específica (requiere autenticación)

### PUT `/api/inquiries/[id]`
Actualiza una solicitud (requiere autenticación)

**Body:**
```json
{
  "status": "contacted",
  "notes": "Llamé al cliente y está interesado"
}
```

### DELETE `/api/inquiries/[id]`
Elimina una solicitud (requiere autenticación)

## 6. Notas Importantes

- Las solicitudes se crean sin autenticación (cualquiera puede enviar)
- Solo los usuarios autenticados (owners) pueden ver y gestionar las solicitudes
- Si una propiedad tiene `owner_id` null (propiedades importadas), cualquier usuario autenticado puede gestionar sus solicitudes
- El campo `responded_at` se actualiza automáticamente cuando el estado cambia a `contacted` o `reserved`

## 7. Próximos Pasos

1. Ejecuta el script SQL en Supabase
2. Prueba enviar un formulario desde la página pública
3. Verifica que la solicitud aparezca en `/dashboard/inquiries`
4. Gestiona las solicitudes desde el dashboard




