'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  status: string;
  notes: string | null;
  room: {
    id: string;
    room_number: string;
    type: string;
    bathroom_type: string;
    description_es: string;
    images: string[];
    amenities: string[];
    property: {
      id: string;
      name_es: string;
      slug: string;
      address: string;
      location_es: string;
      images: string[];
    };
  };
}

export default function MyRoomPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysInfo, setDaysInfo] = useState({ daysUntilCheckIn: 0, daysUntilCheckOut: 0, isActive: false });

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in,
          check_out,
          status,
          notes,
          room:rooms(
            id,
            room_number,
            type,
            bathroom_type,
            description_es,
            images,
            amenities,
            property:properties(id, name_es, slug, address, location_es, images)
          )
        `)
        .or(`student_id.eq.${user.id},guest_email.eq.${user.email}`)
        .in('status', ['active', 'upcoming'])
        .order('check_in', { ascending: true })
        .limit(1)
        .single();

      if (data) {
        setBooking(data as any);
        
        // Calculate days
        const today = new Date();
        const checkIn = new Date(data.check_in);
        const checkOut = new Date(data.check_out);
        
        const daysUntilCheckIn = Math.ceil((checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const daysUntilCheckOut = Math.ceil((checkOut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isActive = data.status === 'active' || (today >= checkIn && today <= checkOut);
        
        setDaysInfo({
          daysUntilCheckIn: daysUntilCheckIn > 0 ? daysUntilCheckIn : 0,
          daysUntilCheckOut: daysUntilCheckOut > 0 ? daysUntilCheckOut : 0,
          isActive,
        });
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Habitación</h1>
          <p className="text-gray-500 mt-1">Información sobre tu alojamiento actual</p>
        </div>

        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no tienes habitación asignada</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Una vez que tu solicitud sea confirmada y se complete el proceso de reserva, 
            aquí podrás ver toda la información de tu habitación.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/student/applications"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Ver mis solicitudes
            </Link>
            <Link
              href="/es/casas"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30"
            >
              Buscar habitación
            </Link>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">1. Busca tu habitación</h4>
            <p className="text-gray-500 text-sm">Explora nuestras casas y encuentra la habitación perfecta para ti.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">2. Envía tu solicitud</h4>
            <p className="text-gray-500 text-sm">Completa el formulario con tus datos y espera la confirmación.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">3. Confirma tu reserva</h4>
            <p className="text-gray-500 text-sm">Una vez aprobada, realiza el pago y tu habitación estará lista.</p>
          </div>
        </div>
      </div>
    );
  }

  const room = booking.room;
  const property = room.property;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Habitación</h1>
          <p className="text-gray-500 mt-1">
            {daysInfo.isActive ? 'Estás hospedado actualmente' : `Tu check-in es en ${daysInfo.daysUntilCheckIn} días`}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
          daysInfo.isActive 
            ? 'bg-green-100 text-green-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {daysInfo.isActive ? '🏠 Activo' : '📅 Próximamente'}
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Info - Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Property Image */}
            <div className="h-48 relative">
              {property.images?.[0] ? (
                <Image
                  src={property.images[0]}
                  alt={property.name_es}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                  <h2 className="text-xl font-bold text-gray-900">{property.name_es}</h2>
                  <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {room.room_number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Habitación {room.room_number}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">
                      {room.type === 'private' ? '🔒 Privada' : '👥 Compartida'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {room.bathroom_type === 'private' ? '🚿 Baño Privado' : '🚿 Baño Compartido'}
                    </span>
                  </div>
                </div>
              </div>

              {room.description_es && (
                <p className="text-gray-600 mb-6">{room.description_es}</p>
              )}

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Amenidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Images */}
              {room.images && room.images.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Fotos de la habitación</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {room.images.slice(0, 3).map((img, index) => (
                      <div key={index} className="aspect-square rounded-xl overflow-hidden">
                        <Image
                          src={img}
                          alt={`Habitación ${room.room_number} - ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Check-in/Check-out Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Fechas de Estancia</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Check-in</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(booking.check_in).toLocaleDateString('es-MX', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-red-600 font-medium">Check-out</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(booking.check_out).toLocaleDateString('es-MX', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Days Counter */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                {daysInfo.isActive ? (
                  <>
                    <p className="text-4xl font-bold text-purple-600">{daysInfo.daysUntilCheckOut}</p>
                    <p className="text-sm text-gray-500">días restantes</p>
                  </>
                ) : (
                  <>
                    <p className="text-4xl font-bold text-blue-600">{daysInfo.daysUntilCheckIn}</p>
                    <p className="text-sm text-gray-500">días para tu check-in</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <Link
                href={`/es/casas/${property.slug}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-gray-700">Ver propiedad</span>
              </Link>
              <Link
                href="/es/contacto"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-gray-700">Contactar soporte</span>
              </Link>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">Notas importantes</h4>
                  <p className="text-sm text-amber-700">{booking.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

