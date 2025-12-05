'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

interface Room {
  id: string;
  property_id: string;
  room_number: string;
  type: 'private' | 'shared';
  bathroom_type: 'private' | 'shared';
  description_es: string;
  description_en: string;
  images: string[];
  available: boolean;
  available_from?: string | null;
  semester?: string;
  amenities: string[];
  has_private_kitchen?: boolean;
  is_entire_place?: boolean;
}

interface Property {
  id: string;
  name_es: string;
  name_en: string;
  slug: string;
  location_es: string;
  location_en: string;
  address: string;
  zone?: string;
  images: string[];
}

export default function RoomPage({ params }: { params: { slug: string; roomId: string; locale: string } }) {
  const t = useTranslations();
  const locale = useLocale() as 'es' | 'en' | 'fr';
  const [room, setRoom] = useState<Room | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [otherRooms, setOtherRooms] = useState<Room[]>([]);
  const [loadingOtherRooms, setLoadingOtherRooms] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch room data (includes property data)
        const roomRes = await fetch(`/api/rooms/${params.roomId}`);
        if (!roomRes.ok) throw new Error('Room not found');
        const roomData = await roomRes.json();
        setRoom(roomData);

        // La propiedad viene incluida en la respuesta de la habitación
        if (roomData.properties) {
          setProperty(roomData.properties);
        } else if (roomData.property_id) {
          // Fallback: fetch property separately if not included
          const propRes = await fetch(`/api/properties/${roomData.property_id}`);
          if (propRes.ok) {
            const propData = await propRes.json();
            setProperty(propData);
          }
        }

        // Cargar las demás habitaciones de la misma propiedad
        if (roomData.property_id) {
          fetchOtherRooms(roomData.property_id, roomData.id);
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.roomId]);

  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      'es': 'es-MX',
      'en': 'en-US',
      'fr': 'fr-FR'
    };
    return date.toLocaleDateString(localeMap[locale] || 'es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Fetch otras habitaciones de la misma propiedad
  const fetchOtherRooms = async (propertyId: string, currentRoomId: string) => {
    setLoadingOtherRooms(true);
    try {
      const res = await fetch(`/api/rooms?propertyId=${propertyId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // Filtrar la habitación actual y ordenar por número
      const filtered = (data || [])
        .filter((r: Room) => r.id !== currentRoomId && r.available)
        .sort((a: Room, b: Room) => {
          const numA = parseInt(a.room_number) || 0;
          const numB = parseInt(b.room_number) || 0;
          return numA - numB;
        });
      setOtherRooms(filtered);
    } catch (error) {
      console.error('Error fetching other rooms:', error);
    } finally {
      setLoadingOtherRooms(false);
    }
  };

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, JSX.Element> = {
      wifi: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      ac: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      desk: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      closet: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      bed: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      default: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    };
    return icons[amenity.toLowerCase()] || icons.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">{locale === 'es' ? 'Cargando...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'es' ? 'Habitación no encontrada' : 'Room not found'}
          </h1>
          <Link href={`/${locale}/casas`} className="text-primary hover:underline">
            {locale === 'es' ? 'Ver todas las casas' : 'View all properties'}
          </Link>
        </div>
      </div>
    );
  }

  // Filtrar imágenes válidas (no vacías, no null)
  const validRoomImages = (room.images || []).filter((img: string) => img && img.trim() !== '');
  const validPropertyImages = (property?.images || []).filter((img: string) => img && img.trim() !== '');
  
  const roomImages = validRoomImages.length > 0 
    ? validRoomImages 
    : validPropertyImages.length > 0
      ? validPropertyImages
      : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'];

  const propertyName = property ? (locale === 'es' ? property.name_es : property.name_en) : '';
  const roomDescription = locale === 'es' ? room.description_es : (room.description_en || room.description_es);
  const availableFromDate = formatDate(room.available_from);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href={`/${locale}`} className="text-gray-500 hover:text-primary">
              {locale === 'es' ? 'Inicio' : 'Home'}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${locale}/casas`} className="text-gray-500 hover:text-primary">
              {locale === 'es' ? 'Casas' : 'Properties'}
            </Link>
            <span className="text-gray-400">/</span>
            {property && (
              <>
                <Link href={`/${locale}/casas/${property.slug}`} className="text-gray-500 hover:text-primary">
                  {propertyName}
                </Link>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">
              {locale === 'es' ? 'Habitación' : 'Room'} #{room.room_number}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-0">
          {/* Sidebar con otras habitaciones - Solo visible en desktop */}
          {room && property && (otherRooms.length > 0 || loadingOtherRooms) && (
            <>
              {/* Botón para abrir/cerrar sidebar */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 bg-white border-2 border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:border-primary"
                aria-label={sidebarOpen ? (locale === 'es' ? 'Cerrar sidebar' : locale === 'fr' ? 'Fermer la barre latérale' : 'Close sidebar') : (locale === 'es' ? 'Abrir sidebar' : locale === 'fr' ? 'Ouvrir la barre latérale' : 'Open sidebar')}
              >
                <svg 
                  className={`w-5 h-5 text-gray-700 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <aside className={`hidden xl:block transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'w-80' : 'w-0'
              } flex-shrink-0 overflow-hidden`}>
                <div className="sticky top-28 bg-white rounded-2xl shadow-lg border border-gray-200 p-5 ml-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    {locale === 'es' 
                      ? 'Otras Habitaciones' 
                      : locale === 'fr'
                      ? 'Autres Chambres'
                      : 'Other Rooms'}
                  </h3>
                  <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
                    {loadingOtherRooms ? (
                      <div className="text-sm text-gray-500 text-center py-4">
                        {locale === 'es' ? 'Cargando...' : locale === 'fr' ? 'Chargement...' : 'Loading...'}
                      </div>
                    ) : otherRooms.length > 0 ? (
                      otherRooms.map((otherRoom) => {
                        const roomImages = (otherRoom.images || []).filter((img: string) => img && img.trim() !== '');
                        const roomImage = roomImages.length > 0 
                          ? roomImages[0] 
                          : (property.images && property.images.length > 0 
                            ? property.images[0] 
                            : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800');
                        
                        return (
                          <Link
                            key={otherRoom.id}
                            href={`/${locale}/casas/${property.slug}/habitacion/${otherRoom.id}`}
                            className={`block rounded-xl border transition-all overflow-hidden ${
                              otherRoom.id === params.roomId
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-gray-200 hover:border-primary hover:bg-gray-50 hover:shadow-md'
                            }`}
                          >
                            {/* Imagen de la habitación */}
                            <div className="relative w-full h-40 bg-gray-200">
                              <Image
                                src={roomImage}
                                alt={`${locale === 'es' ? 'Habitación' : locale === 'fr' ? 'Chambre' : 'Room'} ${otherRoom.room_number}`}
                                fill
                                className="object-cover"
                              />
                              {/* Badge de disponibilidad */}
                              <div className="absolute top-2 right-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  otherRoom.available ? 'bg-green-500' : 'bg-red-500'
                                }`} title={otherRoom.available 
                                  ? (locale === 'es' ? 'Disponible' : locale === 'fr' ? 'Disponible' : 'Available')
                                  : (locale === 'es' ? 'No disponible' : locale === 'fr' ? 'Non disponible' : 'Not available')
                                } />
                              </div>
                            </div>
                            
                            {/* Información de la habitación */}
                            <div className="p-4">
                              <div className="font-semibold text-base text-gray-900 mb-2">
                                {locale === 'es' ? 'Habitación' : locale === 'fr' ? 'Chambre' : 'Room'} {otherRoom.room_number}
                              </div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  otherRoom.type === 'private'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {otherRoom.type === 'private'
                                    ? (locale === 'es' ? 'Privada' : locale === 'fr' ? 'Privée' : 'Private')
                                    : (locale === 'es' ? 'Compartida' : locale === 'fr' ? 'Partagée' : 'Shared')
                                  }
                                </span>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  otherRoom.bathroom_type === 'private'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {otherRoom.bathroom_type === 'private'
                                    ? (locale === 'es' ? 'Baño privado' : locale === 'fr' ? 'Salle de bain privée' : 'Private bath')
                                    : (locale === 'es' ? 'Baño compartido' : locale === 'fr' ? 'Salle de bain partagée' : 'Shared bath')
                                  }
                                </span>
                              </div>
                              {otherRoom.available_from && (
                                <div className="text-xs text-gray-500">
                                  {locale === 'es' 
                                    ? `Disponible desde ${formatDate(otherRoom.available_from)}`
                                    : locale === 'fr'
                                    ? `Disponible à partir du ${formatDate(otherRoom.available_from)}`
                                    : `Available from ${formatDate(otherRoom.available_from)}`
                                  }
                                </div>
                              )}
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-4">
                        {locale === 'es' 
                          ? 'No hay otras habitaciones disponibles'
                          : locale === 'fr'
                          ? 'Aucune autre chambre disponible'
                          : 'No other rooms available'
                        }
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/${locale}/casas/${property.slug}`}
                    className="mt-4 block text-center text-sm text-primary hover:text-primary-hover font-medium"
                  >
                    {locale === 'es' 
                      ? 'Ver todas las habitaciones →'
                      : locale === 'fr'
                      ? 'Voir toutes les chambres →'
                      : 'View all rooms →'
                    }
                  </Link>
                </div>
              </aside>
            </>
          )}

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Images and Details */}
              <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              {/* Main Image */}
              <div className="relative aspect-[16/10] bg-gray-200">
                <Image
                  src={roomImages[selectedImageIndex]}
                  alt={`${propertyName} - Habitación ${room.room_number}`}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Availability Badge */}
                <div className="absolute top-4 left-4">
                  {room.available ? (
                    <span className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full shadow-lg">
                      {locale === 'es' ? 'Disponible' : 'Available'}
                    </span>
                  ) : room.available_from ? (
                    <span className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-full shadow-lg">
                      {locale === 'es' 
                        ? `Disponible a partir del ${availableFromDate}`
                        : `Available from ${availableFromDate}`
                      }
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-gray-500 text-white text-sm font-semibold rounded-full shadow-lg">
                      {locale === 'es' ? 'No Disponible' : 'Not Available'}
                    </span>
                  )}
                </div>

                {/* Image Navigation */}
                {roomImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : roomImages.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev < roomImages.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm">
                      {selectedImageIndex + 1} / {roomImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {roomImages.length > 1 && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {roomImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Imagen ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {propertyName} - {locale === 'es' ? 'Habitación' : 'Room'} #{room.room_number}
              </h1>
              
              {property && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{property.address}</span>
                </div>
              )}

              {/* Room Type Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  room.type === 'private' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {room.type === 'private' 
                    ? (locale === 'es' ? 'Habitación Privada' : 'Private Room')
                    : (locale === 'es' ? 'Habitación Compartida' : 'Shared Room')
                  }
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  room.bathroom_type === 'private' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {room.bathroom_type === 'private' 
                    ? (locale === 'es' ? 'Baño Privado' : 'Private Bathroom')
                    : (locale === 'es' ? 'Baño Compartido' : 'Shared Bathroom')
                  }
                </span>
                {room.has_private_kitchen && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                    {locale === 'es' ? 'Cocina Privada' : 'Private Kitchen'}
                  </span>
                )}
                {room.is_entire_place && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                    {locale === 'es' ? 'Lugar Completo' : 'Entire Place'}
                  </span>
                )}
                {room.semester && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                    {room.semester === 'enero-junio-2026'
                      ? (locale === 'es' ? 'Enero - Junio 2026' : 'January - June 2026')
                      : (locale === 'es' ? 'Junio - Diciembre 2026' : 'June - December 2026')
                    }
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {locale === 'es' ? 'Descripción' : 'Description'}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {roomDescription || (locale === 'es' 
                    ? 'Esta habitación ofrece un espacio cómodo y bien equipado para estudiantes.' 
                    : 'This room offers a comfortable and well-equipped space for students.'
                  )}
                </p>
              </div>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {locale === 'es' ? 'Amenidades de la Habitación' : 'Room Amenities'}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                          {getAmenityIcon(amenity)}
                        </div>
                        <span className="text-gray-700 font-medium text-sm capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Info Card */}
            {property && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {locale === 'es' ? 'Sobre la Casa' : 'About the Property'}
                </h2>
                <Link 
                  href={`/${locale}/casas/${property.slug}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={property.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
                      alt={propertyName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {propertyName}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{property.address}</p>
                    <p className="text-primary text-sm font-medium mt-2 flex items-center gap-1">
                      {locale === 'es' ? 'Ver todas las habitaciones' : 'View all rooms'}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {locale === 'es' ? 'Reservar esta habitación' : 'Book this room'}
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  {locale === 'es' 
                    ? 'Completa el formulario y nos pondremos en contacto contigo.' 
                    : 'Fill out the form and we will contact you.'
                  }
                </p>
                
                <ContactForm 
                  type="reservation"
                  propertySlug={property?.slug}
                  roomId={room.id}
                />
              </div>

              {/* Quick Info */}
              <div className="mt-6 bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <h3 className="font-bold text-gray-900 mb-4">
                  {locale === 'es' ? '¿Por qué elegirnos?' : 'Why choose us?'}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {locale === 'es' ? 'Sin comisiones ocultas' : 'No hidden fees'}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {locale === 'es' ? 'Asistencia 24/7' : '24/7 Support'}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {locale === 'es' ? 'Verificación de propiedades' : 'Verified properties'}
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {locale === 'es' ? 'Proceso de reserva seguro' : 'Secure booking process'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

