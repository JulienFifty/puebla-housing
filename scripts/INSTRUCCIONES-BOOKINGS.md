# 📋 Instrucciones para Configurar Gestión de Ocupación

## Paso 1: Crear la tabla de reservas en Supabase

1. Ve al SQL Editor de Supabase Dashboard
2. Copia y ejecuta **TODO** el contenido del archivo `scripts/setup-bookings-complete.sql`
3. Esto creará:
   - La tabla `bookings` con todos los campos necesarios
   - Índices para mejor rendimiento
   - Políticas de seguridad (RLS) que permiten trabajar con propiedades sin owner_id
   - Función para actualizar estados automáticamente
   - Triggers para updated_at

**⚠️ IMPORTANTE:** Ejecuta el archivo completo `setup-bookings-complete.sql` de una vez. No ejecutes solo partes del archivo.

## Paso 2: Verificar que todo funciona

Una vez ejecutado el SQL, puedes:

1. Ir a `/dashboard/bookings` en tu aplicación
2. Verás la página de gestión de ocupación
3. Podrás crear nuevas reservas y ver ocupaciones actuales y futuras

## Estructura de la tabla `bookings`

- `id`: UUID único
- `room_id`: Referencia a la habitación
- `guest_name`: Nombre del huésped
- `guest_email`: Email del huésped
- `guest_phone`: Teléfono (opcional)
- `check_in`: Fecha de entrada
- `check_out`: Fecha de salida
- `status`: Estado (`active`, `upcoming`, `completed`, `cancelled`)
- `notes`: Notas adicionales
- `created_at`, `updated_at`: Timestamps automáticos

## Estados de las reservas

- **`upcoming`**: Reserva futura (aún no ha comenzado)
- **`active`**: Ocupación actual (ya comenzó)
- **`completed`**: Reserva completada (ya terminó)
- **`cancelled`**: Reserva cancelada

## Funcionalidades

### En el Dashboard (`/dashboard/bookings`):

1. **Ver ocupaciones actuales**: Habitaciones que están ocupadas ahora
2. **Ver reservas futuras**: Habitaciones con reservas que aún no comienzan
3. **Crear nueva reserva**: Formulario para agregar reservas
4. **Editar reservas**: Modificar información de reservas existentes
5. **Eliminar reservas**: Cancelar o eliminar reservas
6. **Filtros**: Filtrar por estado (Todas, Ocupadas, Reservadas, Completadas)

### Validaciones automáticas:

- No permite crear reservas con fechas conflictivas
- Actualiza automáticamente la disponibilidad de las habitaciones
- Valida que check_out sea después de check_in

## Uso

1. **Crear una reserva**:
   - Click en "Nueva Reserva"
   - Selecciona la habitación
   - Ingresa datos del huésped
   - Selecciona fechas de entrada y salida
   - Elige el estado (Reservada para futuro, Ocupada para actual)
   - Guarda

2. **Ver ocupaciones**:
   - Las ocupaciones actuales aparecen en la columna izquierda
   - Las reservas futuras aparecen en la columna derecha
   - Puedes filtrar por estado usando los botones superiores

3. **Editar/Eliminar**:
   - Click en "Editar" para modificar una reserva
   - Click en "Eliminar" para cancelar una reserva

## Notas importantes

- El sistema automáticamente actualiza la disponibilidad de las habitaciones
- Si una habitación tiene una reserva activa o upcoming, se marca como no disponible
- Cuando todas las reservas de una habitación terminan o se cancelan, la habitación vuelve a estar disponible
- Las políticas RLS aseguran que solo el dueño de la propiedad puede gestionar las reservas de sus habitaciones

