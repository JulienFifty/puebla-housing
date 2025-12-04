'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutSection() {
  const t = useTranslations('about');
  const locale = useLocale();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: locale === 'es' ? 'Propiedades Verificadas' : 'Verified Properties',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: locale === 'es' ? 'Comunidad Internacional' : 'International Community',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: locale === 'es' ? 'Soporte 24/7' : '24/7 Support',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Panel - Text */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
              {locale === 'es' ? 'Sobre Nosotros' : 'About Us'}
            </span>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">{locale === 'es' ? 'Una familia' : 'A family'}</span>
              <br />
              <span className="text-primary">{locale === 'es' ? 'lejos de tu casa' : 'away from home'}</span>
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {locale === 'es' 
                ? 'Puebla Housing es la organización número 1 en Puebla especializada en acompañar a estudiantes internacionales en su proceso de instalación, ofrecemos un servicio integral que conecta a los estudiantes con opciones de alojamiento verificadas, seguras y cómodas.'
                : 'Puebla Housing is the #1 organization in Puebla specialized in accompanying international students in their installation process, we offer a comprehensive service that connects students with verified, safe and comfortable accommodation options.'}
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <span className="text-gray-900 font-medium">{feature.title}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href={`/${locale}/quien-somos`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all font-semibold shadow-sm hover:shadow-md"
            >
              {locale === 'es' ? 'Conocer más' : 'Learn more'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right Panel - Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100">
              <Image
                src="/about-image.png"
                alt={locale === 'es' ? 'Estudiantes en Puebla' : 'Students in Puebla'}
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
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/20 rounded-2xl -z-10 hidden lg:block"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-2xl -z-10 hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
