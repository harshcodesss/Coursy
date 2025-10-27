import { NextRequest } from 'next/server';
import { handleAuth } from './middleware/authlogic';

export function middleware(request: NextRequest) {
  return handleAuth(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};