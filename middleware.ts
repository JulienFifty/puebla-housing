import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n-config';

// Función para detectar el locale del usuario
function getLocale(request: NextRequest): string {
  // 1. Verificar si ya hay un locale en la URL
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameLocale) return pathnameLocale;

  // 2. Verificar el header Accept-Language
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().substring(0, 2))
      .find((lang) => locales.includes(lang as any));
    if (preferredLocale) return preferredLocale;
  }

  // 3. Usar el locale por defecto
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Rutas que NO requieren procesamiento
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') // archivos estáticos
  ) {
    return NextResponse.next();
  }

  // 2. Rutas del dashboard - verificar cookie de auth
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const hasAuthCookie = request.cookies.getAll().some(
      (cookie) => cookie.name.includes('sb-')
    );
    if (!hasAuthCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 3. Rutas del portal de estudiantes - verificar cookie de auth
  if (
    pathname.startsWith('/student') &&
    !pathname.startsWith('/student/login') &&
    !pathname.startsWith('/student/register')
  ) {
    const hasAuthCookie = request.cookies.getAll().some(
      (cookie) => cookie.name.includes('sb-')
    );
    if (!hasAuthCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/student/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 4. Rutas de auth - pasar directamente
  if (
    pathname.startsWith('/dashboard/login') ||
    pathname.startsWith('/student/login') ||
    pathname.startsWith('/student/register')
  ) {
    return NextResponse.next();
  }

  // 5. Verificar si la ruta ya tiene un locale válido
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 6. Redirigir a la ruta con el locale detectado
  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Match all pathnames except static files and API
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
