-- ============================================
-- SCHEMA PARA SISTEMA DE ESTUDIANTES
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- 1. Agregar columna student_id a inquiries para vincular solicitudes con estudiantes
ALTER TABLE public.inquiries 
ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Agregar columna student_id a bookings para vincular reservas con estudiantes
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. Agregar más estados a inquiries para el proceso del estudiante
-- Primero eliminar la constraint existente
ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_status_check;

-- Agregar nueva constraint con más estados
ALTER TABLE public.inquiries 
ADD CONSTRAINT inquiries_status_check 
CHECK (status IN (
  'new',           -- Nueva solicitud
  'contacted',     -- Propietario contactó al estudiante
  'documents',     -- Esperando documentos
  'reviewing',     -- Revisando documentos
  'approved',      -- Aprobada
  'payment',       -- Esperando pago
  'confirmed',     -- Confirmada (pago recibido)
  'rejected',      -- Rechazada
  'archived'       -- Archivada
));

-- 4. Agregar campos adicionales para documentos del estudiante
ALTER TABLE public.inquiries 
ADD COLUMN IF NOT EXISTS university TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS semester TEXT,
ADD COLUMN IF NOT EXISTS move_in_date DATE,
ADD COLUMN IF NOT EXISTS move_out_date DATE,
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS emergency_contact JSONB DEFAULT '{}';

-- 5. Actualizar profiles para soportar rol de estudiante
-- El campo role ya existe, solo agregamos más datos para estudiantes
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS university TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- 6. Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_inquiries_student_id ON public.inquiries(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 7. Políticas RLS para estudiantes en inquiries
DROP POLICY IF EXISTS "Students can view their own inquiries" ON public.inquiries;
CREATE POLICY "Students can view their own inquiries"
  ON public.inquiries FOR SELECT
  USING (
    auth.uid() = student_id 
    OR 
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = inquiries.property_id
      AND properties.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Students can create inquiries" ON public.inquiries;
CREATE POLICY "Students can create inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Students can update their own inquiries" ON public.inquiries;
CREATE POLICY "Students can update their own inquiries"
  ON public.inquiries FOR UPDATE
  USING (
    auth.uid() = student_id
    OR
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = inquiries.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- 8. Políticas RLS para estudiantes en bookings
DROP POLICY IF EXISTS "Students can view their own bookings" ON public.bookings;
CREATE POLICY "Students can view their own bookings"
  ON public.bookings FOR SELECT
  USING (
    auth.uid() = student_id
    OR
    EXISTS (
      SELECT 1 FROM public.rooms
      JOIN public.properties ON properties.id = rooms.property_id
      WHERE rooms.id = bookings.room_id
      AND properties.owner_id = auth.uid()
    )
  );

-- 9. Comentarios para documentación
COMMENT ON COLUMN public.inquiries.student_id IS 'ID del estudiante que envió la solicitud (si está registrado)';
COMMENT ON COLUMN public.inquiries.university IS 'Universidad donde estudiará';
COMMENT ON COLUMN public.inquiries.country IS 'País de origen del estudiante';
COMMENT ON COLUMN public.inquiries.semester IS 'Semestre de intercambio';
COMMENT ON COLUMN public.inquiries.documents IS 'Documentos subidos (JSON con URLs)';
COMMENT ON COLUMN public.inquiries.emergency_contact IS 'Contacto de emergencia (JSON)';
COMMENT ON COLUMN public.bookings.student_id IS 'ID del estudiante huésped (si está registrado)';



