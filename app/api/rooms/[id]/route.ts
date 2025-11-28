import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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

    // GET es público para permitir ver habitaciones sin autenticación
    const { data, error } = await supabaseServer
      .from('rooms')
      .select(`
        *,
        properties:property_id (
          id,
          name_es,
          name_en,
          slug,
          address,
          location_es,
          location_en,
          images,
          zone
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching room:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Solo obtener bookings si el usuario está autenticado (para el dashboard)
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    let bookingsData = null;
    if (user) {
      const { data: bookings, error: bookingsError } = await supabaseServer
        .from('bookings')
        .select('id, check_in, check_out, status, guest_name')
        .eq('room_id', params.id)
        .in('status', ['active', 'upcoming'])
        .order('check_in', { ascending: true });

      if (!bookingsError) {
        bookingsData = bookings;
      }
    }

    // Agregar bookings a la respuesta si está disponible
    const roomWithBookings = {
      ...data,
      bookings: bookingsData || [],
    };

    return NextResponse.json(roomWithBookings);
  } catch (error: any) {
    console.error('Error in GET /api/rooms/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch room' },
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

    // Obtener la habitación y verificar que el usuario es dueño de la propiedad
    const { data: room, error: roomError } = await supabaseServer
      .from('rooms')
      .select('property_id')
      .eq('id', params.id)
      .single();

    if (roomError || !room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Verificar que el usuario es dueño de la propiedad
    const { data: property, error: propertyError } = await supabaseServer
      .from('properties')
      .select('owner_id')
      .eq('id', room.property_id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Si la propiedad no tiene owner_id, permitir la actualización (para propiedades antiguas)
    // O verificar que el usuario es el dueño
    if (property.owner_id && property.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only update rooms in your own properties' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      propertyId,
      roomNumber,
      type,
      bathroomType,
      descriptionEs,
      descriptionEn,
      images,
      available,
      semester,
      amenities,
      availableFrom,
      availableTo,
      hasPrivateKitchen,
      isEntirePlace,
    } = body;

    // Si se está cambiando la propiedad, verificar que el usuario sea dueño de la nueva propiedad
    if (propertyId && propertyId !== room.property_id) {
      const { data: newProperty, error: newPropertyError } = await supabaseServer
        .from('properties')
        .select('owner_id')
        .eq('id', propertyId)
        .single();

      if (newPropertyError || !newProperty || newProperty.owner_id !== user.id) {
        return NextResponse.json(
          { error: 'No tienes permisos para mover la habitación a esta propiedad' },
          { status: 403 }
        );
      }
    }

    const updateData: any = {
      room_number: roomNumber,
      type,
      bathroom_type: bathroomType,
      description_es: descriptionEs,
      description_en: descriptionEn,
      available,
      semester: semester || null,
      available_from: availableFrom || null,
      available_to: availableTo || null,
      has_private_kitchen: hasPrivateKitchen ?? false,
      is_entire_place: isEntirePlace ?? false,
    };

    // Si se está cambiando la propiedad, actualizar property_id
    if (propertyId) {
      updateData.property_id = propertyId;
    }

    if (images) updateData.images = images;
    if (amenities) updateData.amenities = amenities;

    const { data, error } = await supabaseServer
      .from('rooms')
      .update(updateData)
      .eq('id', params.id)
      .select()
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
      { error: error.message || 'Failed to update room' },
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

    // Obtener property_id antes de eliminar
    const { data: room, error: roomError } = await supabaseServer
      .from('rooms')
      .select('property_id')
      .eq('id', params.id)
      .single();

    if (roomError || !room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Verificar que el usuario es dueño de la propiedad
    const { data: property, error: propertyError } = await supabaseServer
      .from('properties')
      .select('owner_id')
      .eq('id', room.property_id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Si la propiedad no tiene owner_id, permitir la eliminación (para propiedades antiguas)
    // O verificar que el usuario es el dueño
    if (property.owner_id && property.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete rooms in your own properties' },
        { status: 403 }
      );
    }

    const { error } = await supabaseServer
      .from('rooms')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Decrementar contador
    await supabaseServer.rpc('decrement_property_rooms', {
      property_id: room.property_id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete room' },
      { status: 500 }
    );
  }
}
