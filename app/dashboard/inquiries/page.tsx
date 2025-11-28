'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  university: string | null;
  country: string | null;
  phone: string | null;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  type: 'contact' | 'reservation' | 'property_listing';
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  responded_at: string | null;
  university: string | null;
  country: string | null;
  semester: string | null;
  move_in_date: string | null;
  move_out_date: string | null;
  student_id: string | null;
  student?: StudentProfile | null;
  properties?: {
    id: string;
    name_es: string;
    name_en: string;
    slug: string;
  } | null;
  rooms?: {
    id: string;
    room_number: string;
    properties?: {
      id: string;
      name_es: string;
    };
  } | null;
}

// Estados del proceso con iconos y colores
const processSteps = [
  { key: 'new', label: 'Nueva', icon: '📝', color: 'blue' },
  { key: 'contacted', label: 'Contactado', icon: '📞', color: 'yellow' },
  { key: 'documents', label: 'Documentos', icon: '📄', color: 'orange' },
  { key: 'reviewing', label: 'Revisión', icon: '🔍', color: 'purple' },
  { key: 'approved', label: 'Aprobada', icon: '✅', color: 'green' },
  { key: 'payment', label: 'Pago', icon: '💳', color: 'amber' },
  { key: 'confirmed', label: 'Confirmada', icon: '🎉', color: 'emerald' },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  new: { label: 'Nueva', color: 'text-blue-700', bg: 'bg-blue-100', icon: '📝' },
  contacted: { label: 'Contactado', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: '📞' },
  documents: { label: 'Documentos', color: 'text-orange-700', bg: 'bg-orange-100', icon: '📄' },
  reviewing: { label: 'En Revisión', color: 'text-purple-700', bg: 'bg-purple-100', icon: '🔍' },
  approved: { label: 'Aprobada', color: 'text-green-700', bg: 'bg-green-100', icon: '✅' },
  payment: { label: 'Pago Pendiente', color: 'text-amber-700', bg: 'bg-amber-100', icon: '💳' },
  confirmed: { label: 'Confirmada', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '🎉' },
  rejected: { label: 'Rechazada', color: 'text-red-700', bg: 'bg-red-100', icon: '❌' },
  archived: { label: 'Archivada', color: 'text-gray-700', bg: 'bg-gray-100', icon: '📦' },
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    status: string;
    type: string;
  }>({ status: 'all', type: 'all' });
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<string>('new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const fetchInquiries = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status !== 'all') params.append('status', filter.status);
      if (filter.type !== 'all') params.append('type', filter.type);

      const response = await fetch(`/api/inquiries?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al cargar solicitudes');
      }
      const data = await response.json();
      console.log('Inquiries loaded:', data);
      setInquiries(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      if (!response.ok) throw new Error('Error al actualizar');
      await fetchInquiries();
      setShowModal(false);
      setSelectedInquiry(null);
      setNotes('');
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Error al actualizar la solicitud');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Error al actualizar');
      await fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Error al actualizar');
    }
  };

  const handleDelete = async (inquiryId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta solicitud?')) return;

    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');
      await fetchInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Error al eliminar la solicitud');
    }
  };

  const openModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setStatus(inquiry.status);
    setNotes(inquiry.notes || '');
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.new;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
        <span>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      contact: 'Contacto',
      reservation: 'Reserva',
      property_listing: 'Listar Propiedad',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStepIndex = (status: string) => {
    return processSteps.findIndex(s => s.key === status);
  };

  const stats = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === 'new').length,
    inProcess: inquiries.filter((i) => ['contacted', 'documents', 'reviewing', 'approved', 'payment'].includes(i.status)).length,
    confirmed: inquiries.filter((i) => i.status === 'confirmed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-500">Cargando solicitudes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Solicitudes de Estudiantes</h1>
          <p className="text-sm text-gray-500">
            Gestiona las solicitudes y el proceso de cada estudiante
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
              📋
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-2xl">
              🆕
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nuevas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
              ⏳
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">En Proceso</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProcess}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">
              🎉
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Confirmadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado del Proceso
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="new">📝 Nueva</option>
              <option value="contacted">📞 Contactado</option>
              <option value="documents">📄 Documentos</option>
              <option value="reviewing">🔍 En Revisión</option>
              <option value="approved">✅ Aprobada</option>
              <option value="payment">💳 Pago Pendiente</option>
              <option value="confirmed">🎉 Confirmada</option>
              <option value="rejected">❌ Rechazada</option>
              <option value="archived">📦 Archivada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Solicitud
            </label>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="all">Todos</option>
              <option value="contact">Contacto</option>
              <option value="reservation">Reserva</option>
              <option value="property_listing">Listar Propiedad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
              {inquiries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              📭
            </div>
            <p className="text-gray-500">No hay solicitudes</p>
          </div>
        ) : (
          inquiries.map((inquiry) => {
            const currentStepIndex = getStepIndex(inquiry.status);
            
            return (
              <div
                key={inquiry.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Student Avatar */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {inquiry.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{inquiry.name}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {inquiry.email}
                            </span>
                      {inquiry.phone && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {inquiry.phone}
                              </span>
                            )}
                            {(inquiry.university || inquiry.country) && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {[inquiry.university, inquiry.country].filter(Boolean).join(' • ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(inquiry.status)}
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                        {getTypeLabel(inquiry.type)}
                      </span>
                        </div>
                      </div>

                      {/* Property Info */}
                      {(inquiry.properties || inquiry.rooms) && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg inline-flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            {inquiry.properties?.name_es || inquiry.rooms?.properties?.name_es}
                          </span>
                          {inquiry.rooms && (
                            <span className="text-sm text-gray-500">
                              • Habitación #{inquiry.rooms.room_number}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Process Steps - Only for reservation type */}
                      {inquiry.type === 'reservation' && !['rejected', 'archived'].includes(inquiry.status) && (
                        <div className="mb-4">
                          <div className="flex items-center gap-1">
                            {processSteps.map((step, index) => {
                              const isComplete = index <= currentStepIndex;
                              const isCurrent = index === currentStepIndex;

                              return (
                                <div key={step.key} className="flex items-center flex-1">
                                  <button
                                    onClick={() => handleQuickStatusChange(inquiry.id, step.key)}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all ${
                                      isComplete
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}
                                    title={`Cambiar a: ${step.label}`}
                                  >
                                    {step.icon}
                                  </button>
                                  {index < processSteps.length - 1 && (
                                    <div
                                      className={`flex-1 h-1 mx-1 rounded ${
                                        index < currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                                      }`}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-400">
                            <span>Nueva</span>
                            <span>Confirmada</span>
                          </div>
                        </div>
                      )}

                      {/* Message Preview */}
                      {inquiry.message && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          "{inquiry.message}"
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-400">
                          Recibido el{' '}
                          {new Date(inquiry.created_at).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(inquiry)}
                            className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                            Ver Detalles
                      </button>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                      </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                <h2 className="text-xl font-bold text-gray-900">Detalles de Solicitud</h2>
                  <p className="text-sm text-gray-500 mt-1">Gestiona el proceso del estudiante</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedInquiry(null);
                    setNotes('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {selectedInquiry.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedInquiry.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <p className="text-gray-600">📧 {selectedInquiry.email}</p>
                    {selectedInquiry.phone && <p className="text-gray-600">📱 {selectedInquiry.phone}</p>}
                    {selectedInquiry.university && <p className="text-gray-600">🎓 {selectedInquiry.university}</p>}
                    {selectedInquiry.country && <p className="text-gray-600">🌍 {selectedInquiry.country}</p>}
                  </div>
                  {selectedInquiry.student_id && (
                    <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Estudiante registrado en el portal
                    </p>
                  )}
                </div>
              </div>

              {/* Property Info */}
              {(selectedInquiry.properties || selectedInquiry.rooms) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Propiedad Solicitada</h3>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedInquiry.properties?.name_es || selectedInquiry.rooms?.properties?.name_es}
                      </p>
                      {selectedInquiry.rooms && (
                        <p className="text-sm text-gray-600">
                          Habitación #{selectedInquiry.rooms.room_number}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Dates */}
              {(selectedInquiry.move_in_date || selectedInquiry.move_out_date) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Fechas de Estancia</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedInquiry.move_in_date && (
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-xs text-green-600 font-medium mb-1">Check-in</p>
                        <p className="text-gray-900 font-semibold">
                          {new Date(selectedInquiry.move_in_date).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                    {selectedInquiry.move_out_date && (
                      <div className="bg-red-50 rounded-xl p-4">
                        <p className="text-xs text-red-600 font-medium mb-1">Check-out</p>
                        <p className="text-gray-900 font-semibold">
                          {new Date(selectedInquiry.move_out_date).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Mensaje del Estudiante</h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Process Status */}
                <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Estado del Proceso</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-1 mb-3">
                    {processSteps.map((step, index) => {
                      // Usar el estado seleccionado (status) en lugar del original
                      const selectedStatusIndex = getStepIndex(status);
                      const isComplete = index <= selectedStatusIndex;
                      const isCurrent = index === selectedStatusIndex;

                      return (
                        <div key={step.key} className="flex items-center flex-1">
                          <button
                            onClick={() => setStatus(step.key)}
                            className={`flex items-center justify-center w-10 h-10 rounded-full text-lg transition-all ${
                              isCurrent
                                ? 'bg-primary text-white ring-4 ring-primary/20 scale-110'
                                : isComplete
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                            }`}
                            title={step.label}
                          >
                            {isComplete && !isCurrent ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              step.icon
                            )}
                          </button>
                          {index < processSteps.length - 1 && (
                            <div
                              className={`flex-1 h-1 mx-1 rounded transition-colors ${
                                index < selectedStatusIndex ? 'bg-primary' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    {processSteps.map((step) => (
                      <span key={step.key} className={status === step.key ? 'text-primary font-semibold' : ''}>
                        {step.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setStatus('rejected')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      status === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    ❌ Rechazar
                  </button>
                  <button
                    onClick={() => setStatus('archived')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      status === 'archived'
                        ? 'bg-gray-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    📦 Archivar
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notas Internas
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Agrega notas sobre esta solicitud (solo visibles para ti)..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleStatusChange(selectedInquiry.id, status)}
                  disabled={saving}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors font-semibold shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                  Guardar Cambios
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedInquiry(null);
                    setNotes('');
                  }}
                  className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
