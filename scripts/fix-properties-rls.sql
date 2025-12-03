-- ============================================
-- CORREGIR POLÍTICAS RLS PARA PROPERTIES
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Primero, eliminar las políticas existentes si hay problemas
DROP POLICY IF EXISTS "Owners can insert their properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can update their properties" ON public.properties;
DROP POLICY IF EXISTS "Owners can delete their properties" ON public.properties;

-- Crear política mejorada para INSERT
-- Permite a usuarios autenticados crear propiedades donde ellos son el owner
CREATE POLICY "Authenticated users can insert properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Crear política para UPDATE
CREATE POLICY "Owners can update their properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Crear política para DELETE
CREATE POLICY "Owners can delete their properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Verificar que las políticas estén activas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'properties';



