import { getTranslations } from 'next-intl/server';
import PropertyCard from '@/components/PropertyCard';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: 'Casas - Puebla Housing',
    description: 'Explora nuestras casas disponibles en Puebla',
  };
}

export default async function PropertiesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { zone?: string; university?: string; roomType?: string; bathroomType?: string };
}) {
  const t = await getTranslations('properties');

  // Obtener propiedades de la base de datos
  const cookieStore = await cookies();
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: propertiesData, error } = await supabaseServer
    .from('properties')
    .select(`
      *,
      rooms (*)
    `)
    .eq('available', true) // Solo propiedades disponibles
    .order('created_at', { ascending: false });

  // Convertir datos de Supabase al formato esperado
  const properties = (propertiesData || []).map((property: any) => {
    // Calcular tipos de habitaciones disponibles
    const roomTypes = new Set<string>();
    const bathroomTypes = new Set<string>();
    
    if (property.rooms && Array.isArray(property.rooms)) {
      property.rooms.forEach((room: any) => {
        if (room.type === 'private' || room.type === 'shared') {
          roomTypes.add(room.type);
        }
        if (room.bathroom_type === 'private' || room.bathroom_type === 'shared') {
          bathroomTypes.add(room.bathroom_type);
        }
      });
    }

    return {
      id: property.id,
      name: {
        es: property.name_es,
        en: property.name_en,
      },
      slug: property.slug,
      location: {
        es: property.location_es,
        en: property.location_en,
      },
      address: property.address,
      rooms: property.total_rooms || property.rooms?.length || 0,
      bathroomTypes: Array.from(bathroomTypes) as ('private' | 'shared')[],
      roomTypes: Array.from(roomTypes) as ('private' | 'shared')[],
      description: {
        es: property.description_es,
        en: property.description_en,
      },
      zone: property.zone as 'tres-cruces' | 'centro' | 'cholula',
      university: property.university as 'BUAP' | 'Centro' | 'UDLAP',
      images: property.images || [],
      available: property.available,
    };
  });

  // Filter properties based on search params
  let filteredProperties = properties;

  if (searchParams.zone) {
    filteredProperties = filteredProperties.filter((p) => p.zone === searchParams.zone);
  }
  if (searchParams.university) {
    filteredProperties = filteredProperties.filter((p) => p.university === searchParams.university);
  }
  if (searchParams.roomType) {
    // This would need to be implemented based on actual room data
    // For now, we'll just show all properties
  }
  if (searchParams.bathroomType) {
    filteredProperties = filteredProperties.filter((p) =>
      p.bathroomTypes.includes(searchParams.bathroomType as 'private' | 'shared')
    );
  }

  return (
    <div className="py-16 bg-background-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-main mb-4">{t('title')}</h1>
          <p className="text-lg text-text-secondary">
            {filteredProperties.length} {t('found', { defaultValue: 'propiedades encontradas' })}
          </p>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-text-secondary">
              {t('noResults', { defaultValue: 'No se encontraron propiedades con estos filtros.' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

