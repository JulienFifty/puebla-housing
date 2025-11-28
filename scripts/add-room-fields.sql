-- ============================================
-- AGREGAR CAMPOS FALTANTES A LA TABLA ROOMS
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Agregar campos para información detallada de habitaciones
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS available_from DATE,
  ADD COLUMN IF NOT EXISTS available_to DATE,
  ADD COLUMN IF NOT EXISTS has_private_kitchen BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_entire_place BOOLEAN DEFAULT false;

-- Comentarios para documentación
COMMENT ON COLUMN public.rooms.available_from IS 'Fecha desde la cual está disponible';
COMMENT ON COLUMN public.rooms.available_to IS 'Fecha hasta la cual está disponible';
COMMENT ON COLUMN public.rooms.has_private_kitchen IS 'Indica si la habitación tiene cocina privada';
COMMENT ON COLUMN public.rooms.is_entire_place IS 'Indica si es un lugar completo (estudio/apartamento) o solo habitación';

