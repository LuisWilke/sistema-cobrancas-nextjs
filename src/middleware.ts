import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rotas que requerem autenticação
  const protectedRoutes = ['/dashboard', '/cobrancas', '/gestao-pix', '/configuracao', '/minha-conta'];
  
  // Rotas públicas (login, reset-password)
  const publicRoutes = ['/login', '/reset-password'];
  
  const { pathname } = request.nextUrl;
  
  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Para rotas protegidas, verificar autenticação no lado do cliente
  // (Next.js middleware não tem acesso ao localStorage)
  if (isProtectedRoute) {
    // Permitir que o componente do lado do cliente faça a verificação
    return NextResponse.next();
  }
  
  // Para rotas públicas, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Para a rota raiz, permitir que o componente faça o redirecionamento
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

