import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n-config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Excluir rutas de API, estáticas, dashboard y student
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/student') ||
    pathname.includes('.')
  ) {
    // Para dashboard y student, verificar auth
    if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
      const hasAuthCookie = request.cookies.getAll().some(
        (cookie) => cookie.name.includes('sb-')
      );
      if (!hasAuthCookie) {
        return NextResponse.redirect(new URL('/dashboard/login', request.url));
      }
    }

    if (
      pathname.startsWith('/student') &&
      !pathname.startsWith('/student/login') &&
      !pathname.startsWith('/student/register')
    ) {
      const hasAuthCookie = request.cookies.getAll().some(
        (cookie) => cookie.name.includes('sb-')
      );
      if (!hasAuthCookie) {
        return NextResponse.redirect(new URL('/student/login', request.url));
      }
    }

    return NextResponse.next();
  }

  // Para rutas públicas, usar el middleware de internacionalización
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
