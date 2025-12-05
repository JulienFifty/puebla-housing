-- ============================================
-- ACTUALIZAR ÁREAS COMUNES PARA CASA MARIACHI
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- ============================================
-- ACTUALIZAR ÁREAS COMUNES PARA CASA MARIACHI
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Actualizar las áreas comunes para la casa Mariachi (slug: 'mariachi')
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

-- Verificar que se actualizó correctamente
SELECT id, name_es, name_en, slug, common_areas 
FROM public.properties 
WHERE slug = 'mariachi';

