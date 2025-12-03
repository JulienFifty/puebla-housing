'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  status: string;
  guest_name: string;
}

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
  bookings?: Booking[];
  properties?: {
    id: string;
    name_es: string;
    name_en: string;
    slug: string;
  };
}

interface Property {
  id: string;
  name_es: string;
  slug: string;
}

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [formData, setFormData] = useState({
    property_id: '',
    room_number: '',
    type: 'private' as 'private' | 'shared',
    bathroom_type: 'private' as 'private' | 'shared',
    description_es: '',
    description_en: '',
    images: [] as string[],
    available: true,
    semester: '',
    amenities: [] as string[],
    available_from: '',
    available_to: '',
    has_private_kitchen: false,
    is_entire_place: false,
  });

  useEffect(() => {
    fetchProperties();
    if (id && id !== 'new') {
      fetchRoom();
    } else if (id === 'new') {
      // Modo creación: no cargar habitación, solo propiedades
      setLoading(false);
    }
  }, [id]);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProperties(data.map((p: any) => ({ id: p.id, name_es: p.name_es, slug: p.slug })));
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchRoom = async () => {
    try {
      const res = await fetch(`/api/rooms/${id}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to fetch' }));
        throw new Error(errorData.error || 'Failed to fetch');
      }
      const data = await res.json();
      
      if (!data || !data.id) {
        setError('Habitación no encontrada');
        setLoading(false);
        return;
      }
      
      setRoom(data);
      
      // Obtener reservas activas y futuras
      const activeBookings = (data.bookings || []).filter(
        (b: Booking) => b.status === 'active' || b.status === 'upcoming'
      );
      setBookings(activeBookings);

      // Calcular fechas de disponibilidad basándose en las reservas
      let calculatedAvailableFrom = data.available_from ? data.available_from.split('T')[0] : '';
      let calculatedAvailableTo = data.available_to ? data.available_to.split('T')[0] : '';

      if (activeBookings.length > 0) {
        // Ordenar reservas por fecha de entrada
        const sortedBookings = [...activeBookings].sort(
          (a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime()
        );

        // Si no hay reserva antes de la primera, la habitación está disponible desde hoy
        const firstBooking = sortedBookings[0];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstCheckIn = new Date(firstBooking.check_in);
        firstCheckIn.setHours(0, 0, 0, 0);

        if (firstCheckIn > today) {
          // Hay disponibilidad antes de la primera reserva
          calculatedAvailableFrom = today.toISOString().split('T')[0];
          calculatedAvailableTo = new Date(firstCheckIn.getTime() - 86400000).toISOString().split('T')[0]; // Un día antes
        } else {
          // La primera reserva ya comenzó, buscar el próximo período disponible
          const lastBooking = sortedBookings[sortedBookings.length - 1];
          const lastCheckOut = new Date(lastBooking.check_out);
          lastCheckOut.setHours(0, 0, 0, 0);
          
          if (lastCheckOut > today) {
            calculatedAvailableFrom = lastCheckOut.toISOString().split('T')[0];
            calculatedAvailableTo = ''; // Disponible indefinidamente después de la última reserva
          }
        }
      } else {
        // No hay reservas, disponible desde hoy
        if (!calculatedAvailableFrom) {
          calculatedAvailableFrom = new Date().toISOString().split('T')[0];
        }
      }

      setFormData({
        property_id: data.property_id || '',
        room_number: data.room_number || '',
        type: data.type || 'private',
        bathroom_type: data.bathroom_type || 'private',
        description_es: data.description_es || '',
        description_en: data.description_en || '',
        images: data.images || [],
        available: data.available ?? true,
        semester: data.semester || '',
        amenities: data.amenities || [],
        available_from: calculatedAvailableFrom,
        available_to: calculatedAvailableTo,
        has_private_kitchen: data.has_private_kitchen ?? false,
        is_entire_place: data.is_entire_place ?? false,
      });
    } catch (error) {
      console.error('Error fetching room:', error);
      setError('Error al cargar la habitación');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const isNewRoom = id === 'new';
    const url = isNewRoom ? '/api/rooms' : `/api/rooms/${id}`;
    const method = isNewRoom ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: formData.property_id,
          roomNumber: formData.room_number,
          type: formData.type,
          bathroomType: formData.bathroom_type,
          descriptionEs: formData.description_es,
          descriptionEn: formData.description_en,
          images: formData.images,
          available: formData.available,
          semester: formData.semester || null,
          amenities: formData.amenities,
          availableFrom: formData.available_from || null,
          availableTo: formData.available_to || null,
          hasPrivateKitchen: formData.has_private_kitchen,
          isEntirePlace: formData.is_entire_place,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${isNewRoom ? 'create' : 'update'}`);
      }

      router.push('/dashboard/rooms');
    } catch (error: any) {
      console.error(`Error ${isNewRoom ? 'creating' : 'updating'} room:`, error);
      setError(error.message || `Error al ${isNewRoom ? 'crear' : 'actualizar'} la habitación`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = () => {
    const url = prompt('Ingresa la URL de la imagen:');
    if (url) {
      setFormData({
        ...formData,
        images: [...formData.images, url],
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleAddAmenity = () => {
    const amenity = prompt('Ingresa una amenidad:');
    if (amenity) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Si estamos en modo creación (id === 'new'), mostrar el formulario aunque room sea null
  const isNewRoom = id === 'new';
  
  if (!room && !isNewRoom) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Habitación no encontrada</h2>
          <Link href="/dashboard/rooms" className="text-primary hover:underline">
            Volver a habitaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-text-main">
          {isNewRoom ? 'Crear Habitación' : 'Editar Habitación'}
        </h1>
        <Link
          href="/dashboard/rooms"
          className="text-text-secondary hover:text-primary"
        >
          ← Volver
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Propiedad *
            </label>
            <select
              value={formData.property_id}
              onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Selecciona una propiedad</option>
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.name_es}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Número de Habitación *
            </label>
            <input
              type="text"
              value={formData.room_number}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Tipo de Habitación *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'private' | 'shared' })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="private">Privada</option>
              <option value="shared">Compartida</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Tipo de Baño *
            </label>
            <select
              value={formData.bathroom_type}
              onChange={(e) => setFormData({ ...formData, bathroom_type: e.target.value as 'private' | 'shared' })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="private">Privado</option>
              <option value="shared">Compartido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Semestre
            </label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sin semestre</option>
              <option value="enero-junio-2026">Enero - Junio 2026</option>
              <option value="junio-diciembre-2026">Junio - Diciembre 2026</option>
            </select>
          </div>

          <div>
            <label className="flex items-center mt-8">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="mr-2"
              />
              Disponible
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Disponible desde
            </label>
            <input
              type="date"
              value={formData.available_from}
              onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {bookings.length > 0 && (
              <p className="text-xs text-text-secondary mt-1">
                Calculado automáticamente basándose en las reservas
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Disponible hasta
            </label>
            <input
              type="date"
              value={formData.available_to}
              onChange={(e) => setFormData({ ...formData, available_to: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {bookings.length > 0 && (
              <p className="text-xs text-text-secondary mt-1">
                Calculado automáticamente basándose en las reservas
              </p>
            )}
          </div>

          {bookings.length > 0 && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-main mb-2">
                Reservas Activas/Futuras
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{booking.guest_name}</span>
                      <span className="text-text-secondary ml-2">
                        ({booking.status === 'active' ? 'Ocupación actual' : 'Reserva futura'})
                      </span>
                    </div>
                    <div className="text-text-secondary">
                      {new Date(booking.check_in).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      -{' '}
                      {new Date(booking.check_out).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                ))}
                <Link
                  href="/dashboard/bookings"
                  className="text-sm text-primary hover:underline inline-block mt-2"
                >
                  Ver todas las reservas →
                </Link>
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center mt-8">
              <input
                type="checkbox"
                checked={formData.has_private_kitchen}
                onChange={(e) => setFormData({ ...formData, has_private_kitchen: e.target.checked })}
                className="mr-2"
              />
              Tiene Cocina Privada
            </label>
          </div>

          <div>
            <label className="flex items-center mt-8">
              <input
                type="checkbox"
                checked={formData.is_entire_place}
                onChange={(e) => setFormData({ ...formData, is_entire_place: e.target.checked })}
                className="mr-2"
              />
              Es Lugar Completo (Estudio/Apartamento)
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Descripción (Español) *
          </label>
          <textarea
            value={formData.description_es}
            onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Descripción (Inglés) *
          </label>
          <textarea
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Imágenes
          </label>
          <div className="space-y-4">
            {formData.images.map((image, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex gap-4">
                  {/* Vista previa de la imagen */}
                  <div className="flex-shrink-0">
                    {image ? (
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect width="128" height="128" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  
                  {/* Input de URL */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = e.target.value;
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
                      placeholder="URL de la imagen"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              + Agregar Imagen
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-main mb-2">
            Amenidades
          </label>
          <div className="space-y-2">
            {formData.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={amenity}
                  onChange={(e) => {
                    const newAmenities = [...formData.amenities];
                    newAmenities[index] = e.target.value;
                    setFormData({ ...formData, amenities: newAmenities });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nombre de la amenidad"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAmenity}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              + Agregar Amenidad
            </button>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-semibold disabled:opacity-50"
          >
            {saving 
              ? (isNewRoom ? 'Creando...' : 'Guardando...') 
              : (isNewRoom ? 'Crear Habitación' : 'Guardar Cambios')
            }
          </button>
          <Link
            href="/dashboard/rooms"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

