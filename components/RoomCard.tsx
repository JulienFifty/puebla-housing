'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState } from 'react';

interface RoomCardProps {
  room: any; // Room from API
}

export default function RoomCard({ room }: RoomCardProps) {
  const t = useTranslations('rooms');
  const locale = useLocale();
  const [imageIndex, setImageIndex] = useState(0);

  const property = room.properties || {};
  const propertyName = property[`name_${locale}`] || property.name_es || '';
  const roomImages = (room.images || []).filter((img: string) => img && img.trim() !== '');
  const mainImage = roomImages[imageIndex] || roomImages[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800';

  // Format dates
  const formatDate = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const availableFrom = formatDate(room.available_from);
  const availableTo = formatDate(room.available_to);

  // Get description
  const description = room[`description_${locale}`] || room.description_es || '';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-64 w-full group bg-gray-200">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={description}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Image Counter */}
        {roomImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {roomImages.length}
          </div>
        )}

        {/* Availability Badge */}
        {room.available ? (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            {t('available', { defaultValue: 'Disponible' })}
          </div>
        ) : room.available_from ? (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            {locale === 'es' 
              ? `Disponible a partir del ${new Date(room.available_from).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}`
              : `Available from ${new Date(room.available_from).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`
            }
          </div>
        ) : (
          <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            {t('notAvailable', { defaultValue: 'No Disponible' })}
          </div>
        )}

        {/* Image Navigation */}
        {roomImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                setImageIndex((prev) => (prev > 0 ? prev - 1 : roomImages.length - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setImageIndex((prev) => (prev < roomImages.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Property */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {propertyName} - Habitación #{room.room_number}
          </h3>
          {availableFrom && (
            <p className="text-sm text-emerald-600 font-medium">
              {t('availableFrom', { defaultValue: 'Disponible desde' })}: {availableFrom}
            </p>
          )}
        </div>

        {/* Features Row */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">{room.type === 'private' ? t('private', { defaultValue: 'Privada' }) : t('shared', { defaultValue: 'Compartida' })}</span>
          </div>
          
          {room.is_entire_place && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{t('entirePlace', { defaultValue: 'Lugar Completo' })}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{room.bathroom_type === 'private' ? t('bathroomPrivate', { defaultValue: 'Baño Privado' }) : t('bathroomShared', { defaultValue: 'Baño Compartido' })}</span>
          </div>

          {room.has_private_kitchen && (
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="font-medium">{t('privateKitchen', { defaultValue: 'Cocina Privada' })}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Semester Badge */}
        {room.semester && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
              {room.semester === 'enero-junio-2026'
                ? t('semester1', { defaultValue: 'Enero - Junio 2026' })
                : t('semester2', { defaultValue: 'Junio - Diciembre 2026' })}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link
            href={`/${locale}/casas/${property.slug || ''}/habitacion/${room.id}`}
            className="block w-full text-center bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold shadow-sm hover:shadow-md"
          >
            {t('viewDetails', { defaultValue: 'Ver Habitación' })}
          </Link>
          
          <Link
            href={`/${locale}/casas/${property.slug || ''}/habitacion/${room.id}`}
            className="block w-full text-center text-primary hover:text-primary-hover font-semibold text-sm py-2 transition-colors border border-primary rounded-lg hover:bg-primary/5"
          >
            {t('book', { defaultValue: 'Reservar' })}
          </Link>
        </div>
      </div>
    </div>
  );
}
