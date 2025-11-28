import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data, error } = await supabaseServer
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
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    // Verificar que el usuario es dueño (permitir si owner_id es null)
    const property = (data.rooms as any)?.properties;
    const ownerId = property?.owner_id;
    
    if (ownerId !== null && ownerId !== undefined && ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verificar que el usuario es dueño de la reserva
    const { data: booking } = await supabaseServer
      .from('bookings')
      .select(`
        room_id,
        rooms:room_id (
          property_id,
          properties:property_id (
            id,
            owner_id
          )
        )
      `)
      .eq('id', params.id)
      .single();

    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    const property = (booking.rooms as any)?.properties;
    const ownerId = property?.owner_id;
    
    // Si owner_id existe y no es null, verificar que sea el usuario actual
    if (ownerId !== null && ownerId !== undefined && ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      status,
      notes,
    } = body;

    const updateData: any = {};
    if (guestName) updateData.guest_name = guestName;
    if (guestEmail) updateData.guest_email = guestEmail;
    if (guestPhone !== undefined) updateData.guest_phone = guestPhone;
    if (checkIn) updateData.check_in = checkIn;
    if (checkOut) updateData.check_out = checkOut;
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    // Si se cambia el status, actualizar disponibilidad de la habitación
    if (status) {
      const roomId = (booking.rooms as any).id;
      if (status === 'active' || status === 'upcoming') {
        await supabaseServer
          .from('rooms')
          .update({ available: false })
          .eq('id', roomId);
      } else if (status === 'completed' || status === 'cancelled') {
        // Verificar si hay otras reservas activas para esta habitación
        const { data: otherBookings } = await supabaseServer
          .from('bookings')
          .select('id')
          .eq('room_id', roomId)
          .in('status', ['active', 'upcoming'])
          .neq('id', params.id);

        if (!otherBookings || otherBookings.length === 0) {
          await supabaseServer
            .from('rooms')
            .update({ available: true })
            .eq('id', roomId);
        }
      }
    }

    const { data, error } = await supabaseServer
      .from('bookings')
      .update(updateData)
      .eq('id', params.id)
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
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Obtener información de la reserva antes de eliminar
    const { data: booking } = await supabaseServer
      .from('bookings')
      .select(`
        room_id,
        status,
        rooms:room_id (
          property_id,
          properties:property_id (
            id,
            owner_id
          )
        )
      `)
      .eq('id', params.id)
      .single();

    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    const property = (booking.rooms as any)?.properties;
    const ownerId = property?.owner_id;
    
    // Si owner_id existe y no es null, verificar que sea el usuario actual
    if (ownerId !== null && ownerId !== undefined && ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const roomId = (booking.rooms as any).id;

    // Eliminar la reserva
    const { error } = await supabaseServer
      .from('bookings')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Si la reserva era activa o upcoming, verificar si hay otras reservas
    if (booking.status === 'active' || booking.status === 'upcoming') {
      const { data: otherBookings } = await supabaseServer
        .from('bookings')
        .select('id')
        .eq('room_id', roomId)
        .in('status', ['active', 'upcoming']);

      if (!otherBookings || otherBookings.length === 0) {
        await supabaseServer
          .from('rooms')
          .update({ available: true })
          .eq('id', roomId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete booking' },
      { status: 500 }
    );
  }
}

