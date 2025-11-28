import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const semester = searchParams.get('semester');

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

    let query = supabaseServer
      .from('rooms')
      .select(`
        *,
        properties:property_id (
          id,
          name_es,
          name_en,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    if (semester) {
      query = query.eq('semester', semester);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch rooms' },
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

    // Verificar que el usuario es dueño de la propiedad
    const { data: property, error: propertyError } = await supabaseServer
      .from('properties')
      .select('owner_id')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property || property.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized or property not found' },
        { status: 403 }
      );
    }

    // Verificar si ya existe una habitación con el mismo número en la misma propiedad
    const { data: existingRoom } = await supabaseServer
      .from('rooms')
      .select('id')
      .eq('property_id', propertyId)
      .eq('room_number', roomNumber)
      .single();

    if (existingRoom) {
      return NextResponse.json(
        { error: `Ya existe una habitación #${roomNumber} en esta propiedad` },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('rooms')
      .insert({
        property_id: propertyId,
        room_number: roomNumber,
        type,
        bathroom_type: bathroomType,
        description_es: descriptionEs,
        description_en: descriptionEn,
        images: images || [],
        available: available ?? true,
        semester: semester || null,
        amenities: amenities || [],
        available_from: availableFrom || null,
        available_to: availableTo || null,
        has_private_kitchen: hasPrivateKitchen ?? false,
        is_entire_place: isEntirePlace ?? false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Actualizar contador de habitaciones
    await supabaseServer.rpc('increment_property_rooms', {
      property_id: propertyId,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create room' },
      { status: 500 }
    );
  }
}
