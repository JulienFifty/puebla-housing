-- Corregir políticas RLS para inquiries
-- Permitir que cualquier persona pueda crear solicitudes (incluso sin autenticación)

-- Eliminar política existente si existe
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;

-- Crear política para permitir INSERT sin autenticación
CREATE POLICY "Anyone can create inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

-- Verificar que las políticas de SELECT están correctas
DROP POLICY IF EXISTS "Owners can view inquiries for their properties" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can view all inquiries" ON public.inquiries;

-- Los propietarios pueden ver TODAS las solicitudes (para gestión general)
CREATE POLICY "Owners can view all inquiries"
  ON public.inquiries FOR SELECT
  USING (
    -- Si el usuario es propietario (tiene propiedades), puede ver todas las solicitudes
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

-- Política para UPDATE
DROP POLICY IF EXISTS "Owners can update inquiries for their properties" ON public.inquiries;
CREATE POLICY "Owners can update inquiries for their properties"
  ON public.inquiries FOR UPDATE
  USING (
    property_id IN (
      SELECT id FROM public.properties WHERE owner_id = auth.uid()
    )
    OR property_id IS NULL
  );

-- Política para DELETE
DROP POLICY IF EXISTS "Owners can delete inquiries for their properties" ON public.inquiries;
CREATE POLICY "Owners can delete inquiries for their properties"
  ON public.inquiries FOR DELETE
  USING (
    property_id IN (
      SELECT id FROM public.properties WHERE owner_id = auth.uid()
    )
    OR property_id IS NULL
  );

