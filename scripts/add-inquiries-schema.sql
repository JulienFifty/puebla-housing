-- ============================================
-- SCHEMA PARA SOLICITUDES DE INFORMACIÓN Y RESERVAS
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Tabla de solicitudes/inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('contact', 'reservation', 'property_listing')) DEFAULT 'contact',
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'reserved', 'rejected', 'archived')) DEFAULT 'new',
  notes TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_type ON public.inquiries(type);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON public.inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_room_id ON public.inquiries(room_id);

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para inquiries
-- Eliminar políticas existentes si existen (para hacer el script idempotente)
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Owners can delete inquiries" ON public.inquiries;

-- Cualquiera puede crear inquiries (desde la página pública)
CREATE POLICY "Anyone can create inquiries"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

-- Solo owners pueden ver inquiries de sus propiedades o todas si son admin
CREATE POLICY "Owners can view inquiries"
  ON public.inquiries FOR SELECT
  USING (
    property_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = inquiries.property_id
      AND (properties.owner_id = auth.uid() OR properties.owner_id IS NULL)
    )
  );

-- Solo owners pueden actualizar inquiries
CREATE POLICY "Owners can update inquiries"
  ON public.inquiries FOR UPDATE
  USING (
    property_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = inquiries.property_id
      AND (properties.owner_id = auth.uid() OR properties.owner_id IS NULL)
    )
  );

-- Solo owners pueden eliminar inquiries
CREATE POLICY "Owners can delete inquiries"
  ON public.inquiries FOR DELETE
  USING (
    property_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = inquiries.property_id
      AND (properties.owner_id = auth.uid() OR properties.owner_id IS NULL)
    )
  );

-- Comentarios para documentación
COMMENT ON TABLE public.inquiries IS 'Tabla para gestionar solicitudes de información y reservas desde la página pública';
COMMENT ON COLUMN public.inquiries.type IS 'Tipo: contact (contacto general), reservation (reserva de habitación), property_listing (listar propiedad)';
COMMENT ON COLUMN public.inquiries.status IS 'Estado: new (nueva), contacted (contactado), reserved (reservada), rejected (rechazada), archived (archivada)';

