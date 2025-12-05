'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import NearbyLocationsMap from '@/components/NearbyLocationsMap';

interface Property {
  id: string;
  name_es: string;
  name_en: string;
  slug: string;
  location_es: string;
  location_en: string;
  address: string;
  description_es: string;
  description_en: string;
  images: string[];
  available: boolean;
  total_rooms?: number;
  room_types?: ('private' | 'shared')[];
  rooms?: any[];
  zone?: string;
  latitude?: number;
  longitude?: number;
  google_place_id?: string;
}

interface GoogleReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface ReviewsData {
  reviews: GoogleReview[];
  rating: number;
  totalReviews: number;
}

export default function PropertyPage({ params }: { params: { slug: string; locale: string } }) {
  const t = useTranslations();
  const tProperty = useTranslations('property');
  const locale = useLocale() as 'es' | 'en';
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'amenities' | 'reviews' | 'policies'>('overview');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [roomTypeFilter, setRoomTypeFilter] = useState<'all' | 'private' | 'shared'>('all');
  const [bathroomTypeFilter, setBathroomTypeFilter] = useState<'all' | 'private' | 'shared'>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleTabClick = (tab: 'overview' | 'rooms' | 'amenities' | 'reviews' | 'policies') => {
    setActiveTab(tab);
    const element = document.getElementById(tab);
    if (element) {
      const globalHeaderHeight = 80; // Header global h-20 = 80px
      const localHeaderHeight = 64; // Header local h-16 = 64px
      const tabsHeight = 60; // Altura aproximada de los tabs
      const offset = globalHeaderHeight + localHeaderHeight + tabsHeight + 20;
      
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const scrollPosition = elementTop - offset;

      window.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (!property) return;

      const updateActiveTab = () => {
      const sections = ['overview', 'rooms', 'amenities', 'reviews', 'policies'];
      const scrollY = window.scrollY || window.pageYOffset;
      const globalHeaderHeight = 80; // Header global h-20 = 80px
      const localHeaderHeight = 64; // Header local h-16 = 64px
      const tabsHeight = 60; // Altura aproximada de los tabs
      const offset = globalHeaderHeight + localHeaderHeight + tabsHeight + 20;

      let currentSection = 'overview';

      // Verificar cada sección de abajo hacia arriba
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + scrollY;
          
          // Si el scroll ha pasado el inicio de esta sección (con margen)
          if (scrollY + offset >= sectionTop - 100) {
            currentSection = sections[i];
            break;
          }
        }
      }

      setActiveTab(currentSection as any);
    };

    // Esperar a que el DOM esté completamente renderizado
    const initScroll = () => {
      updateActiveTab();
      window.addEventListener('scroll', updateActiveTab, { passive: true });
    };

    const timeoutId = setTimeout(initScroll, 300);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', updateActiveTab);
    };
  }, [property]);

  useEffect(() => {
    fetchProperty();
  }, [params.slug]);

  const fetchProperty = async () => {
    try {
      const res = await fetch(`/api/properties/slug/${params.slug}`);
      if (!res.ok) throw new Error('Property not found');
      const data = await res.json();
      setProperty(data);
      
      // Si la propiedad tiene un Google Place ID, obtener las reseñas
      if (data.google_place_id) {
        fetchReviews(data.google_place_id, data.id);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (placeId: string, propertyId: string) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}/reviews?placeId=${placeId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Propiedad no encontrada</h1>
          <Link href={`/${locale}/casas`} className="text-primary hover:underline">
            Volver a propiedades
          </Link>
        </div>
      </div>
    );
  }

  const propertyName = property[`name_${locale}`] || property.name_es;
  const propertyLocation = property[`location_${locale}`] || property.location_es;
  const propertyDescription = property[`description_${locale}`] || property.description_es;
  const allImages = property.images || [];
  const mainImage = allImages[selectedImageIndex] || allImages[0];
  const thumbnailImages = allImages.slice(0, 5);
  const totalRooms = property.total_rooms || property.rooms?.length || 0;
  const roomTypes = property.room_types || [];

  const whatsappNumber = '5212221234567';
  const whatsappMessage = encodeURIComponent(
    `Hola, estoy interesado en reservar una habitación en ${propertyName}`
  );

  const amenities = [
    { icon: 'wifi', label: 'WiFi de alta velocidad' },
    { icon: 'kitchen', label: 'Cocina equipada' },
    { icon: 'laundry', label: 'Lavandería' },
    { icon: 'security', label: 'Seguridad 24/7' },
    { icon: 'common', label: 'Áreas comunes' },
    { icon: 'cleaning', label: 'Limpieza semanal' },
  ];

  const getAmenityIcon = (icon: string) => {
    const icons: Record<string, JSX.Element> = {
      wifi: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      kitchen: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      laundry: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      security: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      common: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      cleaning: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    };
    return icons[icon] || icons.wifi;
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}/casas`} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Volver</span>
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.885 12.938 9 12.482 9 12c0-.482-.115-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery - Airbnb Style */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[320px] md:h-[420px]">
            {/* Main Large Image */}
            <div className="col-span-2 md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={propertyName}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {allImages.length > 1 && (
                <button
                  onClick={() => setShowAllImages(true)}
                  className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {tProperty('viewAllPhotos')}
                </button>
              )}
            </div>

            {/* Thumbnail Images - Grid de 2x2 en el lado derecho */}
            {thumbnailImages.slice(1, 5).map((image, index) => {
              // En desktop: todas las thumbnails ocupan 1 columna y 1 fila
              // En mobile: 2 columnas
              return (
                <div
                  key={index + 1}
                  className="col-span-1 md:col-span-1 relative rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedImageIndex(index + 1)}
                >
                  <Image
                    src={image}
                    alt={`${propertyName} - Image ${index + 2}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {index === 3 && allImages.length > 5 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        +{allImages.length - 5} más
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Property Header Info - Visible immediately after gallery */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Title and Basic Info */}
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {propertyName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{propertyLocation}</span>
              </div>
              {property.address && (
                <div className="text-sm text-gray-500">
                  {property.address}
                </div>
              )}
            </div>
            
            {/* Quick Info Pills */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{totalRooms} {tProperty('rooms')}</span>
              </div>
              {property.rooms && property.rooms.length > 0 && (
                <div className="flex items-center gap-2 bg-green-50 border-2 border-green-200 px-4 py-2 rounded-full shadow-sm">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold text-green-700">
                    {property.rooms.filter((r: any) => r.available).length} {tProperty('available')}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">4.8</span>
                <span className="text-xs text-gray-500">(24 {locale === 'es' ? 'reseñas' : 'reviews'})</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Sticky Tabs Menu - Only in left column */}
              <div 
                className="bg-white border-b border-gray-200 shadow-sm mb-6"
                style={{ 
                  position: 'sticky',
                  top: '80px',
                  zIndex: 50
                }}
              >
                <div className="flex gap-8 overflow-x-auto py-4">
                  {[
                    { id: 'overview', label: tProperty('tabs.overview') },
                    { id: 'rooms', label: tProperty('tabs.rooms') },
                    { id: 'amenities', label: tProperty('tabs.amenities') },
                    { id: 'reviews', label: tProperty('tabs.reviews') },
                    { id: 'policies', label: tProperty('tabs.policies') },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id as any)}
                      className={`pb-2 px-1 font-semibold text-sm transition-all duration-200 relative whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-all duration-200"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content - All sections visible */}
              <div className="mb-8 space-y-8">
                {/* Overview Section */}
                <div id="overview" className="scroll-mt-24">
                  <div className="space-y-8">
                    {/* About the Property Block */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{tProperty('aboutProperty')}</h2>
                      <div className="space-y-3">
                        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                          {propertyDescription}
                        </p>
                        {property.rooms && property.rooms.length > 0 && (
                          <p className="text-gray-700 leading-relaxed text-base">
                            {tProperty('propertyDescription', {
                              count: totalRooms,
                              types: roomTypes.includes('private') && roomTypes.includes('shared') 
                                ? tProperty('roomTypes.privateAndShared')
                                : roomTypes.includes('private') 
                                ? tProperty('roomTypes.private')
                                : tProperty('roomTypes.shared')
                            })}
                          </p>
                        )}
                        <button className="text-primary font-medium hover:underline mt-3 flex items-center gap-1 text-sm">
                          {tProperty('viewMore')} <span>&gt;</span>
                        </button>
                      </div>
                    </div>

                    {/* The Space Block */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900 mb-5">{tProperty('theSpace')}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-base mb-1">{tProperty('comfortableRooms')}</p>
                            <p className="text-gray-600 text-sm">{tProperty('comfortableRoomsDesc')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-base mb-1">{tProperty('bathrooms')} {roomTypes.includes('private') ? tProperty('bathroomsPrivate') : tProperty('bathroomsShared')}</p>
                            <p className="text-gray-600 text-sm">{tProperty('bathroomsDesc')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-base mb-1">{tProperty('centralLocation')}</p>
                            <p className="text-gray-600 text-sm">{tProperty('centralLocationDesc')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guest Access Block */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900 mb-5">Acceso de Huéspedes</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-sm">{tProperty('fullAccess')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-sm">WiFi de alta velocidad en toda la propiedad</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-sm">{tProperty('studyAreas')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 text-sm">Seguridad 24/7 y control de acceso</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rooms Section */}
                <div id="rooms" className="scroll-mt-24">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{tProperty('availableRooms')}</h2>
                        <p className="text-sm text-gray-600">
                          {property.rooms?.length || 0} {tProperty('roomsInProperty')}
                        </p>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 space-y-4">
                      {/* Toggle Disponibilidad */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{tProperty('showAvailableOnly')}</p>
                            <p className="text-xs text-gray-500">{tProperty('hideUnavailable')}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showAvailableOnly}
                            onChange={(e) => setShowAvailableOnly(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      {/* Filtros de Tipo */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Filtro Tipo de Habitación */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {tProperty('roomType')}
                          </label>
                          <select
                            value={roomTypeFilter}
                            onChange={(e) => setRoomTypeFilter(e.target.value as any)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                          >
                            <option value="all">{tProperty('allTypes')}</option>
                            <option value="private">{t('rooms.private')}</option>
                            <option value="shared">{t('rooms.shared')}</option>
                          </select>
                        </div>

                        {/* Filtro Tipo de Baño */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {tProperty('bathroomType')}
                          </label>
                          <select
                            value={bathroomTypeFilter}
                            onChange={(e) => setBathroomTypeFilter(e.target.value as any)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                          >
                            <option value="all">{tProperty('allBathrooms')}</option>
                            <option value="private">{tProperty('bathroomPrivate')}</option>
                            <option value="shared">{tProperty('bathroomShared')}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Rooms Grid */}
                    {property.rooms && property.rooms.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {property.rooms
                          .filter((room: any) => {
                            // Filtro de disponibilidad
                            if (showAvailableOnly && !room.available) return false;
                            // Filtro de tipo de habitación
                            if (roomTypeFilter !== 'all' && room.type !== roomTypeFilter) return false;
                            // Filtro de tipo de baño
                            if (bathroomTypeFilter !== 'all' && room.bathroom_type !== bathroomTypeFilter) return false;
                            return true;
                          })
                          .sort((a: any, b: any) => {
                            // Ordenar por número de habitación (del más pequeño al más grande)
                            const numA = parseInt(a.room_number) || 0;
                            const numB = parseInt(b.room_number) || 0;
                            return numA - numB;
                          })
                          .map((room: any) => (
                            <div
                              key={room.id}
                              className={`bg-white rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                                room.available
                                  ? 'border-gray-200 hover:border-primary'
                                  : 'border-gray-300 opacity-60'
                              }`}
                            >
                              {/* Room Image */}
                              <div className="relative h-48 bg-gray-200">
                                {room.images && room.images.length > 0 ? (
                                  <Image
                                    src={room.images[0]}
                                    alt={`${tProperty('room')} ${room.room_number}`}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                  </div>
                                )}
                                {/* Badge Disponibilidad */}
                                <div className="absolute top-3 right-3">
                                  {room.available ? (
                                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-md">
                                      {tProperty('availableLabel')}
                                    </span>
                                  ) : room.available_from ? (
                                    <span className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-md">
                                      {tProperty('availableFrom')}{' '}
                                      {new Date(room.available_from).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
                                        day: 'numeric',
                                        month: 'short',
                                      })}
                                    </span>
                                  ) : (
                                    <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full shadow-md">
                                      {tProperty('notAvailable')}
                                    </span>
                                  )}
                                </div>
                                {/* Badge Tipo */}
                                <div className="absolute top-3 left-3">
                                  <span className="px-3 py-1 bg-white/90 text-gray-700 text-xs font-semibold rounded-full shadow-md">
                                    {room.type === 'private' ? tProperty('private') : tProperty('shared')}
                                  </span>
                                </div>
                              </div>

                              {/* Room Info */}
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {tProperty('room')} #{room.room_number}
                                  </h3>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                  {locale === 'es' ? room.description_es : room.description_en || room.description_es}
                                </p>

                                {/* Room Features */}
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{tProperty('bathrooms')} {room.bathroom_type === 'private' ? tProperty('bathroomPrivate') : tProperty('bathroomShared')}</span>
                                  </div>
                                  {room.semester && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
                                      </svg>
                                      <span>{room.semester}</span>
                                    </div>
                                  )}
                                  {room.amenities && room.amenities.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span>{tProperty('amenitiesCount', { count: room.amenities.length })}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                  <Link
                                    href={`/${locale}/casas/${property?.slug}/habitacion/${room.id}`}
                                    className="block w-full py-2.5 rounded-lg font-semibold text-sm transition-colors bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md text-center"
                                  >
                                    {tProperty('viewDetails')}
                                  </Link>
                                  <button
                                    onClick={() => {
                                      const formElement = document.getElementById('contact-form');
                                      if (formElement) {
                                        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        formElement.querySelector('input')?.focus();
                                      }
                                    }}
                                    disabled={!room.available && !room.available_from}
                                    className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
                                      room.available || room.available_from
                                        ? 'border border-primary text-primary hover:bg-primary/5'
                                        : 'border border-gray-300 text-gray-400 cursor-not-allowed'
                                    }`}
                                  >
                                    {room.available 
                                      ? tProperty('requestInfo')
                                      : room.available_from 
                                        ? tProperty('book')
                                        : tProperty('notAvailable')
                                    }
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <p className="text-gray-600 text-lg mb-2">{tProperty('noRoomsAvailable')}</p>
                        <p className="text-gray-500 text-sm">{tProperty('noRoomsRegistered')}</p>
                      </div>
                    )}

                    {/* Contador de resultados */}
                    {property.rooms && property.rooms.length > 0 && (
                      <div className="mt-6 text-center text-sm text-gray-600">
                        {tProperty('showing')}{' '}
                        <span className="font-semibold text-gray-900">
                          {
                            property.rooms.filter((room: any) => {
                              if (showAvailableOnly && !room.available) return false;
                              if (roomTypeFilter !== 'all' && room.type !== roomTypeFilter) return false;
                              if (bathroomTypeFilter !== 'all' && room.bathroom_type !== bathroomTypeFilter) return false;
                              return true;
                            }).length
                          }
                        </span>{' '}
                        {tProperty('of')} {property.rooms.length} {tProperty('rooms')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amenities Section */}
                <div id="amenities" className="scroll-mt-24">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{tProperty('amenities')}</h2>
                    <h3 className="text-lg font-semibold text-gray-700 mb-5">{tProperty('commonAmenities')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 flex-shrink-0">
                            {getAmenityIcon(amenity.icon)}
                          </div>
                          <span className="text-gray-700 font-medium text-sm">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                    <button className="text-primary font-medium hover:underline mt-5 flex items-center gap-1 text-sm">
                      {tProperty('viewAllAmenities', { count: amenities.length })} <span>&gt;</span>
                    </button>
                  </div>
                </div>

                {/* Reviews Section */}
                <div id="reviews" className="scroll-mt-24">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    {reviewsLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-2 text-gray-600">{t('reviews.loading')}</p>
                      </div>
                    ) : reviews && reviews.reviews.length > 0 ? (
                      <>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xl font-bold text-gray-900">{reviews.rating.toFixed(1)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-base">{reviews.totalReviews} {t('reviews.reviews')}</p>
                            <p className="text-sm text-gray-600">{t('reviews.basedOn')}</p>
                          </div>
                        </div>
                        <div className="space-y-5">
                          {reviews.reviews.slice(0, 5).map((review, index) => (
                            <div key={index} className="border-b border-gray-200 pb-5 last:border-0">
                              <div className="flex items-center gap-3 mb-3">
                                {review.profile_photo_url ? (
                                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                    <Image
                                      src={review.profile_photo_url}
                                      alt={review.author_name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-semibold text-sm">
                                    {review.author_name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 text-sm">{review.author_name}</p>
                                  <p className="text-xs text-gray-500">{review.relative_time_description}</p>
                                </div>
                                {review.author_url && (
                                  <a
                                    href={review.author_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-xs"
                                  >
                                    {t('reviews.viewOnGoogle')}
                                  </a>
                                )}
                              </div>
                              <div className="flex gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
                            </div>
                          ))}
                        </div>
                        {reviews.totalReviews > 5 && (
                          <a
                            href={`https://www.google.com/maps/place/?q=place_id:${property?.google_place_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-medium hover:underline mt-5 flex items-center gap-1 text-sm"
                          >
                            {t('reviews.viewAllReviews')} ({reviews.totalReviews}) <span>&gt;</span>
                          </a>
                        )}
                      </>
                    ) : property?.google_place_id ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">{t('reviews.noReviews')}</p>
                        <a
                          href={`https://www.google.com/maps/place/?q=place_id:${property.google_place_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          {t('reviews.viewOnGoogleMaps')}
                        </a>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">{t('reviews.notConfigured')}</p>
                      </div>
                    )}
                </div>
              </div>

                {/* Policies Section */}
                <div id="policies" className="scroll-mt-24">
                  <div className="space-y-6">
                    {/* Cancellation Policy Block */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{tProperty('cancellationPolicy')}</h2>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {tProperty('cancellationPolicyDesc')}
                      </p>
              </div>

                    {/* House Rules Block */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{tProperty('houseRules')}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-700 text-sm">{tProperty('houseRulesList.noParties')}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-700 text-sm">{tProperty('houseRulesList.noSmoking')}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-700 text-sm">{tProperty('houseRulesList.quietHours')}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-700 text-sm">{tProperty('houseRulesList.cleanCommonAreas')}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-gray-700 text-sm">{tProperty('houseRulesList.noPets')}</span>
                        </div>
                      </div>
              </div>

                    {/* Check-in/Check-out Block */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{tProperty('checkInOut')}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <p className="font-semibold text-gray-900 mb-2 text-sm">{tProperty('checkIn')}</p>
                          <p className="text-gray-700 text-sm">{tProperty('checkInTime')}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-2 text-sm">{tProperty('checkOut')}</p>
                          <p className="text-gray-700 text-sm">{tProperty('checkOutTime')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sidebar - Sticky Contact Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleTabClick('rooms')}
                    className="block w-full bg-primary text-white py-4 rounded-xl font-bold text-center hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg"
                  >
                    {tProperty('viewRooms')}
                  </button>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="block w-full bg-white text-primary border-2 border-primary py-4 rounded-xl font-bold text-center hover:bg-primary/5 transition-colors"
                  >
                    {tProperty('requestInformation')}
                  </button>
                </div>

                {/* Recent Booking Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-blue-800 font-medium">
                      <span className="font-semibold">{tProperty('recentBookings', { count: 3 })}</span>
                    </p>
                  </div>
                </div>

                {/* Features Section */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{tProperty('instantBooking')}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{tProperty('bestPriceGuaranteed')}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{tProperty('verifiedProperties')}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{tProperty('personalAssistance')}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{tProperty('reviewsCount')}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <div className="pt-6 border-t border-gray-200">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold text-center hover:bg-emerald-600 transition-colors shadow-sm hover:shadow-md"
                  >
                    {tProperty('contactWhatsApp')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {showAllImages && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full h-full flex flex-col">
            <button
              onClick={() => setShowAllImages(false)}
              className="absolute top-4 right-4 z-10 bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto">
              {allImages.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${propertyName} - Image ${index + 1}`}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal - Solo formulario */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">{tProperty('requestInformation')}</h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Solo formulario */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                {tProperty('contactFormDesc')}
              </p>
              
              <ContactForm
                type="reservation"
                propertySlug={property?.slug}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
