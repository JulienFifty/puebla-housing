# 🎓 Portal de Estudiantes - Instrucciones de Configuración

## Descripción

El Portal de Estudiantes es un dashboard dedicado para estudiantes internacionales que buscan alojamiento en Puebla. Permite a los estudiantes:

- Crear cuenta y gestionar su perfil
- Enviar y seguir solicitudes de alojamiento
- Ver el proceso de ingreso paso a paso
- Ver información de su habitación asignada (check-in, check-out)

## 1. Configurar la Base de Datos

Ejecuta el script SQL en el SQL Editor de Supabase:

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `scripts/add-student-schema.sql`
4. Haz clic en **Run** (o presiona Cmd/Ctrl + Enter)

El script agregará:
- Columna `student_id` a la tabla `inquiries` para vincular solicitudes con estudiantes
- Columna `student_id` a la tabla `bookings` para vincular reservas con estudiantes
- Nuevos estados para el proceso de solicitud
- Campos adicionales para información del estudiante (universidad, país, etc.)
- Políticas RLS para que los estudiantes vean solo sus datos

## 2. Rutas del Portal

| Ruta | Descripción |
|------|-------------|
| `/student/login` | Página de inicio de sesión para estudiantes |
| `/student/register` | Página de registro para nuevos estudiantes |
| `/student` | Dashboard principal del estudiante |
| `/student/applications` | Lista de solicitudes enviadas con estados |
| `/student/my-room` | Información de la habitación asignada |
| `/student/process` | Timeline del proceso de ingreso |
| `/student/profile` | Gestión del perfil del estudiante |

## 3. Estados de Solicitud

El proceso de solicitud tiene los siguientes estados:

| Estado | Descripción |
|--------|-------------|
| `new` | Solicitud recibida |
| `contacted` | Propietario contactó al estudiante |
| `documents` | Esperando documentos del estudiante |
| `reviewing` | Documentos en revisión |
| `approved` | Solicitud aprobada |
| `payment` | Esperando pago de reserva |
| `confirmed` | Reserva confirmada |
| `rejected` | Solicitud rechazada |
| `archived` | Solicitud archivada |

## 4. Flujo del Estudiante

1. **Registro**: El estudiante crea una cuenta en `/student/register`
2. **Exploración**: Busca propiedades en `/es/casas`
3. **Solicitud**: Envía una solicitud desde la página de la propiedad
4. **Seguimiento**: Revisa el estado en `/student/applications`
5. **Proceso**: Ve los pasos completados en `/student/process`
6. **Habitación**: Una vez confirmado, ve su habitación en `/student/my-room`

## 5. Características del Dashboard

### Dashboard Principal
- Estadísticas de solicitudes activas
- Estado de habitación asignada
- Contador de días hasta check-in
- Accesos rápidos a todas las secciones
- Solicitudes recientes

### Mis Solicitudes
- Lista de todas las solicitudes
- Filtros por estado (activas, finalizadas)
- Barra de progreso visual
- Detalles de cada solicitud

### Mi Habitación
- Información de la propiedad
- Detalles de la habitación
- Fechas de check-in y check-out
- Amenidades y servicios
- Notas importantes

### Proceso de Ingreso
- Timeline visual del proceso
- Estado actual destacado
- Lista de acciones requeridas
- FAQ integrado
- Contacto con soporte

### Mi Perfil
- Edición de datos personales
- Universidad y país de origen
- Teléfono de contacto
- Cambio de contraseña

## 6. Integración con Dashboard de Propietarios

Los propietarios pueden:
- Ver solicitudes de estudiantes en `/dashboard/inquiries`
- Cambiar el estado de las solicitudes
- Agregar notas a cada solicitud
- Crear reservas para estudiantes aprobados

## 7. Personalización

### Colores del Portal
El portal usa un gradiente azul-índigo. Para cambiar:
- Edita las clases de Tailwind en `app/student/layout.tsx`
- Gradiente principal: `from-blue-500 to-indigo-600`
- Fondo: `from-blue-50 via-white to-indigo-50`

### Campos del Perfil
Para agregar más campos al perfil de estudiante:
1. Actualiza el schema en Supabase
2. Modifica `app/student/profile/page.tsx`
3. Actualiza `app/student/register/page.tsx`

## 8. Notas Importantes

- Las rutas del portal están protegidas por middleware
- Los estudiantes y propietarios usan la misma tabla `profiles` pero con roles diferentes
- Las solicitudes pueden ser anónimas (sin `student_id`) o vinculadas a un estudiante
- Las reservas automáticamente se vinculan al email del estudiante



