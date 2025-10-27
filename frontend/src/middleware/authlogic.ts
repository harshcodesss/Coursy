import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/settings'];
const authRoutes = ['/login', '/signup', '/verify','auth-success', '/password-reset', '/forgot-password'];

export function handleAuth(request: NextRequest) {
    const sessionToken = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    if (sessionToken && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!sessionToken && protectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}