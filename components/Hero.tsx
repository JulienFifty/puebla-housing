'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoError = (e: any) => {
    console.error('Error loading video:', e);
    console.error('Video source attempted:', '/hero-video.mp4');
    setVideoError(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/casas?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onError={handleVideoError}
            onLoadedData={() => console.log('Video cargado correctamente')}
            onCanPlay={() => console.log('Video listo para reproducir')}
            className="absolute inset-0 w-full h-full object-cover"
            preload="auto"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            <source src="/hero-video.mov" type="video/quicktime" />
            Tu navegador no soporta el elemento de video.
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920')",
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
            {t('subtitle')}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 border border-white/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white text-sm font-normal">{t('verified')}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 border border-white/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-white text-sm font-normal">{t('support')}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 border border-white/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white text-sm font-normal">{t('guarantee')}</span>
            </div>
          </div>
        </div>

        {/* Premium Search Bar */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-white/20 p-2 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 px-6 py-4 bg-transparent text-text-main placeholder-text-secondary focus:outline-none text-base font-normal"
            />
            <button
              type="submit"
              className="bg-primary text-white rounded-full p-4 hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl flex items-center justify-center min-w-[56px]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Video Control */}
      <button
        onClick={togglePlay}
        className="absolute bottom-8 right-8 z-20 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
        aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
      >
        {isPlaying ? (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </section>
  );
}

