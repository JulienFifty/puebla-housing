'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  semester: string | null;
  amenities: string[];
  available_from?: string | null;
  available_to?: string | null;
  has_private_kitchen?: boolean;
  is_entire_place?: boolean;
  properties?: {
    id: string;
    name_es: string;
    name_en: string;
    slug: string;
  };
}

interface Booking {
  id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  status: string;
}

export default function AvailabilityPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    propertyId: '',
    roomType: '',
    hasPrivateKitchen: false,
    isEntirePlace: false,
  });

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const fetchAllRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAllRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const searchAvailability = async () => {
    if (!searchParams.checkIn || !searchParams.checkOut) {
      alert('Por favor selecciona fechas de check-in y check-out');
      return;
    }

    setLoading(true);
    setSearchPerformed(true);

    try {
      const checkIn = new Date(searchParams.checkIn);
      const checkOut = new Date(searchParams.checkOut);

      if (checkOut <= checkIn) {
        alert('La fecha de check-out debe ser posterior a la de check-in');
        setLoading(false);
        return;
      }

      // Obtener todas las reservas que se solapan con el período buscado
      const bookingsRes = await fetch('/api/bookings');
      const bookings = await bookingsRes.ok ? await bookingsRes.json() : [];

      // Filtrar reservas que se solapan con el período
      const conflictingBookings = bookings.filter((booking: Booking) => {
        const bookingCheckIn = new Date(booking.check_in);
        const bookingCheckOut = new Date(booking.check_out);
        
        // Verificar solapamiento
        return (
          (bookingCheckIn < checkOut && bookingCheckOut > checkIn) &&
          (booking.status === 'active' || booking.status === 'upcoming')
        );
      });

      const occupiedRoomIds = new Set(conflictingBookings.map((b: Booking) => b.room_id));

      // Filtrar habitaciones disponibles
      let availableRooms = allRooms.filter((room) => {
        // Verificar que no esté ocupada
        if (occupiedRoomIds.has(room.id)) return false;

        // Verificar que esté marcada como disponible
        if (!room.available) return false;

        // Verificar fechas de disponibilidad de la habitación
        if (room.available_from) {
          const availableFrom = new Date(room.available_from);
          if (checkIn < availableFrom) return false;
        }

        if (room.available_to) {
          const availableTo = new Date(room.available_to);
          if (checkOut > availableTo) return false;
        }

        // Aplicar filtros
        if (searchParams.propertyId && room.property_id !== searchParams.propertyId) {
          return false;
        }

        if (searchParams.roomType && room.type !== searchParams.roomType) {
          return false;
        }

        if (searchParams.hasPrivateKitchen && !room.has_private_kitchen) {
          return false;
        }

        if (searchParams.isEntirePlace && !room.is_entire_place) {
          return false;
        }

        return true;
      });

      setRooms(availableRooms);
    } catch (error) {
      console.error('Error searching availability:', error);
      alert('Error al buscar disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchParams({
      checkIn: '',
      checkOut: '',
      propertyId: '',
      roomType: '',
      hasPrivateKitchen: false,
      isEntirePlace: false,
    });
    setRooms([]);
    setSearchPerformed(false);
  };

  // Obtener propiedades únicas para el filtro
  const properties = Array.from(
    new Map(allRooms.map((room) => [room.properties?.id, room.properties])).values()
  ).filter(Boolean);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateNights = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) return 0;
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Búsqueda de Disponibilidad</h1>
          <p className="text-text-secondary mt-2">
            Encuentra habitaciones disponibles para fechas específicas
          </p>
        </div>
      </div>

      {/* Formulario de Búsqueda */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Check-in *
            </label>
            <input
              type="date"
              value={searchParams.checkIn}
              onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Check-out *
            </label>
            <input
              type="date"
              value={searchParams.checkOut}
              onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
              min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Propiedad
            </label>
            <select
              value={searchParams.propertyId}
              onChange={(e) => setSearchParams({ ...searchParams, propertyId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todas las propiedades</option>
              {properties.map((prop: any) => (
                <option key={prop.id} value={prop.id}>
                  {prop.name_es}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Tipo de Habitación
            </label>
            <select
              value={searchParams.roomType}
              onChange={(e) => setSearchParams({ ...searchParams, roomType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="private">Privada</option>
              <option value="shared">Compartida</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasPrivateKitchen"
              checked={searchParams.hasPrivateKitchen}
              onChange={(e) =>
                setSearchParams({ ...searchParams, hasPrivateKitchen: e.target.checked })
              }
              className="mr-2"
            />
            <label htmlFor="hasPrivateKitchen" className="text-sm text-text-main">
              Solo con Cocina Privada
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isEntirePlace"
              checked={searchParams.isEntirePlace}
              onChange={(e) =>
                setSearchParams({ ...searchParams, isEntirePlace: e.target.checked })
              }
              className="mr-2"
            />
            <label htmlFor="isEntirePlace" className="text-sm text-text-main">
              Solo Lugar Completo (Estudio/Apartamento)
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={searchAvailability}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Buscando...' : 'Buscar Disponibilidad'}
          </button>
          {searchPerformed && (
            <button
              onClick={clearSearch}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar Búsqueda
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {searchPerformed && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-main">
                {rooms.length} {rooms.length === 1 ? 'Habitación Disponible' : 'Habitaciones Disponibles'}
              </h2>
              {searchParams.checkIn && searchParams.checkOut && (
                <p className="text-text-secondary mt-1">
                  Del {formatDate(searchParams.checkIn)} al {formatDate(searchParams.checkOut)} 
                  ({calculateNights()} {calculateNights() === 1 ? 'noche' : 'noches'})
                </p>
              )}
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-text-main">No hay habitaciones disponibles</h3>
              <p className="mt-1 text-sm text-text-secondary">
                No se encontraron habitaciones disponibles para las fechas seleccionadas.
              </p>
              <div className="mt-6">
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover"
                >
                  Nueva Búsqueda
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Imagen */}
                  <div className="relative h-48 w-full">
                    {room.images && room.images.length > 0 ? (
                      <Image
                        src={room.images[0]}
                        alt={`Habitación ${room.room_number}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Disponible
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="font-bold text-lg text-text-main">
                        {room.properties?.name_es || 'Sin propiedad'} - Habitación #{room.room_number}
                      </h3>
                    </div>

                    {/* Características */}
                    <div className="flex flex-wrap gap-2 mb-3 text-sm">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {room.type === 'private' ? 'Privada' : 'Compartida'}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-text-secondary rounded-full">
                        {room.bathroom_type === 'private' ? 'Baño Privado' : 'Baño Compartido'}
                      </span>
                      {room.has_private_kitchen && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          Cocina Privada
                        </span>
                      )}
                      {room.is_entire_place && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                          Lugar Completo
                        </span>
                      )}
                    </div>

                    {/* Descripción */}
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                      {room.description_es}
                    </p>

                    {/* Fechas de disponibilidad */}
                    {room.available_from && (
                      <p className="text-xs text-green-600 mb-2">
                        Disponible desde: {new Date(room.available_from).toLocaleDateString('es-MX')}
                      </p>
                    )}
                    {room.available_to && (
                      <p className="text-xs text-orange-600 mb-2">
                        Disponible hasta: {new Date(room.available_to).toLocaleDateString('es-MX')}
                      </p>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/dashboard/rooms/${room.id}`}
                        className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Ver Detalles
                      </Link>
                      <Link
                        href={`/dashboard/bookings/new?roomId=${room.id}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}`}
                        className="flex-1 text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                      >
                        Reservar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Información adicional si no hay búsqueda */}
      {!searchPerformed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Cómo usar la búsqueda de disponibilidad</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Selecciona las fechas de check-in y check-out</li>
                <li>Opcionalmente, filtra por propiedad, tipo de habitación o características</li>
                <li>Haz clic en "Buscar Disponibilidad" para ver las habitaciones libres</li>
                <li>Puedes reservar directamente desde los resultados</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




