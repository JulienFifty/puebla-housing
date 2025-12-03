-- ============================================
-- ELIMINAR HABITACIONES DUPLICADAS
-- ============================================
-- ⚠️ EJECUTA PRIMERO find-duplicate-rooms.sql PARA VER LOS DUPLICADOS
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Opción 1: Eliminar duplicados manteniendo la más reciente
-- (Elimina las habitaciones más antiguas)
DELETE FROM public.rooms
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY property_id, room_number ORDER BY created_at DESC) as rn
    FROM public.rooms
  ) t
  WHERE rn > 1
);

-- Opción 2: Eliminar duplicados manteniendo la más antigua
-- (Elimina las habitaciones más recientes)
-- DELETE FROM public.rooms
-- WHERE id IN (
--   SELECT id
--   FROM (
--     SELECT id,
--            ROW_NUMBER() OVER (PARTITION BY property_id, room_number ORDER BY created_at ASC) as rn
--     FROM public.rooms
--   ) t
--   WHERE rn > 1
-- );

-- Verificar que se eliminaron los duplicados
SELECT 
  property_id,
  room_number,
  COUNT(*) as count
FROM public.rooms
GROUP BY property_id, room_number
HAVING COUNT(*) > 1;

-- Si no hay resultados, significa que no hay duplicados



