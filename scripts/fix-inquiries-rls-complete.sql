-- ============================================
-- CORREGIR POLÍTICAS RLS PARA INQUIRIES
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- 1. Eliminar políticas existentes
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can view inquiries for their properties" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can view all inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can update inquiries for their properties" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can delete inquiries for their properties" ON public.inquiries;
DROP POLICY IF EXISTS "Students can view their own inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Students can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Students can update their own inquiries" ON public.inquiries;

-- 2. Política para INSERT - Cualquiera puede crear solicitudes (público)
CREATE POLICY "Anyone can create inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

-- 3. Política para SELECT - Propietarios ven todas las solicitudes
CREATE POLICY "Owners can view all inquiries"
  ON public.inquiries FOR SELECT
  USING (
    -- Si el usuario es propietario (tiene propiedades), puede ver todas
    EXISTS (
      SELECT 1 FROM public.properties WHERE owner_id = auth.uid()
    )
    OR
    -- O si es el estudiante que envió la solicitud
    student_id = auth.uid()
    OR
    -- O si la solicitud no tiene propiedad asignada (contacto general)
    property_id IS NULL
  );

-- 4. Política para UPDATE - Propietarios pueden actualizar cualquier solicitud
CREATE POLICY "Owners can update all inquiries"
  ON public.inquiries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties WHERE owner_id = auth.uid()
    )
    OR student_id = auth.uid()
  );

-- 5. Política para DELETE - Propietarios pueden eliminar cualquier solicitud
CREATE POLICY "Owners can delete all inquiries"
  ON public.inquiries FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties WHERE owner_id = auth.uid()
    )
  );

-- 6. Comentarios
COMMENT ON POLICY "Anyone can create inquiries" ON public.inquiries IS 
  'Permite que cualquier persona (incluso sin autenticación) pueda crear solicitudes';
COMMENT ON POLICY "Owners can view all inquiries" ON public.inquiries IS 
  'Los propietarios pueden ver todas las solicitudes para gestionarlas';
COMMENT ON POLICY "Owners can update all inquiries" ON public.inquiries IS 
  'Los propietarios pueden actualizar el estado y notas de cualquier solicitud';



