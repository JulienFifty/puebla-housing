-- ============================================
-- SCHEMA COMPLETO PARA SUPABASE
-- ============================================
-- Ejecuta este SQL en el SQL Editor de Supabase

-- 1. Tabla de perfiles (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de propiedades
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location_es TEXT NOT NULL,
  location_en TEXT NOT NULL,
  address TEXT NOT NULL,
  zone TEXT NOT NULL,
  university TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  total_rooms INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  bathroom_types TEXT[] DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de habitaciones
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  room_number TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('private', 'shared')),
  bathroom_type TEXT NOT NULL CHECK (bathroom_type IN ('private', 'shared')),
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  semester TEXT CHECK (semester IN ('enero-junio-2026', 'junio-diciembre-2026')),
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_rooms_property_id ON public.rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_rooms_semester ON public.rooms(semester);
CREATE INDEX IF NOT EXISTS idx_rooms_available ON public.rooms(available);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_zone ON public.properties(zone);
CREATE INDEX IF NOT EXISTS idx_properties_university ON public.properties(university);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);

-- 5. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Función para incrementar contador de habitaciones
CREATE OR REPLACE FUNCTION increment_property_rooms(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.properties
  SET total_rooms = total_rooms + 1
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Función para decrementar contador de habitaciones
CREATE OR REPLACE FUNCTION decrement_property_rooms(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.properties
  SET total_rooms = GREATEST(total_rooms - 1, 0)
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- 9. Políticas RLS para profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 10. Políticas RLS para properties
CREATE POLICY "Anyone can view properties"
  ON public.properties FOR SELECT
  USING (true);

CREATE POLICY "Owners can insert their properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = owner_id);

-- 11. Políticas RLS para rooms
CREATE POLICY "Anyone can view rooms"
  ON public.rooms FOR SELECT
  USING (true);

CREATE POLICY "Owners can manage rooms of their properties"
  ON public.rooms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = rooms.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- 12. Función para crear perfil automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

