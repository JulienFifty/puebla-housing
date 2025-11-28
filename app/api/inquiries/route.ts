import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// GET: Obtener todas las solicitudes (solo para dashboard, requiere autenticación)
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    // Primero obtener las solicitudes sin la relación student (que puede no existir)
    let query = supabaseServer
      .from('inquiries')
      .select(`
        *,
        properties:property_id (
          id,
          name_es,
          name_en,
          slug
        ),
        rooms:room_id (
          id,
          room_number,
          properties:property_id (
            id,
            name_es
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching inquiries:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          error: error.message,
          details: error,
          hint: 'Verifica las políticas RLS en Supabase'
        },
        { status: 500 }
      );
    }

    // Si hay datos y tienen student_id, obtener información del estudiante por separado
    if (data && data.length > 0) {
      const studentIds = data
        .map((inq: any) => inq.student_id)
        .filter((id: string | null) => id !== null);
      
      if (studentIds.length > 0) {
        const { data: students } = await supabaseServer
          .from('profiles')
          .select('id, name, email, university, country, phone')
          .in('id', studentIds);
        
        // Combinar datos
        const studentsMap = new Map(students?.map((s: any) => [s.id, s]) || []);
        data.forEach((inq: any) => {
          if (inq.student_id && studentsMap.has(inq.student_id)) {
            inq.student = studentsMap.get(inq.student_id);
          }
        });
      }
    }

    console.log('Inquiries fetched successfully:', data?.length || 0);
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error in GET /api/inquiries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

// POST: Crear nueva solicitud (público, no requiere autenticación)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get() {
            return undefined; // No necesitamos cookies para crear inquiries
          },
        },
      }
    );

    const body = await request.json();
    const {
      name,
      email,
      phone,
      message,
      type = 'contact',
      propertyId,
      propertySlug,
      roomId,
      university,
      country,
      semester,
      moveInDate,
      moveOutDate,
      studentId,
    } = body;

    // Validar campos requeridos
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    // Si se proporciona propertySlug pero no propertyId, buscar el propertyId
    let finalPropertyId = propertyId || null;
    if (propertySlug && !propertyId) {
      const { data: propertyData } = await supabase
        .from('properties')
        .select('id')
        .eq('slug', propertySlug)
        .single();
      
      if (propertyData) {
        finalPropertyId = propertyData.id;
      }
    }

    // Crear la solicitud - solo incluir campos básicos
    // Los campos adicionales (university, country, etc.) solo se incluyen si existen en la DB
    const insertData: any = {
      name,
      email,
      phone: phone || null,
      message,
      type: type || 'contact',
      property_id: finalPropertyId,
      room_id: roomId || null,
      status: 'new',
    };

    // Agregar campos opcionales si se proporcionan
    // Estos campos solo funcionarán si se ha ejecutado add-student-schema.sql
    if (university) insertData.university = university;
    if (country) insertData.country = country;
    if (semester) insertData.semester = semester;
    if (moveInDate) insertData.move_in_date = moveInDate;
    if (moveOutDate) insertData.move_out_date = moveOutDate;
    if (studentId) insertData.student_id = studentId;

    const { data, error } = await supabase
      .from('inquiries')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating inquiry:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/inquiries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create inquiry' },
      { status: 500 }
    );
  }
}

