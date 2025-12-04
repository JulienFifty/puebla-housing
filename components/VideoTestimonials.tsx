'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

interface VideoTestimonial {
  id: string;
  vimeoId: string;
  studentName: string;
  country: string;
  university: string;
  thumbnail?: string;
}

export default function VideoTestimonials() {
  const locale = useLocale();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Aquí agregarás los IDs de tus videos de Vimeo
  const testimonials: VideoTestimonial[] = [
    {
      id: '1',
      vimeoId: '1234567890', // Reemplazar con tu ID de Vimeo
      studentName: 'María López',
      country: '🇫🇷 Francia',
      university: 'UDLAP',
    },
    {
      id: '2',
      vimeoId: '1234567891', // Reemplazar con tu ID de Vimeo
      studentName: 'Thomas Weber',
      country: '🇩🇪 Alemania',
      university: 'BUAP',
    },
    {
      id: '3',
      vimeoId: '1234567892', // Reemplazar con tu ID de Vimeo
      studentName: 'Sophie Chen',
      country: '🇨🇳 China',
      university: 'IBERO',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-purple-700 to-indigo-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6 border border-white/20">
            {locale === 'es' ? 'Testimonios' : 'Testimonials'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {locale === 'es' ? 'Lo que dicen nuestros estudiantes' : 'What our students say'}
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {locale === 'es' 
              ? 'Escucha las experiencias reales de estudiantes internacionales que han vivido en nuestras propiedades'
              : 'Hear real experiences from international students who have lived in our properties'}
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Video Container */}
              <div className="relative aspect-[9/16] bg-gray-900">
                {activeVideo === testimonial.id ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${testimonial.vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <button
                    onClick={() => setActiveVideo(testimonial.id)}
                    className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center group/play"
                  >
                    {/* Thumbnail placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-purple-900/50"></div>
                    
                    {/* Play Button */}
                    <div className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover/play:scale-110 transition-transform shadow-xl">
                      <svg className="w-6 h-6 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>

                    {/* Student Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{testimonial.country.split(' ')[0]}</span>
                        <span className="text-sm text-white/80">{testimonial.country.split(' ')[1]}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {testimonial.studentName}
                      </h3>
                      <p className="text-sm text-white/80">{testimonial.university}</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Close button when video is playing */}
              {activeVideo === testimonial.id && (
                <button
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-white/90 text-lg mb-6">
            {locale === 'es' 
              ? '¿Listo para vivir tu propia experiencia en Puebla?' 
              : 'Ready to live your own experience in Puebla?'}
          </p>
          <a
            href={`/${locale}/contacto`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            {locale === 'es' ? 'Contáctanos ahora' : 'Contact us now'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

