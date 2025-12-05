import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Usar createServerClient para manejar cookies correctamente
    const cookieStore = await cookies();
    const supabaseServer = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Calcular tipos de habitaciones disponibles desde las habitaciones reales
    const propertiesWithRoomTypes = (data || []).map((property: any) => {
      if (property.rooms && Array.isArray(property.rooms)) {
        const roomTypes = new Set<string>();
        property.rooms.forEach((room: any) => {
          if (room.type === 'private' || room.type === 'shared') {
            roomTypes.add(room.type);
          }
        });
        property.room_types = Array.from(roomTypes) as ('private' | 'shared')[];
      } else {
        property.room_types = [];
      }
      return property;
    });

    return NextResponse.json(propertiesWithRoomTypes);
  } catch (error: any) {
    console.error('Error in GET /api/properties:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch properties' },
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
      bathroomTypes,
      available,
      googlePlaceId,
      commonAreas,
    } = body;

    const { data, error } = await supabaseServer
      .from('properties')
      .insert({
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
        images: images || [],
        bathroom_types: bathroomTypes || [],
        available: available ?? true,
        owner_id: user.id,
        google_place_id: googlePlaceId || null,
        common_areas: commonAreas || [],
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create property' },
      { status: 500 }
    );
  }
}
