'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardStats {
  totalProperties: number;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  properties: any[];
  recentRooms: any[];
  upcomingCheckIns: number;
  upcomingCheckOuts: number;
  newInquiries: number;
  monthlyOccupancy: { month: string; rate: number }[];
  upcomingBookings: any[];
  recentBookings: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    occupancyRate: 0,
    properties: [],
    recentRooms: [],
    upcomingCheckIns: 0,
    upcomingCheckOuts: 0,
    newInquiries: 0,
    monthlyOccupancy: [],
    upcomingBookings: [],
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [propertiesRes, roomsRes, bookingsRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/rooms'),
        fetch('/api/bookings').catch(() => ({ json: async () => [] })),
      ]);

      const properties = await propertiesRes.json();
      const rooms = await roomsRes.json();
      const bookings = await bookingsRes.json();

      const activeBookings = bookings.filter((b: any) => b.status === 'active');
      const upcomingBookings = bookings.filter((b: any) => b.status === 'upcoming');
      
      const occupiedRoomIds = new Set([
        ...activeBookings.map((b: any) => b.room_id),
        ...upcomingBookings.map((b: any) => b.room_id),
      ]);

      const occupiedRooms = occupiedRoomIds.size;
      const availableRooms = rooms.length - occupiedRooms;
      const occupancyRate = rooms.length > 0 
        ? Math.round((occupiedRooms / rooms.length) * 100) 
        : 0;

      const recentRooms = rooms
        .slice()
        .sort((a: any, b: any) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )
        .slice(0, 4);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const upcomingCheckInsList = bookings.filter((b: any) => {
        const checkIn = new Date(b.check_in);
        checkIn.setHours(0, 0, 0, 0);
        return checkIn >= today && checkIn <= nextWeek && (b.status === 'upcoming' || b.status === 'active');
      }).slice(0, 5);

      const upcomingCheckOutsList = bookings.filter((b: any) => {
        const checkOut = new Date(b.check_out);
        checkOut.setHours(0, 0, 0, 0);
        return checkOut >= today && checkOut <= nextWeek && b.status === 'active';
      }).slice(0, 5);

      const upcomingCheckIns = upcomingCheckInsList.length;
      const upcomingCheckOuts = upcomingCheckOutsList.length;

      const inquiriesRes = await fetch('/api/inquiries?status=new').catch(() => ({ json: async () => [] }));
      const newInquiries = await inquiriesRes.json();
      const newInquiriesCount = Array.isArray(newInquiries) ? newInquiries.length : 0;

      const monthlyOccupancy = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        monthDate.setDate(1);
        monthDate.setHours(0, 0, 0, 0);
        
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const monthBookings = bookings.filter((b: any) => {
          const checkIn = new Date(b.check_in);
          const checkOut = new Date(b.check_out);
          return checkIn <= monthEnd && checkOut >= monthDate;
        });

        const uniqueRooms = new Set(monthBookings.map((b: any) => b.room_id));
        const monthRate = rooms.length > 0 
          ? Math.round((uniqueRooms.size / rooms.length) * 100)
          : 0;

        monthlyOccupancy.push({
          month: monthDate.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' }),
          rate: monthRate,
        });
      }

      setStats({
        totalProperties: properties.length || 0,
        totalRooms: rooms.length || 0,
        availableRooms,
        occupiedRooms,
        occupancyRate,
        properties: properties.slice(0, 4) || [],
        recentRooms,
        upcomingCheckIns,
        upcomingCheckOuts,
        newInquiries: newInquiriesCount,
        monthlyOccupancy,
        upcomingBookings: [...upcomingCheckInsList, ...upcomingCheckOutsList].slice(0, 5),
        recentBookings: bookings.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-text-secondary">Cargando dashboard...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Elegante */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('es-MX', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/availability"
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar Disponibilidad
          </Link>
          <Link
            href="/dashboard/properties/new"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-semibold flex items-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Propiedad
          </Link>
        </div>
      </div>

      {/* Stats Cards - Estilo más elegante */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Properties */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Activas
            </span>
          </div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Propiedades
          </h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalProperties}</p>
          <p className="text-xs text-gray-500">
            {stats.totalProperties} gestionadas
          </p>
        </div>

        {/* Total Rooms */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Habitaciones
          </h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalRooms}</p>
          <p className="text-xs text-gray-500">
            En todas las propiedades
          </p>
        </div>

        {/* Available Rooms */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              Libres
            </span>
          </div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Disponibles
          </h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.availableRooms}</p>
          <p className="text-xs text-gray-500">
            Listas para reservar
          </p>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              {stats.occupancyRate}%
            </span>
          </div>
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Ocupación
          </h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.occupancyRate}%</p>
          <p className="text-xs text-gray-500">
            {stats.occupiedRooms} de {stats.totalRooms} ocupadas
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ocupación Mensual - Gráfico mejorado */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Tendencia de Ocupación</h2>
                <p className="text-xs text-gray-500 mt-1">Últimos 6 meses</p>
              </div>
              <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                Ver reporte completo →
              </button>
            </div>
            
            {stats.monthlyOccupancy.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-3 h-48">
                  {stats.monthlyOccupancy.map((item, index) => {
                    const maxRate = Math.max(...stats.monthlyOccupancy.map(m => m.rate), 100);
                    const height = maxRate > 0 ? (item.rate / maxRate) * 180 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full flex items-end justify-center" style={{ height: '180px' }}>
                          <div
                            className="w-full bg-gradient-to-t from-primary to-primary/80 rounded-t-lg hover:from-primary-hover hover:to-primary-hover/80 transition-all cursor-pointer shadow-sm group-hover:shadow-md"
                            style={{ height: `${Math.max(height, 5)}px` }}
                            title={`${item.month}: ${item.rate}%`}
                          />
                        </div>
                        <div className="text-[10px] text-gray-500 text-center font-medium mt-2">
                          {item.month}
                        </div>
                        <div className="text-xs font-bold text-gray-900">{item.rate}%</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary"></div>
                    <span className="text-xs text-gray-600">Ocupación mensual</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <p className="text-sm">No hay datos suficientes</p>
              </div>
            )}
          </div>

          {/* Próximos Eventos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Próximos Eventos</h2>
                <p className="text-xs text-gray-500 mt-1">Esta semana</p>
              </div>
              <Link
                href="/dashboard/bookings"
                className="text-xs text-primary hover:text-primary-hover font-medium"
              >
                Ver todos →
              </Link>
            </div>
            <div className="space-y-3">
              {stats.upcomingBookings.length > 0 ? (
                stats.upcomingBookings.map((booking: any) => {
                  const isCheckIn = new Date(booking.check_in) >= new Date();
                  const eventDate = isCheckIn ? booking.check_in : booking.check_out;
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCheckIn ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                        <svg className={`w-6 h-6 ${isCheckIn ? 'text-blue-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCheckIn ? "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{booking.guest_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {booking.rooms?.properties?.name_es || 'Sin propiedad'} - Habitación #{booking.rooms?.room_number}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isCheckIn 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {isCheckIn ? 'Check-in' : 'Check-out'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(eventDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No hay eventos próximos</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Alertas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Alertas</h2>
              {(stats.upcomingCheckIns > 0 || stats.upcomingCheckOuts > 0 || stats.newInquiries > 0) && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {stats.upcomingCheckIns + stats.upcomingCheckOuts + stats.newInquiries}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {stats.upcomingCheckIns > 0 && (
                <Link
                  href="/dashboard/bookings?filter=upcoming"
                  className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{stats.upcomingCheckIns}</p>
                    <p className="text-xs text-gray-600">Check-ins próximos</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
              {stats.upcomingCheckOuts > 0 && (
                <Link
                  href="/dashboard/bookings?filter=active"
                  className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{stats.upcomingCheckOuts}</p>
                    <p className="text-xs text-gray-600">Check-outs próximos</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
              {stats.newInquiries > 0 && (
                <Link
                  href="/dashboard/inquiries?status=new"
                  className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{stats.newInquiries}</p>
                    <p className="text-xs text-gray-600">Solicitudes nuevas</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
              {(stats.upcomingCheckIns === 0 && stats.upcomingCheckOuts === 0 && stats.newInquiries === 0) && (
                <div className="text-center py-6 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs">Todo al día</p>
                </div>
              )}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="space-y-2">
              <Link
                href="/dashboard/properties/new"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-100"
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Nueva Propiedad</p>
                  <p className="text-xs text-gray-500">Agregar casa</p>
                </div>
              </Link>

              <Link
                href="/dashboard/bookings/new"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-100"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Nueva Reserva</p>
                  <p className="text-xs text-gray-500">Crear booking</p>
                </div>
              </Link>

              <Link
                href="/dashboard/availability"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-100"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Buscar Disponibilidad</p>
                  <p className="text-xs text-gray-500">Habitaciones libres</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Properties and Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Tus Propiedades</h2>
              <p className="text-xs text-gray-500 mt-1">Últimas propiedades</p>
            </div>
            <Link
              href="/dashboard/properties"
              className="text-xs text-primary hover:text-primary-hover font-medium"
            >
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.properties.length > 0 ? (
              stats.properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/dashboard/properties/${property.id}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-100"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.name_es}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {property.name_es}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {property.location_es}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">
                        {property.total_rooms || 0} habitaciones
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          property.available
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {property.available ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm mb-2">No hay propiedades aún</p>
                <Link
                  href="/dashboard/properties/new"
                  className="text-xs text-primary hover:underline"
                >
                  Crear primera propiedad
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Rooms */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Habitaciones Recientes</h2>
              <p className="text-xs text-gray-500 mt-1">Últimas agregadas</p>
            </div>
            <Link
              href="/dashboard/rooms"
              className="text-xs text-primary hover:text-primary-hover font-medium"
            >
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentRooms.length > 0 ? (
              stats.recentRooms.map((room: any) => (
                <Link
                  key={room.id}
                  href={`/dashboard/rooms/${room.id}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-100"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    {room.images && room.images.length > 0 ? (
                      <Image
                        src={room.images[0]}
                        alt={`Habitación ${room.room_number}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Habitación #{room.room_number}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {room.properties?.name_es || 'Sin propiedad'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                        {room.type === 'private' ? 'Privada' : 'Compartida'}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          room.available
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {room.available ? 'Disponible' : 'Ocupada'}
                      </span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm mb-2">No hay habitaciones aún</p>
                <Link
                  href="/dashboard/rooms/new"
                  className="text-xs text-primary hover:underline"
                >
                  Crear primera habitación
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
