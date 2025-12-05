-- ============================================
-- CONFIGURACIÓN COMPLETA DE ÁREAS COMUNES
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- Este script hace TODO: crea la columna Y actualiza Mariachi

-- PASO 1: Agregar columna common_areas como array de texto
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS common_areas TEXT[] DEFAULT '{}';

-- Comentario para documentación
COMMENT ON COLUMN public.properties.common_areas IS 'Array de áreas comunes disponibles en la propiedad (ej: Terraza, Patio, Jardín, etc.)';

-- PASO 2: Actualizar las áreas comunes para la casa Mariachi
UPDATE public.properties 
SET common_areas = ARRAY[
  'Terraza',
  'Patio',
  'Jardín',
  'Roof garden',
  'Asador',
  'Salas',
  'Cocinas',
  'Zona de ejercicio'
]
WHERE slug = 'mariachi';

-- PASO 3: Verificar que se actualizó correctamente
SELECT id, name_es, name_en, slug, common_areas 
FROM public.properties 
WHERE slug = 'mariachi';

