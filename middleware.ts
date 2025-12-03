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

  // 1. Rutas que NO requieren internacionalización (Dashboard, Student Portal, API)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/student') || pathname.startsWith('/api')) {
    
    // Crear respuesta base
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Configurar Supabase (Edge Runtime compatible)
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
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Proteger Dashboard
    if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard/login';
        return NextResponse.redirect(url);
      }
    }

    // Proteger Student Portal
    if (pathname.startsWith('/student') && !pathname.startsWith('/student/login') && !pathname.startsWith('/student/register')) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = '/student/login';
        return NextResponse.redirect(url);
      }
    }

    return response;
  }

  // 2. Rutas públicas con internacionalización
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match all pathnames within `/users`, optionally with a locale prefix
    '/([\\w-]+)?/users/(.+)'
  ]
};
