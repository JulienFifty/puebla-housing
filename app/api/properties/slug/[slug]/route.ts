import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
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
      .eq('slug', params.slug)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Property not found' },
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
      data.total_rooms = data.rooms.length;
    } else {
      data.room_types = [];
      data.total_rooms = 0;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching property by slug:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch property' },
      { status: 500 }
    );
  }
}






