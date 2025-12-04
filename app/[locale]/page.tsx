import { getTranslations, setRequestLocale } from 'next-intl/server';
import Hero from '@/components/Hero';
import UniversitiesBanner from '@/components/UniversitiesBanner';
import AboutSection from '@/components/AboutSection';
import PropertyCard from '@/components/PropertyCard';
import TestimonialCard from '@/components/TestimonialCard';
import RoomsSection from '@/components/RoomsSection';
import { testimonials } from '@/data/testimonials';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return {
    title: 'Puebla Housing - Student Accommodation',
    description: 'Find your perfect student accommodation in Puebla, Mexico',
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // Habilitar renderizado estático
  setRequestLocale(locale);
  
  const t = await getTranslations();

  // Obtener propiedades de la base de datos (solo las disponibles)
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

  const { data: propertiesData } = await supabaseServer
    .from('properties')
    .select(`
      *,
      rooms (*)
    `)
    .eq('available', true) // Solo propiedades disponibles
    .order('created_at', { ascending: false })
    .limit(3); // Solo las 3 más recientes para el homepage

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

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Universities Banner */}
      <UniversitiesBanner />

      {/* Properties Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('properties.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('properties.subtitle')}
            </p>
          </div>
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {t('properties.noResults', { defaultValue: 'No hay propiedades disponibles en este momento.' })}
              </p>
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/casas`}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-lg hover:bg-primary-hover transition-colors font-semibold shadow-sm hover:shadow-md"
            >
              {t('properties.viewAll')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <RoomsSection />

      {/* About Section */}
      <AboutSection />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
