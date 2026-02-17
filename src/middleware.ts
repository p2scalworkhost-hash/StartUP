import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const pathname = request.nextUrl.pathname;

    // Public routes — allow without session
    const publicPaths = ['/', '/login', '/register'];
    const isPublic = publicPaths.includes(pathname);

    if (isPublic) {
        return NextResponse.next();
    }

    // Protected routes — redirect to login if no session
    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
