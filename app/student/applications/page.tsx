'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Inquiry {
  id: string;
  status: string;
  type: string;
  message: string;
  created_at: string;
  updated_at: string;
  university: string | null;
  semester: string | null;
  move_in_date: string | null;
  move_out_date: string | null;
  property: {
    id: string;
    name_es: string;
    slug: string;
    images: string[];
    location_es: string;
  } | null;
  room: {
    id: string;
    room_number: string;
    type: string;
  } | null;
}

const statusSteps = [
  { key: 'new', label: 'Nueva', icon: '📝' },
  { key: 'contacted', label: 'Contactado', icon: '📞' },
  { key: 'documents', label: 'Documentos', icon: '📄' },
  { key: 'reviewing', label: 'En Revisión', icon: '🔍' },
  { key: 'approved', label: 'Aprobada', icon: '✅' },
  { key: 'payment', label: 'Pago', icon: '💳' },
  { key: 'confirmed', label: 'Confirmada', icon: '🎉' },
];

export default function ApplicationsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          id,
          status,
          type,
          message,
          created_at,
          updated_at,
          university,
          semester,
          move_in_date,
          move_out_date,
          property:properties(id, name_es, slug, images, location_es),
          room:rooms(id, room_number, type)
        `)
        .or(`student_id.eq.${user.id},email.eq.${user.email}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
      } else {
        setInquiries(data as any || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
      new: { label: 'Nueva', color: 'text-blue-700', bg: 'bg-blue-100' },
      contacted: { label: 'Contactado', color: 'text-yellow-700', bg: 'bg-yellow-100' },
      documents: { label: 'Documentos Pendientes', color: 'text-orange-700', bg: 'bg-orange-100' },
      reviewing: { label: 'En Revisión', color: 'text-purple-700', bg: 'bg-purple-100' },
      approved: { label: 'Aprobada', color: 'text-green-700', bg: 'bg-green-100' },
      payment: { label: 'Pago Pendiente', color: 'text-amber-700', bg: 'bg-amber-100' },
      confirmed: { label: 'Confirmada', color: 'text-emerald-700', bg: 'bg-emerald-100' },
      rejected: { label: 'Rechazada', color: 'text-red-700', bg: 'bg-red-100' },
      archived: { label: 'Archivada', color: 'text-gray-700', bg: 'bg-gray-100' },
    };
    const config = statusConfig[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-100' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusStepIndex = (status: string) => {
    if (status === 'rejected' || status === 'archived') return -1;
    return statusSteps.findIndex(s => s.key === status);
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    if (filter === 'active') return !['confirmed', 'rejected', 'archived'].includes(inquiry.status);
    if (filter === 'completed') return ['confirmed', 'rejected', 'archived'].includes(inquiry.status);
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Solicitudes</h1>
          <p className="text-gray-500 mt-1">Sigue el estado de tus solicitudes de hospedaje</p>
        </div>
        <Link
          href="/es/casas"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Solicitud
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'active', label: 'Activas' },
          { key: 'completed', label: 'Finalizadas' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.key
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredInquiries.length > 0 ? (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Property Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {inquiry.property?.images?.[0] ? (
                      <Image
                        src={inquiry.property.images[0]}
                        alt={inquiry.property.name_es}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {inquiry.property?.name_es || 'Propiedad'}
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {inquiry.property?.location_es || 'Ubicación'}
                          {inquiry.room && ` • Habitación ${inquiry.room.room_number}`}
                        </p>
                      </div>
                      {getStatusBadge(inquiry.status)}
                    </div>

                    {/* Progress */}
                    {!['rejected', 'archived'].includes(inquiry.status) && (
                      <div className="mt-4">
                        <div className="flex items-center gap-1">
                          {statusSteps.map((step, index) => {
                            const currentIndex = getStatusStepIndex(inquiry.status);
                            const isComplete = index <= currentIndex;
                            const isCurrent = index === currentIndex;

                            return (
                              <div key={step.key} className="flex items-center flex-1">
                                <div
                                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all ${
                                    isComplete
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-100 text-gray-400'
                                  } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                                >
                                  {step.icon}
                                </div>
                                {index < statusSteps.length - 1 && (
                                  <div
                                    className={`flex-1 h-1 mx-1 rounded ${
                                      index < currentIndex ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        Solicitado el{' '}
                        {new Date(inquiry.created_at).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Ver detalles →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes solicitudes</h3>
          <p className="text-gray-500 mb-6">Explora nuestras casas y envía tu primera solicitud</p>
          <Link
            href="/es/casas"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Explorar Casas
          </Link>
        </div>
      )}

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Detalles de la Solicitud</h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Property Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                  {selectedInquiry.property?.images?.[0] && (
                    <Image
                      src={selectedInquiry.property.images[0]}
                      alt={selectedInquiry.property.name_es}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedInquiry.property?.name_es}</h4>
                  <p className="text-gray-500 text-sm">{selectedInquiry.property?.location_es}</p>
                  {selectedInquiry.room && (
                    <p className="text-sm text-blue-600 mt-1">
                      Habitación {selectedInquiry.room.room_number} ({selectedInquiry.room.type === 'private' ? 'Privada' : 'Compartida'})
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Estado Actual</h5>
                {getStatusBadge(selectedInquiry.status)}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Fecha de Solicitud</h5>
                  <p className="text-gray-900">
                    {new Date(selectedInquiry.created_at).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Última Actualización</h5>
                  <p className="text-gray-900">
                    {new Date(selectedInquiry.updated_at).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Move Dates if available */}
              {(selectedInquiry.move_in_date || selectedInquiry.move_out_date) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedInquiry.move_in_date && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Fecha de Entrada</h5>
                      <p className="text-gray-900">
                        {new Date(selectedInquiry.move_in_date).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  )}
                  {selectedInquiry.move_out_date && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Fecha de Salida</h5>
                      <p className="text-gray-900">
                        {new Date(selectedInquiry.move_out_date).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Message */}
              {selectedInquiry.message && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Tu Mensaje</h5>
                  <p className="text-gray-600 bg-gray-50 rounded-xl p-4 text-sm">
                    {selectedInquiry.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {selectedInquiry.property?.slug && (
                  <Link
                    href={`/es/casas/${selectedInquiry.property.slug}`}
                    className="flex-1 py-3 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    Ver Propiedad
                  </Link>
                )}
                <Link
                  href="/es/contacto"
                  className="flex-1 py-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
                >
                  Contactar Soporte
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



