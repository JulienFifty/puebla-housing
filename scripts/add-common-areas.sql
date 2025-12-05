-- ============================================
-- AGREGAR CAMPO DE ÁREAS COMUNES A PROPERTIES
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Agregar columna common_areas como array de texto
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS common_areas TEXT[] DEFAULT '{}';

-- Comentario para documentación
COMMENT ON COLUMN public.properties.common_areas IS 'Array de áreas comunes disponibles en la propiedad (ej: Terraza, Patio, Jardín, etc.)';

