-- Agregar campos de coordenadas a la tabla properties
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Agregar columnas de latitud y longitud si no existen
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Crear índice para búsquedas geográficas
CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON public.properties(latitude, longitude);

-- Comentario: Las coordenadas deben estar en formato:
-- latitude: -90 a 90 (ejemplo: 19.0414 para Puebla)
-- longitude: -180 a 180 (ejemplo: -98.2061 para Puebla)




