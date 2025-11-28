-- ============================================
-- AGREGAR CAMPOS DE DISPONIBILIDAD CON FECHA
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- 1. Agregar campo available_from a properties (fecha desde la cual hay habitaciones disponibles)
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS available_from DATE;

COMMENT ON COLUMN public.properties.available_from IS 'Fecha a partir de la cual hay habitaciones disponibles en esta propiedad';

-- 2. Agregar campo available_from a rooms (fecha desde la cual la habitación está disponible)
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS available_from DATE;

COMMENT ON COLUMN public.rooms.available_from IS 'Fecha a partir de la cual la habitación estará disponible';

-- 3. Verificar que los campos fueron agregados
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' AND column_name = 'available_from';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rooms' AND column_name = 'available_from';

-- ============================================
-- EJEMPLO: Actualizar fechas de disponibilidad
-- ============================================
-- Actualizar una propiedad específica:
-- UPDATE public.properties 
-- SET available_from = '2026-01-15'
-- WHERE slug = 'casa-piramide';

-- Actualizar una habitación específica:
-- UPDATE public.rooms 
-- SET available_from = '2026-01-15'
-- WHERE id = 'room-id-here';

