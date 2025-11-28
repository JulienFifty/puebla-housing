'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  properties?: {
    id: string;
    name_es: string;
    name_en: string;
    slug: string;
  };
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProperty, setFilterProperty] = useState<string>('');
  const [properties, setProperties] = useState<Array<{ id: string; name_es: string; slug: string }>>([]);

  useEffect(() => {
    fetchProperties();
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [filterProperty]);

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

  const fetchRooms = async () => {
    try {
      const url = filterProperty 
        ? `/api/rooms?propertyId=${filterProperty}`
        : '/api/rooms';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta habitación?')) return;

    try {
      const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Error al eliminar la habitación');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Habitaciones</h1>
          <p className="text-sm text-gray-500">
            Gestiona todas las habitaciones
          </p>
        </div>
        <Link
          href="/dashboard/rooms/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-semibold flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Habitación
        </Link>
      </div>

      {/* Stats and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Disponibles</p>
          <p className="text-2xl font-bold text-emerald-600">
            {rooms.filter(r => r.available).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Ocupadas</p>
          <p className="text-2xl font-bold text-red-600">
            {rooms.filter(r => !r.available).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Filtrar por propiedad
          </label>
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">Todas</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.name_es}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Propiedad
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Número
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Baño
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Semestre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900 text-sm">
                      {room.properties?.name_es || 'Sin propiedad'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-sm">
                    #{room.room_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {room.type === 'private' ? 'Privada' : 'Compartida'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-sm">
                    {room.bathroom_type === 'private' ? 'Privado' : 'Compartido'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-sm">
                    {room.semester || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        room.available
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {room.available ? 'Disponible' : 'Ocupada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/rooms/${room.id}`}
                        className="text-primary hover:text-primary-hover text-sm font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rooms.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay habitaciones</h3>
            <p className="text-sm text-gray-500 mb-6">
              {filterProperty ? 'Intenta con otro filtro.' : 'Crea tu primera habitación.'}
            </p>
            {!filterProperty && (
              <Link
                href="/dashboard/rooms/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-semibold shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Habitación
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
