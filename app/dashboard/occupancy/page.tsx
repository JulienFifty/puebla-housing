'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
}

interface Room {
  id: string;
  room_number: string;
  type: 'private' | 'shared';
  properties?: {
    name_es: string;
    name_en: string;
  };
  bookings?: Booking[];
}

export default function OccupancyPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'half-month'>('half-month'); // 'month' o 'half-month'
  const [monthsToShow, setMonthsToShow] = useState(6); // Mostrar 6 meses por defecto

  useEffect(() => {
    fetchRooms();
  }, [startDate, viewMode, monthsToShow]);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      // Obtener reservas para cada habitación del día seleccionado
      const roomsWithBookings = await Promise.all(
        data.map(async (room: Room) => {
          const bookingsRes = await fetch(
            `/api/bookings?roomId=${room.id}&status=active,upcoming`
          );
          const bookingsData = await bookingsRes.ok ? await bookingsRes.json() : [];
          
          // Filtrar reservas que se solapan con el rango de fechas visible
          const rangeEnd = new Date(startDate);
          rangeEnd.setMonth(rangeEnd.getMonth() + monthsToShow);
          rangeEnd.setHours(23, 59, 59, 999);

          const relevantBookings = bookingsData.filter((booking: Booking) => {
            const checkIn = new Date(booking.check_in);
            checkIn.setHours(0, 0, 0, 0);
            const checkOut = new Date(booking.check_out);
            checkOut.setHours(23, 59, 59, 999);
            // Verificar si hay solapamiento con el rango visible
            return checkIn <= rangeEnd && checkOut >= startDate;
          });

          return {
            ...room,
            bookings: relevantBookings,
          };
        })
      );

      setRooms(roomsWithBookings);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generar períodos (meses o quincenas)
  const generatePeriods = () => {
    const periods = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(1); // Empezar desde el primer día del mes
    
    for (let i = 0; i < monthsToShow; i++) {
      if (viewMode === 'month') {
        // Un período por mes
        periods.push({
          start: new Date(currentDate),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
          label: currentDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }),
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        // Dos períodos por mes (quincenas)
        // Primera quincena (1-15)
        periods.push({
          start: new Date(currentDate),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
          label: `1-15 ${currentDate.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })}`,
        });
        
        // Segunda quincena (16-fin de mes)
        const secondHalfStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 16);
        periods.push({
          start: secondHalfStart,
          end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
          label: `16-${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()} ${currentDate.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })}`,
        });
        
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    return periods;
  };

  const periods = generatePeriods();

  // Calcular posición y ancho de un bloque de reserva
  const getBookingBlockStyle = (booking: Booking) => {
    const checkIn = new Date(booking.check_in);
    checkIn.setHours(0, 0, 0, 0);
    const checkOut = new Date(booking.check_out);
    checkOut.setHours(23, 59, 59, 999);

    // Encontrar en qué períodos cae la reserva
    let startPeriodIndex = -1;
    let endPeriodIndex = -1;

    periods.forEach((period, index) => {
      if (startPeriodIndex === -1 && checkIn <= period.end) {
        startPeriodIndex = index;
      }
      if (checkOut >= period.start) {
        endPeriodIndex = index;
      }
    });

    if (startPeriodIndex === -1 || endPeriodIndex === -1) {
      return { display: 'none' };
    }

    // Calcular posición dentro del período inicial
    const startPeriod = periods[startPeriodIndex];
    const periodDuration = startPeriod.end.getTime() - startPeriod.start.getTime();
    const bookingStartInPeriod = Math.max(0, checkIn.getTime() - startPeriod.start.getTime());
    const leftPercent = (bookingStartInPeriod / periodDuration) * 100;

    // Calcular ancho total (puede abarcar múltiples períodos)
    const totalPeriods = endPeriodIndex - startPeriodIndex + 1;
    const periodWidth = 100 / periods.length;
    const widthPercent = totalPeriods * periodWidth;

    // Ajustar left para que sea relativo al inicio de todos los períodos
    const adjustedLeft = (startPeriodIndex * periodWidth) + (leftPercent * periodWidth / 100);

    return {
      left: `${Math.max(0, adjustedLeft)}%`,
      width: `${Math.max(2, widthPercent)}%`, // Mínimo 2% para que sea visible
    };
  };

  // Obtener color según el estado
  const getBookingColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-400';
      case 'cancelled':
        return 'bg-gray-300';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
    });
  };

  const changeDate = (months: number) => {
    const newDate = new Date(startDate);
    newDate.setMonth(newDate.getMonth() + months);
    setStartDate(newDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-text-secondary">Cargando tablero...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Tablero de Ocupación</h1>
          <p className="text-sm text-gray-500">
            Visualiza la ocupación de habitaciones en el tiempo
          </p>
        </div>
        <Link
          href="/dashboard/bookings"
          className="text-sm text-primary hover:text-primary-hover font-medium"
        >
          Ver Reservas →
        </Link>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeDate(-1)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
            >
              ← Mes Anterior
            </button>
            <h2 className="text-xl font-semibold text-text-main capitalize">
              {formatDate(startDate)}
            </h2>
            <button
              onClick={() => changeDate(1)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
            >
              Mes Siguiente →
            </button>
            <button
              onClick={() => setStartDate(new Date())}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-semibold shadow-sm"
            >
              Hoy
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="text-sm text-text-secondary mr-2">Vista:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'month' | 'half-month')}
                className="px-3 py-1 border border-gray-300 rounded"
              >
                <option value="half-month">Quincenas</option>
                <option value="month">Meses</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-text-secondary mr-2">Meses a mostrar:</label>
              <input
                type="number"
                min="1"
                max="12"
                value={monthsToShow}
                onChange={(e) => setMonthsToShow(parseInt(e.target.value) || 6)}
                className="w-16 px-2 py-1 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Ocupación Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Reserva Futura</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded border border-gray-300"></div>
            <span>Disponible</span>
          </div>
        </div>
      </div>

      {/* Tablero */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full" style={{ minWidth: `${periods.length * 120}px` }}>
            {/* Header con períodos */}
            <div className="flex border-b sticky top-0 bg-white z-10">
              <div className="w-48 border-r p-4 font-semibold text-text-main flex-shrink-0">
                Habitación
              </div>
              <div className="flex-1 flex">
                {periods.map((period, index) => (
                  <div
                    key={index}
                    className="border-r text-center text-xs text-text-secondary p-2 flex-shrink-0"
                    style={{ minWidth: '120px' }}
                  >
                    <div className="font-medium">{period.label}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {period.start.toLocaleDateString('es-MX', { day: 'numeric' })} - {period.end.toLocaleDateString('es-MX', { day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filas de habitaciones */}
            <div className="divide-y">
              {rooms.map((room) => {
                const roomBookings = room.bookings || [];
                return (
                  <div key={room.id} className="flex relative hover:bg-gray-50">
                    {/* Nombre de habitación */}
                    <div className="w-48 border-r p-4 flex-shrink-0">
                      <div className="font-semibold text-text-main">
                        {room.properties?.name_es || 'Sin propiedad'} - #{room.room_number}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {room.type === 'private' ? 'Privada' : 'Compartida'}
                      </div>
                    </div>

                    {/* Área de períodos con reservas */}
                    <div className="flex-1 relative" style={{ minHeight: '60px' }}>
                      {/* Grid de períodos (fondo) */}
                      <div className="absolute inset-0 flex">
                        {periods.map((period, index) => (
                          <div
                            key={index}
                            className="border-r border-gray-200 flex-shrink-0"
                            style={{ minWidth: '120px' }}
                          />
                        ))}
                      </div>

                      {/* Bloques de reservas */}
                      {roomBookings.map((booking) => {
                        const style = getBookingBlockStyle(booking);
                        return (
                          <div
                            key={booking.id}
                            className={`absolute top-1 bottom-1 ${getBookingColor(
                              booking.status
                            )} text-white rounded px-2 py-1 text-xs shadow-md z-10 hover:opacity-90 cursor-pointer`}
                            style={style}
                            title={`${booking.guest_name} - ${new Date(
                              booking.check_in
                            ).toLocaleDateString('es-MX')} - ${new Date(booking.check_out).toLocaleDateString('es-MX')}`}
                          >
                            <div className="font-medium truncate">{booking.guest_name}</div>
                            <div className="text-xs opacity-90">
                              {new Date(booking.check_in).toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'short',
                              })}{' '}
                              -{' '}
                              {new Date(booking.check_out).toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Habitaciones</p>
          <p className="text-3xl font-bold text-gray-900">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Ocupadas Hoy</p>
          <p className="text-3xl font-bold text-emerald-600">
            {rooms.filter((r) =>
              r.bookings?.some((b) => b.status === 'active')
            ).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Reservadas</p>
          <p className="text-3xl font-bold text-blue-600">
            {rooms.filter((r) =>
              r.bookings?.some((b) => b.status === 'upcoming')
            ).length}
          </p>
        </div>
      </div>
    </div>
  );
}

