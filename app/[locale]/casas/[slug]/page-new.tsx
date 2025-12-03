'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import NearbyLocationsMap from '@/components/NearbyLocationsMap';

interface Property {
  id: string;
  name_es: string;
  name_en: string;
  slug: string;
  location_es: string;
  location_en: string;
  address: string;
  description_es: string;
  description_en: string;
  images: string[];
  available: boolean;
  total_rooms?: number;
  room_types?: ('private' | 'shared')[];
  rooms?: any[];
  zone?: string;
  latitude?: number;
  longitude?: number;
  google_place_id?: string;
}

interface GoogleReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface ReviewsData {
  reviews: GoogleReview[];
  rating: number;
  totalReviews: number;
}

export default function PropertyPage({ params }: { params: { slug: string; locale: string } }) {
  const t = useTranslations();
  const locale = useLocale() as 'es' | 'en';
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/slug/${params.slug}`);
        if (!res.ok) throw new Error('Property not found');
        const data = await res.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Propiedad no encontrada</h1>
          <Link href={`/${locale}/casas`} className="text-primary hover:underline">
            Volver a propiedades
          </Link>
        </div>
      </div>
    );
  }

  const propertyName = property[`name_${locale}`] || property.name_es;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{propertyName}</h1>
        <p>Contenido de prueba - Página funcional</p>
      </div>
    </div>
  );
}



