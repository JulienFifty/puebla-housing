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

    const { data, error } = await supabaseServer
      .from('properties')
      .select(`
        *,
        rooms (*)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    // Calcular tipos de habitaciones disponibles desde las habitaciones reales
    if (data.rooms && Array.isArray(data.rooms)) {
      const roomTypes = new Set<string>();
      data.rooms.forEach((room: any) => {
        if (room.type === 'private' || room.type === 'shared') {
          roomTypes.add(room.type);
        }
      });
      data.room_types = Array.from(roomTypes) as ('private' | 'shared')[];
    } else {
      data.room_types = [];
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch property' },
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

    const body = await request.json();
    const {
      nameEs,
      nameEn,
      slug,
      locationEs,
      locationEn,
      address,
      zone,
      university,
      descriptionEs,
      descriptionEn,
      images,
      available,
      availableFrom,
      googlePlaceId,
    } = body;

    const updateData: any = {
      name_es: nameEs,
      name_en: nameEn,
      slug,
      location_es: locationEs,
      location_en: locationEn,
      address,
      zone,
      university,
      description_es: descriptionEs,
      description_en: descriptionEn,
      available,
    };

    if (availableFrom !== undefined) {
      updateData.available_from = availableFrom || null;
    }

    if (googlePlaceId !== undefined) {
      updateData.google_place_id = googlePlaceId || null;
    }

    if (images) updateData.images = images;

    // Verificar que el usuario es el dueño de la propiedad antes de actualizar
    const { data: existingProperty } = await supabaseServer
      .from('properties')
      .select('owner_id')
      .eq('id', params.id)
      .single();

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    if (existingProperty.owner_id && existingProperty.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only update your own properties' },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseServer
      .from('properties')
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
      { error: error.message || 'Failed to update property' },
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

    const { error } = await supabaseServer
      .from('properties')
      .delete()
      .eq('id', params.id)
      .eq('owner_id', user.id); // Solo el dueño puede eliminar

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete property' },
      { status: 500 }
    );
  }
}
