-- ============================================
-- AGREGAR CAMPO GOOGLE_PLACE_ID A PROPERTIES
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Agregar columna google_place_id a la tabla properties
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS google_place_id TEXT;

-- Comentario para documentar el campo
COMMENT ON COLUMN public.properties.google_place_id IS 'Google Place ID para obtener reseñas de Google My Business';

-- Ejemplo de actualización de una propiedad con su Place ID
-- UPDATE public.properties 
-- SET google_place_id = 'ChIJ...' 
-- WHERE slug = 'mariachi';



