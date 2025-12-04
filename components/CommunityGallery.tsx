'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category?: 'event' | 'community' | 'activity' | 'lifestyle';
}

export default function CommunityGallery() {
  const locale = useLocale();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Aquí puedes agregar tus fotos - usa URLs de Cloudinary, Unsplash o rutas locales
  const images: GalleryImage[] = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      alt: 'Estudiantes internacionales en Puebla',
      category: 'community',
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800',
      alt: 'Evento de bienvenida',
      category: 'event',
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
      alt: 'Grupo de estudiantes',
      category: 'community',
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800',
      alt: 'Actividad grupal',
      category: 'activity',
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800',
      alt: 'Estudiantes en casa',
      category: 'lifestyle',
    },
    {
      id: '6',
      src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
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
            {locale === 'es' ? 'Nuestra Comunidad' : 'Our Community'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {locale === 'es' ? (
              <>
                Vive la experiencia{' '}
                <span className="text-primary">Puebla Housing</span>
              </>
            ) : (
              <>
                Live the{' '}
                <span className="text-primary">Puebla Housing</span> experience
              </>
            )}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Conoce a nuestra comunidad internacional de estudiantes. Eventos, actividades y momentos especiales que hacen de Puebla tu segundo hogar.'
              : 'Meet our international student community. Events, activities and special moments that make Puebla your second home.'}
          </p>
        </div>

        {/* Photo Grid - Masonry Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                index % 7 === 0 || index % 7 === 3 ? 'row-span-2' : ''
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative aspect-square">
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
                          {image.category === 'event' && (locale === 'es' ? '🎉 Evento' : '🎉 Event')}
                          {image.category === 'community' && (locale === 'es' ? '👥 Comunidad' : '👥 Community')}
                          {image.category === 'activity' && (locale === 'es' ? '🎯 Actividad' : '🎯 Activity')}
                          {image.category === 'lifestyle' && (locale === 'es' ? '🏠 Vida' : '🏠 Lifestyle')}
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
            {locale === 'es'
              ? '¿Quieres ser parte de nuestra comunidad?'
              : 'Want to be part of our community?'}
          </p>
          <a
            href={`/${locale}/contacto`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all font-semibold shadow-md hover:shadow-xl"
          >
            {locale === 'es' ? 'Únete ahora' : 'Join now'}
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

