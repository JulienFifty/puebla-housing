-- ============================================
-- ENCONTRAR HABITACIONES DUPLICADAS
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Encontrar habitaciones duplicadas por property_id y room_number
SELECT 
  property_id,
  room_number,
  COUNT(*) as count,
  STRING_AGG(id::text, ', ') as room_ids
FROM public.rooms
GROUP BY property_id, room_number
HAVING COUNT(*) > 1
ORDER BY property_id, room_number;

-- Ver todas las habitaciones de Casa Mariachi
-- (Reemplaza 'TU_PROPERTY_ID' con el ID real de Casa Mariachi)
SELECT 
  r.id,
  r.room_number,
  r.type,
  r.bathroom_type,
  r.available,
  r.created_at,
  p.name_es as property_name
FROM public.rooms r
JOIN public.properties p ON r.property_id = p.id
WHERE p.slug = 'mariachi' OR p.name_es ILIKE '%mariachi%'
ORDER BY r.room_number;

-- Eliminar duplicados (MANTIENE LA MÁS RECIENTE)
-- ⚠️ CUIDADO: Esto eliminará duplicados. Revisa primero con las consultas anteriores
-- DELETE FROM public.rooms
-- WHERE id IN (
--   SELECT id
--   FROM (
--     SELECT id,
--            ROW_NUMBER() OVER (PARTITION BY property_id, room_number ORDER BY created_at DESC) as rn
--     FROM public.rooms
--   ) t
--   WHERE rn > 1
-- );



