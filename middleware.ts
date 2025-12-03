import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Excluir rutas del dashboard, student y API de la internacionalización
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/student') || pathname.startsWith('/api')) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Configurar Supabase client para rutas protegidas (Edge Runtime compatible)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Proteger rutas del dashboard de propietarios
    if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard/login';
        return NextResponse.redirect(url);
      }
    }

    // Proteger rutas del portal de estudiantes
    if (pathname.startsWith('/student') && !pathname.startsWith('/student/login') && !pathname.startsWith('/student/register')) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = '/student/login';
        return NextResponse.redirect(url);
      }
    }

    return response;
  }

  // Para otras rutas (incluyendo /), aplicar internacionalización
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mov|webm)$).*)',
  ],
};
