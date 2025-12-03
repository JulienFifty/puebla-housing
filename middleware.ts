import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Rutas de API y estáticas - pasar directamente
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Redirigir raíz a /es
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/es', request.url));
  }

  // 3. Dashboard - verificar cookie de auth
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/login')) {
    const hasAuthCookie = request.cookies.getAll().some(
      (cookie) => cookie.name.includes('sb-')
    );
    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
  }

  // 4. Student portal - verificar cookie de auth
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

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
