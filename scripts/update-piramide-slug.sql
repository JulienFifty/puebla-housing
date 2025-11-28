-- ============================================
-- ACTUALIZAR SLUG DE PROPIEDAD A "piramide"
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- Esto vinculará la nueva propiedad con el link /es/casas/piramide

-- Opción 1: Si conoces el ID de la propiedad
-- UPDATE public.properties 
-- SET slug = 'piramide'
-- WHERE id = 'TU_PROPERTY_ID';

-- Opción 2: Actualizar la propiedad más reciente (la que acabas de crear)
-- Primero verifica si ya existe una propiedad con slug 'piramide'
SELECT id, name_es, slug, created_at 
FROM public.properties 
WHERE slug = 'piramide';

-- Si no existe o quieres reemplazarla, ejecuta esto:
-- (Descomenta la siguiente línea si quieres actualizar la más reciente)
-- UPDATE public.properties 
-- SET slug = 'piramide'
-- WHERE id = (
--   SELECT id 
--   FROM public.properties 
--   ORDER BY created_at DESC 
--   LIMIT 1
-- );

-- O si quieres actualizar una propiedad específica por su slug actual:
UPDATE public.properties 
SET slug = 'piramide'
WHERE slug = 'casa-piramide';

-- Verificar que se actualizó correctamente
SELECT id, name_es, slug, created_at 
FROM public.properties 
WHERE slug = 'piramide';

