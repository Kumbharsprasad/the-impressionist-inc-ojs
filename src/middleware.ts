import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    // 1. Update session expiration
    const session = request.cookies.get("session")?.value;

    // 2. Protected Routes Logic
    const path = request.nextUrl.pathname;
    const isPublic = path.startsWith('/login') || path.startsWith('/register') || path === '/';
    const isDashboard = path.startsWith('/dashboard');

    if (isDashboard && !session) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    if (session && (path.startsWith('/login') || path.startsWith('/register'))) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    // Optional: Role based protection
    if (session) {
        try {
            const payload = await decrypt(session);
            // Example: Force editors to editor dashboard?
            // For now, we allow access to generic /dashboard and handle role content inside component
        } catch (e) {
            // invalid session
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
    }

    return await updateSession(request);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
