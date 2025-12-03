'use client';

import { useTranslations } from '@/lib/translations';
import Image from 'next/image';

interface University {
  name: string;
  logo: string;
  alt: string;
}

const universities: University[] = [
  {
    name: 'BUAP',
    logo: '/universities/buap.png',
    alt: 'Universidad Autónoma de Puebla',
  },
  {
    name: 'Tec de Monterrey',
    logo: '/universities/tec.png',
    alt: 'Tecnológico de Monterrey',
  },
  {
    name: 'UDLAP',
    logo: '/universities/udlap.png',
    alt: 'Universidad de las Américas Puebla',
  },
  {
    name: 'IBERO',
    logo: '/universities/ibero.png',
    alt: 'IBERO Puebla',
  },
  {
    name: 'UPAEP',
    logo: '/universities/upaep.png',
    alt: 'UPAEP',
  },
];

export default function UniversitiesBanner() {
  const t = useTranslations('universities');

  // Duplicar las universidades para el scroll infinito
  const duplicatedUniversities = [...universities, ...universities, ...universities];

  return (
    <section className="bg-gray-50 py-10 border-b border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-700 text-base font-semibold mb-8 text-center">
          {t('title')}
        </p>
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-12 animate-scroll">
            {duplicatedUniversities.map((university, index) => (
              <div
                key={`${university.name}-${index}`}
                className="flex items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
              >
                <div className="relative h-12 w-auto max-w-[140px]">
                  <Image
                    src={university.logo}
                    alt={university.alt}
                    width={140}
                    height={48}
                    className="h-full w-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback-text');
                      if (fallback) {
                        (fallback as HTMLElement).style.display = 'block';
                      }
                    }}
                  />
                  <span className="fallback-text hidden text-gray-600 font-semibold text-sm">
                    {university.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
