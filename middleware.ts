import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n-config';

// Middleware de internacionalización
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Rutas de API - pasar directamente sin procesar
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Rutas del dashboard - redirigir a login si no hay cookie de sesión
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    // Verificación simple de cookie (sin inicializar cliente Supabase)
    const hasAuthCookie = request.cookies.getAll().some(
      cookie => cookie.name.includes('auth-token') || cookie.name.includes('sb-')
    );
    
    if (!hasAuthCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 3. Rutas del portal de estudiantes - redirigir a login si no hay cookie
  if (pathname.startsWith('/student') && !pathname.startsWith('/student/login') && !pathname.startsWith('/student/register')) {
    const hasAuthCookie = request.cookies.getAll().some(
      cookie => cookie.name.includes('auth-token') || cookie.name.includes('sb-')
    );
    
    if (!hasAuthCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/student/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 4. Dashboard login y student login/register - pasar directamente
  if (pathname.startsWith('/dashboard/login') || pathname.startsWith('/student/login') || pathname.startsWith('/student/register')) {
    return NextResponse.next();
  }

  // 5. Todas las demás rutas - aplicar internacionalización
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ]
};
