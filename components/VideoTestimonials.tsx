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
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials: VideoTestimonial[] = [
    {
      id: '1',
      vimeoId: '1059933425',
      studentName: 'María López',
      country: '🇮🇹 Italia',
      university: 'BUAP',
    },
    {
      id: '2',
      vimeoId: '1095785112',
      studentName: 'Julien',
      country: '🇫🇷 Francia',
      university: 'BUAP',
    },
    {
      id: '3',
      vimeoId: '1065324028',
      studentName: 'Marcus',
      country: '🇧🇷 Brasil',
      university: 'IBERO',
    },
    {
      id: '4',
      vimeoId: '1067168168',
      studentName: 'Lukas',
      country: '🇩🇪 Alemania',
      university: 'UPAEP',
    },
  ];

  const VIDEOS_PER_SLIDE = 3;
  const totalSlides = Math.ceil(testimonials.length / VIDEOS_PER_SLIDE);
  
  const currentVideos = testimonials.slice(
    currentSlide * VIDEOS_PER_SLIDE,
    (currentSlide + 1) * VIDEOS_PER_SLIDE
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setActiveVideo(null); // Cerrar video al cambiar de slide
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setActiveVideo(null); // Cerrar video al cambiar de slide
  };

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

        {/* Video Carousel */}
        <div className="relative">
          {/* Video Grid con animación */}
          <div 
            key={currentSlide}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 animate-fadeIn"
          >
            {currentVideos.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
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
                      {/* Vimeo Thumbnail Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-purple-900/50"></div>
                      
                      {/* Vimeo Thumbnail */}
                      <img
                        src={`https://vumbnail.com/${testimonial.vimeoId}_large.jpg`}
                        alt={testimonial.studentName}
                        className="absolute inset-0 w-full h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback a thumbnail normal si la grande no existe
                          const target = e.target as HTMLImageElement;
                          target.src = `https://vumbnail.com/${testimonial.vimeoId}.jpg`;
                        }}
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                      
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

          {/* Navegación del carrusel */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-center gap-6 mt-8">
              {/* Botón Anterior */}
              <button
                onClick={prevSlide}
                className="p-3 rounded-full bg-white/10 border-2 border-white/30 hover:border-white hover:bg-white/20 transition-all shadow-sm hover:shadow-md"
                aria-label="Videos anteriores"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Indicadores de página */}
              <div className="flex items-center gap-3">
                {Array.from({ length: totalSlides }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentSlide(i);
                      setActiveVideo(null);
                    }}
                    className={`transition-all ${
                      i === currentSlide
                        ? 'w-8 h-2 bg-white rounded-full'
                        : 'w-2 h-2 bg-white/40 rounded-full hover:bg-white/60'
                    }`}
                    aria-label={`Ir a página ${i + 1}`}
                  />
                ))}
              </div>

              {/* Contador */}
              <div className="text-sm text-white font-medium min-w-[80px] text-center">
                {currentSlide + 1} / {totalSlides}
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={nextSlide}
                className="p-3 rounded-full bg-white/10 border-2 border-white/30 hover:border-white hover:bg-white/20 transition-all shadow-sm hover:shadow-md"
                aria-label="Siguientes videos"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
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
