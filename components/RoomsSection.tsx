'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import RoomCard from './RoomCard';
import CustomSelect from './CustomSelect';
import { useLocale } from 'next-intl';

export default function RoomsSection() {
  const t = useTranslations('rooms');
  const locale = useLocale();
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [rooms, setRooms] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const ITEMS_PER_SLIDE = 6;

  // Fetch properties and rooms
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, roomsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/rooms'),
        ]);

        const propertiesData = await propertiesRes.json();
        const roomsData = await roomsRes.json();

        setProperties(propertiesData || []);
        setRooms(roomsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique property names
  const propertyOptions = useMemo(() => {
    const allProperties = [
      { value: 'all', label: { es: 'Todas las casas', en: 'All properties' } },
      ...properties.map((prop) => ({
        value: prop.id,
        label: { es: prop.name_es, en: prop.name_en },
      })),
    ];
    return allProperties;
  }, [properties]);

  // Semester options
  const semesterOptions = [
    { value: 'all', label: { es: 'Todos los semestres', en: 'All semesters' } },
    {
      value: 'enero-junio-2026',
      label: { es: 'Enero - Junio 2026', en: 'January - June 2026' },
    },
    {
      value: 'junio-diciembre-2026',
      label: { es: 'Junio - Diciembre 2026', en: 'June - December 2026' },
    },
  ];

  // Filter rooms
  const filteredRooms = useMemo(() => {
    let filtered = rooms.filter((room) => room.available !== false);

    if (selectedProperty !== 'all') {
      filtered = filtered.filter((room) => room.property_id === selectedProperty);
    }

    if (selectedSemester !== 'all') {
      filtered = filtered.filter((room) => room.semester === selectedSemester);
    }

    return filtered;
  }, [rooms, selectedProperty, selectedSemester]);

  // Reset currentSlide cuando cambien los filtros
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedProperty, selectedSemester]);

  const totalSlides = Math.ceil(filteredRooms.length / ITEMS_PER_SLIDE);
  const currentRooms = filteredRooms.slice(
    currentSlide * ITEMS_PER_SLIDE,
    (currentSlide + 1) * ITEMS_PER_SLIDE
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section id="rooms-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-primary">{t('title')}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Property Filter */}
            <div>
              <CustomSelect
                label={t('filterProperty')}
                options={propertyOptions.map((opt) => ({
                  value: opt.value,
                  label: opt.label[locale as 'es' | 'en'],
                }))}
                value={selectedProperty}
                onChange={setSelectedProperty}
                placeholder={t('filterProperty')}
              />
            </div>

            {/* Semester Filter */}
            <div>
              <CustomSelect
                label={t('filterSemester')}
                options={semesterOptions.map((opt) => ({
                  value: opt.value,
                  label: opt.label[locale as 'es' | 'en'],
                }))}
                value={selectedSemester}
                onChange={setSelectedSemester}
                placeholder={t('filterSemester')}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 font-medium">
            {filteredRooms.length} {t('resultsCount', { defaultValue: 'habitaciones encontradas', count: filteredRooms.length })}
          </p>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{t('loading', { defaultValue: 'Cargando habitaciones...' })}</p>
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="relative">
            {/* Grid de habitaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>

            {/* Navegación del carrusel */}
            {totalSlides > 1 && (
              <div className="flex items-center justify-center gap-6 mt-8">
                {/* Botón Anterior */}
                <button
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Habitaciones anteriores"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Indicadores de página */}
                <div className="flex items-center gap-3">
                  {Array.from({ length: totalSlides }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`transition-all ${
                        i === currentSlide
                          ? 'w-8 h-2 bg-primary rounded-full'
                          : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                      }`}
                      aria-label={`Ir a página ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Contador */}
                <div className="text-sm text-gray-600 font-medium min-w-[80px] text-center">
                  {currentSlide + 1} / {totalSlides}
                </div>

                {/* Botón Siguiente */}
                <button
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Siguientes habitaciones"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">{t('noResults', { defaultValue: 'No se encontraron habitaciones' })}</p>
          </div>
        )}
      </div>
    </section>
  );
}
