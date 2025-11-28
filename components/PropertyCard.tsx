'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/data/properties';

interface PropertyCardProps {
  property: Property & { available_from?: string | null };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const t = useTranslations('properties');
  const locale = useLocale() as 'es' | 'en';

  const getZoneLabel = (zone: string) => {
    const zones: Record<string, { es: string; en: string }> = {
      'tres-cruces': { es: 'Tres Cruces', en: 'Tres Cruces' },
      'centro': { es: 'Centro Histórico', en: 'Historic Center' },
      'cholula': { es: 'Cholula', en: 'Cholula' },
    };
    return zones[zone]?.[locale] || zone;
  };

  // Formatear fecha de disponibilidad
  const formatAvailableFrom = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const availableFromDate = formatAvailableFrom((property as any).available_from);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.name[locale]}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Zone Tag */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
          {getZoneLabel(property.zone)}
        </div>
        {/* Available From Badge */}
        {availableFromDate && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-primary/95 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {locale === 'es' 
                  ? `Habitaciones disponibles a partir del ${availableFromDate}`
                  : `Rooms available from ${availableFromDate}`
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {property.name[locale]}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4 text-gray-600">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{property.address}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-3">
          {property.description[locale]}
        </p>

        {/* Features */}
        <div className="flex items-center gap-6 mb-5 text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-sm font-medium">{property.rooms} {t('rooms')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm font-medium">
              {(() => {
                const types = (property as any).room_types || property.roomTypes || property.bathroomTypes;
                if (types.includes('private') && types.includes('shared')) {
                  return t('private') + ' y ' + t('shared');
                } else if (types.includes('private')) {
                  return t('private');
                } else {
                  return t('shared');
                }
              })()}
            </span>
          </div>
        </div>

        {/* Tags - Opciones de habitaciones */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(() => {
            const types = (property as any).room_types || property.roomTypes || property.bathroomTypes;
            return (
              <>
                {types.includes('private') && (
                  <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
                    {t('private')}
                  </span>
                )}
                {types.includes('shared') && (
                  <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
                    {t('shared')}
                  </span>
                )}
              </>
            );
          })()}
        </div>

        {/* CTA Button */}
        <Link
          href={`/${locale}/casas/${property.slug}`}
          className="block w-full bg-primary text-white px-6 py-3.5 rounded-lg hover:bg-primary-hover transition-all font-semibold text-center shadow-sm hover:shadow-md"
        >
          {t('viewProperty')}
        </Link>
      </div>
    </div>
  );
}
