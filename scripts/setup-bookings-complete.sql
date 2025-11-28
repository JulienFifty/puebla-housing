-- ============================================
-- SCHEMA COMPLETO PARA GESTIÓN DE OCUPACIONES Y RESERVAS
-- ============================================
-- Ejecuta este SQL completo en el SQL Editor de Supabase

-- 1. Tabla de reservas/ocupaciones
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'upcoming', 'completed', 'cancelled')) DEFAULT 'upcoming',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Validar que check_out sea después de check_in
  CONSTRAINT check_dates CHECK (check_out > check_in)
);

-- 2. Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON public.bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON public.bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);

-- 3. Trigger para actualizar updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Función para actualizar automáticamente el estado de las reservas
CREATE OR REPLACE FUNCTION update_booking_status()
RETURNS void AS $$
BEGIN
  -- Marcar como 'active' las reservas que ya comenzaron
  UPDATE public.bookings
  SET status = 'active'
  WHERE status = 'upcoming'
    AND check_in <= CURRENT_DATE
    AND check_out > CURRENT_DATE;
  
  -- Marcar como 'completed' las reservas que ya terminaron
  UPDATE public.bookings
  SET status = 'completed'
  WHERE status IN ('active', 'upcoming')
    AND check_out < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- 5. Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 6. Políticas RLS para bookings
-- Política para SELECT: ver bookings de propiedades propias o sin owner
DROP POLICY IF EXISTS "Owners can view bookings of their properties" ON public.bookings;
CREATE POLICY "Owners can view bookings of their properties"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms
      JOIN public.properties ON properties.id = rooms.property_id
      WHERE rooms.id = bookings.room_id
      AND (properties.owner_id = auth.uid() OR properties.owner_id IS NULL)
    )
  );

-- Política para INSERT: crear bookings en propiedades propias o sin owner
DROP POLICY IF EXISTS "Owners can insert bookings for their properties" ON public.bookings;
CREATE POLICY "Owners can insert bookings for their properties"
  ON public.bookings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rooms
      JOIN public.properties ON properties.id = rooms.property_id
      WHERE rooms.id = bookings.room_id
      AND (properties.owner_id = auth.uid() OR properties.owner_id IS NULL)
    )
  );

-- Política para UPDATE: actualizar bookings de propiedades propias o sin owner
DROP POLICY IF EXISTS "Owners can update bookings of their properties" ON public.bookings;
CREATE POLICY "Owners can update bookings of their properties"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms
      JOIN public.properties ON properties.id = rooms.property_id
      WHERE rooms.id = bookings.room_id
      AND (properties.owner_id = auth.uid() OR properties.owner_id IS NULL)
    )
  );

-- Política para DELETE: eliminar bookings de propiedades propias o sin owner
DROP POLICY IF EXISTS "Owners can delete bookings of their properties" ON public.bookings;
CREATE POLICY "Owners can delete bookings of their properties"
  ON public.bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms
      JOIN public.properties ON properties.id = rooms.property_id
      WHERE rooms.id = bookings.room_id
      AND (properties.owner_id = auth.uid() OR properties.owner_id IS NULL)
    )
  );

-- 7. Comentarios para documentación
COMMENT ON TABLE public.bookings IS 'Tabla para gestionar ocupaciones y reservas de habitaciones';
COMMENT ON COLUMN public.bookings.status IS 'Estado: active (ocupada actualmente), upcoming (reserva futura), completed (completada), cancelled (cancelada)';




