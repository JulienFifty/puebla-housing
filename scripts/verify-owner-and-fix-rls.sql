-- ============================================
-- VERIFICAR Y CORREGIR RLS PARA PROPIETARIOS
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- 1. Verificar si el usuario actual tiene propiedades
-- (Reemplaza 'TU_EMAIL@ejemplo.com' con tu email)
SELECT 
  u.email,
  u.id as user_id,
  COUNT(p.id) as propiedades_count
FROM auth.users u
LEFT JOIN public.properties p ON p.owner_id = u.id
WHERE u.email = 'jthibo49@gmail.com'  -- Cambia este email
GROUP BY u.id, u.email;

-- 2. Si no tiene propiedades, asignar todas las propiedades existentes al usuario
-- (Solo ejecuta esto si el resultado anterior muestra 0 propiedades)
-- UPDATE public.properties 
-- SET owner_id = (SELECT id FROM auth.users WHERE email = 'jthibo49@gmail.com')
-- WHERE owner_id IS NULL;

-- 3. Verificar las políticas RLS actuales
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
WHERE tablename = 'inquiries'
ORDER BY policyname;

-- 4. Si las políticas no están bien, ejecuta esto:
-- Primero eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can view inquiries for their properties" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can view all inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can update inquiries for their properties" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can update all inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can delete inquiries for their properties" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can delete all inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Students can view their own inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Students can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Students can update their own inquiries" ON public.inquiries;

-- 5. Crear políticas simplificadas que funcionen
-- INSERT: Cualquiera puede crear
CREATE POLICY "Anyone can create inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

-- SELECT: Los propietarios (usuarios con propiedades) pueden ver todas
CREATE POLICY "Owners can view all inquiries"
  ON public.inquiries FOR SELECT
  USING (
    -- Si tiene propiedades, puede ver todas las solicitudes
    EXISTS (
      SELECT 1 FROM public.properties WHERE owner_id = auth.uid()
    )
    OR
    -- O si es el estudiante
    student_id = auth.uid()
  );

-- UPDATE: Los propietarios pueden actualizar todas
CREATE POLICY "Owners can update all inquiries"
  ON public.inquiries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties WHERE owner_id = auth.uid()
    )
    OR student_id = auth.uid()
  );

-- DELETE: Solo propietarios pueden eliminar
CREATE POLICY "Owners can delete all inquiries"
  ON public.inquiries FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties WHERE owner_id = auth.uid()
    )
  );



