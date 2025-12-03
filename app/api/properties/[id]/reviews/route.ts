import { NextRequest, NextResponse } from 'next/server';

interface GoogleReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlacesResponse {
  result?: {
    reviews?: GoogleReview[];
    rating?: number;
    user_ratings_total?: number;
  };
  status: string;
  error_message?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    // Obtener detalles del lugar incluyendo reseñas
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

    const response = await fetch(url);
    const data: GooglePlacesResponse = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status, data.error_message);
      return NextResponse.json(
        { 
          error: data.error_message || `Google Places API error: ${data.status}`,
          status: data.status
        },
        { status: 400 }
      );
    }

    if (!data.result) {
      return NextResponse.json(
        { error: 'No data returned from Google Places API' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      reviews: data.result.reviews || [],
      rating: data.result.rating || 0,
      totalReviews: data.result.user_ratings_total || 0,
    });
  } catch (error: any) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}



