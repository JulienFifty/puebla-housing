'use client';

import { useTranslations } from '@/lib/translations';
import Image from 'next/image';

export default function AboutSection() {
  const t = useTranslations('about');

  // Split description to highlight parts
  const description = t('description');
  const highlightedText = t('highlightedText', { defaultValue: 'servicio integral que conecta a los estudiantes con opciones de alojamiento verificadas seguras y cómodas' });

  // Create highlighted description
  const renderDescription = () => {
    const parts = description.split(highlightedText);
    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="text-primary font-semibold">{highlightedText}</span>
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Panel - Text */}
          <div className="order-2 md:order-1">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="text-primary">{t('family')}</span>
              <span className="text-gray-900"> {t('awayFromHome')}</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {renderDescription()}
            </p>
          </div>

          {/* Right Panel - Image */}
          <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden order-1 md:order-2 shadow-sm border border-gray-100 bg-gray-100">
            <Image
              src="/about-image.png"
              alt={t('imageAlt')}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                console.error('Error loading about image');
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
