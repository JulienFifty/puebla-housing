'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface DashboardStats {
  pendingApplications: number;
  activeBooking: boolean;
  nextCheckIn: string | null;
  daysUntilCheckIn: number | null;
}

interface Inquiry {
  id: string;
  status: string;
  created_at: string;
  property: {
    name_es: string;
    slug: string;
  } | null;
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pendingApplications: 0,
    activeBooking: false,
    nextCheckIn: null,
    daysUntilCheckIn: null,
  });
  const [recentApplications, setRecentApplications] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      if (profile?.name) {
        setUserName(profile.name.split(' ')[0]);
      }

      // Obtener solicitudes del estudiante
      const { data: inquiries } = await supabase
        .from('inquiries')
        .select(`
          id,
          status,
          created_at,
          property:properties(name_es, slug)
        `)
        .or(`student_id.eq.${user.id},email.eq.${user.email}`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (inquiries) {
        setRecentApplications(inquiries as any);
        setStats(prev => ({
          ...prev,
          pendingApplications: inquiries.filter(i => !['confirmed', 'rejected', 'archived'].includes(i.status)).length,
        }));
      }

      // Obtener reservas activas
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, check_in, check_out, status')
        .or(`student_id.eq.${user.id},guest_email.eq.${user.email}`)
        .in('status', ['active', 'upcoming'])
        .order('check_in', { ascending: true })
        .limit(1);

      if (bookings && bookings.length > 0) {
        const nextBooking = bookings[0];
        const checkInDate = new Date(nextBooking.check_in);
        const today = new Date();
        const daysUntil = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        setStats(prev => ({
          ...prev,
          activeBooking: true,
          nextCheckIn: nextBooking.check_in,
          daysUntilCheckIn: daysUntil > 0 ? daysUntil : 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      new: { label: 'Nueva', color: 'bg-blue-100 text-blue-700' },
      contacted: { label: 'Contactado', color: 'bg-yellow-100 text-yellow-700' },
      documents: { label: 'Documentos', color: 'bg-orange-100 text-orange-700' },
      reviewing: { label: 'En Revisión', color: 'bg-purple-100 text-purple-700' },
      approved: { label: 'Aprobada', color: 'bg-green-100 text-green-700' },
      payment: { label: 'Pago Pendiente', color: 'bg-amber-100 text-amber-700' },
      confirmed: { label: 'Confirmada', color: 'bg-emerald-100 text-emerald-700' },
      rejected: { label: 'Rechazada', color: 'bg-red-100 text-red-700' },
      archived: { label: 'Archivada', color: 'bg-gray-100 text-gray-700' },
    };
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola{userName ? `, ${userName}` : ''}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Bienvenido a tu portal de estudiante
          </p>
        </div>
        <Link
          href="/es/casas"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Buscar Habitación
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingApplications}</p>
              <p className="text-gray-500 text-sm">Solicitudes Activas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stats.activeBooking ? 'bg-green-100' : 'bg-gray-100'}`}>
              <svg className={`w-7 h-7 ${stats.activeBooking ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <p className={`text-lg font-bold ${stats.activeBooking ? 'text-green-600' : 'text-gray-400'}`}>
                {stats.activeBooking ? 'Sí' : 'No'}
              </p>
              <p className="text-gray-500 text-sm">Habitación Asignada</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stats.nextCheckIn ? 'bg-purple-100' : 'bg-gray-100'}`}>
              <svg className={`w-7 h-7 ${stats.nextCheckIn ? 'text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              {stats.nextCheckIn ? (
                <>
                  <p className="text-lg font-bold text-purple-600">
                    {stats.daysUntilCheckIn === 0 ? '¡Hoy!' : `${stats.daysUntilCheckIn} días`}
                  </p>
                  <p className="text-gray-500 text-sm">Para tu Check-in</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-gray-400">-</p>
                  <p className="text-gray-500 text-sm">Sin fecha de Check-in</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/student/applications"
              className="flex flex-col items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Ver Solicitudes</span>
            </Link>

            <Link
              href="/student/my-room"
              className="flex flex-col items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Mi Habitación</span>
            </Link>

            <Link
              href="/student/process"
              className="flex flex-col items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Mi Proceso</span>
            </Link>

            <Link
              href="/es/casas"
              className="flex flex-col items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors group"
            >
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Buscar Casa</span>
            </Link>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Solicitudes Recientes</h2>
            <Link href="/student/applications" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver todas →
            </Link>
          </div>
          
          {recentApplications.length > 0 ? (
            <div className="space-y-3">
              {recentApplications.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {app.property?.name_es || 'Propiedad'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(app.created_at).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No tienes solicitudes aún</p>
              <Link
                href="/es/casas"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Explora nuestras casas →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">¿Necesitas ayuda?</h3>
            <p className="text-blue-100 text-sm">
              Nuestro equipo está aquí para ayudarte en cada paso del proceso.
            </p>
          </div>
          <Link
            href="/es/contacto"
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Contactar Soporte
          </Link>
        </div>
      </div>
    </div>
  );
}

