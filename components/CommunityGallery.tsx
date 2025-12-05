'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category?: 'event' | 'community' | 'activity' | 'lifestyle';
}

export default function CommunityGallery() {
  const locale = useLocale();
  const t = useTranslations('community');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Aquí puedes agregar tus fotos - usa URLs de Cloudinary, Unsplash o rutas locales
  const images: GalleryImage[] = [
    {
      id: '1',
      src: 'https://res.cloudinary.com/dhqq37qlu/image/upload/v1764889889/IMG_8913_ixjv9o.jpg',
      alt: 'Estudiantes internacionales en Puebla',
      category: 'community',
    },
    {
      id: '2',
      src: 'https://res.cloudinary.com/dhqq37qlu/image/upload/v1764889894/IMG_1396_rm6c7u.jpg',
      alt: 'Evento de bienvenida',
      category: 'event',
    },
    {
      id: '3',
      src: 'https://res.cloudinary.com/dhqq37qlu/image/upload/v1764889889/IMG_7050_fzbeyh.jpg',
      alt: 'Grupo de estudiantes',
      category: 'community',
    },
    {
      id: '4',
      src: 'https://res.cloudinary.com/dhqq37qlu/image/upload/v1764889891/IMG_1746_fzabql.jpg',
      alt: 'Actividad grupal',
      category: 'activity',
    },
    {
      id: '5',
      src: 'https://res.cloudinary.com/dhqq37qlu/image/upload/v1764889889/IMG_7277_pg0cnp.jpg',
      alt: 'Estudiantes en casa',
      category: 'lifestyle',
    },
    {
      id: '6',
      src: 'https://res.cloudinary.com/dhqq37qlu/image/upload/v1764889892/IMG_1059_vc3xbl.jpg',
      alt: 'Trabajo en equipo',
      category: 'activity',
    },
    {
        id: '7',
        src: 'https://res.cloudinary.com/dhqq37qlu/image/upload/v1764889893/IMG_1416_o9bx4y.jpg',
        alt: 'Trabajo en equipo',
        category: 'activity',
      },
      {
        id: '8',
        src: 'https://res.cloudinary.com/dhqq37qlu/image/upload/v1764889892/IMG_0422_cpideq.jpg',
        alt: 'Trabajo en equipo',
        category: 'activity',
      },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
            {t('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {t('title')}{' '}
            <span className="text-primary">{t('titleHighlight')}</span>
            {locale === 'en' && ` ${t('titleSuffix')}`}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Photo Grid - Masonry Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                index === 0 || index === 4 ? 'row-span-2' : 'row-span-1'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                      {/* Category badge */}
                      {image.category && (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                          {image.category === 'event' && t('event')}
                          {image.category === 'community' && t('communityLabel')}
                          {image.category === 'activity' && t('activity')}
                          {image.category === 'lifestyle' && t('lifestyle')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 text-lg">
            {t('ctaQuestion')}
          </p>
          <a
            href={`/${locale}/contacto`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all font-semibold shadow-md hover:shadow-xl"
          >
            {t('ctaButton')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl w-full max-h-[90vh]">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1200}
              height={800}
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
}

