import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obtener parámetros de query
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const roomId = searchParams.get('roomId');
    
    // Si status contiene comas, es una lista de estados
    const statusList = status?.includes(',') 
      ? status.split(',').map(s => s.trim())
      : status 
        ? [status] 
        : null;

    let query = supabaseServer
      .from('bookings')
      .select(`
        *,
        rooms:room_id (
          id,
          room_number,
          type,
          bathroom_type,
          properties:property_id (
            id,
            name_es,
            name_en,
            slug
          )
        )
      `)
      .order('check_in', { ascending: true });

    // Filtrar por status si se proporciona
    if (statusList && statusList.length > 0) {
      if (statusList.length === 1) {
        query = query.eq('status', statusList[0]);
      } else {
        query = query.in('status', statusList);
      }
    }

    // Filtrar por room_id si se proporciona
    if (roomId) {
      query = query.eq('room_id', roomId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error in GET /api/bookings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      status,
      notes,
    } = body;

    // Validar campos requeridos
    if (!roomId || !guestName || !guestEmail || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verificar que el usuario es dueño de la propiedad de esta habitación
    // Usar left join (sin !inner) para permitir propiedades sin owner_id (importadas)
    const { data: room, error: roomError } = await supabaseServer
      .from('rooms')
      .select(`
        property_id,
        properties:property_id (
          id,
          owner_id
        )
      `)
      .eq('id', roomId)
      .single();

    if (roomError || !room) {
      console.error('Error fetching room:', roomError);
      return NextResponse.json(
        { error: 'Habitación no encontrada' },
        { status: 404 }
      );
    }

    // Permitir si owner_id es null (habitaciones importadas) o si el usuario es el dueño
    const property = room.properties as any;
    const ownerId = property?.owner_id;
    
    // Si owner_id existe y no es null, verificar que sea el usuario actual
    if (ownerId !== null && ownerId !== undefined && ownerId !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear reservas en esta habitación' },
        { status: 403 }
      );
    }

    // Verificar que no haya conflictos de fechas
    // Un conflicto ocurre cuando:
    // - check_in de la nueva reserva está entre check_in y check_out de una existente, O
    // - check_out de la nueva reserva está entre check_in y check_out de una existente, O
    // - La nueva reserva contiene completamente una reserva existente
    const { data: existingBookings } = await supabaseServer
      .from('bookings')
      .select('id, check_in, check_out')
      .eq('room_id', roomId)
      .in('status', ['active', 'upcoming']);

    if (existingBookings && existingBookings.length > 0) {
      const hasConflict = existingBookings.some((existing: any) => {
        const existingIn = new Date(existing.check_in);
        const existingOut = new Date(existing.check_out);
        const newIn = new Date(checkIn);
        const newOut = new Date(checkOut);
        
        // Verificar si hay solapamiento
        return (newIn <= existingOut && newOut >= existingIn);
      });

      if (hasConflict) {
        return NextResponse.json(
          { error: 'La habitación ya está reservada en estas fechas' },
          { status: 400 }
        );
      }
    }

    // Crear la reserva
    const { data, error } = await supabaseServer
      .from('bookings')
      .insert({
        room_id: roomId,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone || null,
        check_in: checkIn,
        check_out: checkOut,
        status: status || 'upcoming',
        notes: notes || null,
      })
      .select(`
        *,
        rooms:room_id (
          id,
          room_number,
          properties:property_id (
            id,
            name_es
          )
        )
      `)
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Actualizar disponibilidad de la habitación si la reserva es activa o upcoming
    if (status === 'active' || status === 'upcoming') {
      await supabaseServer
        .from('rooms')
        .update({ available: false })
        .eq('id', roomId);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/bookings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

