-- ============================================
-- SOLUCIÓN SIMPLE PARA RLS DE INQUIRIES
-- ============================================
-- Ejecuta este SQL completo en el SQL Editor de Supabase

-- PASO 1: Eliminar TODAS las políticas existentes
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'inquiries') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.inquiries';
    END LOOP;
END $$;

-- PASO 2: Verificar que el usuario tiene propiedades asignadas
-- Si no tiene propiedades, asignar todas las existentes
UPDATE public.properties 
SET owner_id = (SELECT id FROM auth.users WHERE email = 'jthibo49@gmail.com' LIMIT 1)
WHERE owner_id IS NULL 
  AND EXISTS (SELECT 1 FROM auth.users WHERE email = 'jthibo49@gmail.com');

-- PASO 3: Crear políticas nuevas y simples

-- INSERT: Cualquiera puede crear solicitudes (público)
CREATE POLICY "public_insert_inquiries"
  ON public.inquiries FOR INSERT
  TO public
  WITH CHECK (true);

-- SELECT: Usuarios autenticados que tienen propiedades pueden ver todas
CREATE POLICY "owners_select_all_inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (
    -- Si tiene al menos una propiedad, puede ver todas las solicitudes
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE owner_id = auth.uid()
      LIMIT 1
    )
    OR
    -- O si es el estudiante que envió la solicitud
    student_id = auth.uid()
  );

-- UPDATE: Propietarios pueden actualizar todas
CREATE POLICY "owners_update_all_inquiries"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE owner_id = auth.uid()
      LIMIT 1
    )
    OR student_id = auth.uid()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE owner_id = auth.uid()
      LIMIT 1
    )
    OR student_id = auth.uid()
  );

-- DELETE: Solo propietarios pueden eliminar
CREATE POLICY "owners_delete_all_inquiries"
  ON public.inquiries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE owner_id = auth.uid()
      LIMIT 1
    )
  );

-- PASO 4: Verificar que se crearon correctamente
SELECT 
  policyname,
  cmd as operation,
  qual as using_expression
FROM pg_policies
WHERE tablename = 'inquiries'
ORDER BY policyname;

