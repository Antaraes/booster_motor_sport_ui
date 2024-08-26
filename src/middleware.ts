import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('ecommerce_token');

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname.startsWith('/admin/login');

  // Redirect unauthenticated users trying to access admin routes to the login page
  if (!currentUser && isAdminRoute && !isLoginRoute) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Allow access to public routes for both authenticated and unauthenticated users
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Allow access to admin routes for authenticated users
  if (currentUser && isAdminRoute) {
    return NextResponse.next();
  }

  // Allow access to admin login page if not authenticated
  if (!currentUser && isLoginRoute) {
    return NextResponse.next();
  }

  // Default to allowing access
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
