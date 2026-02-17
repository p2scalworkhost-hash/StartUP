import { NextRequest, NextResponse } from 'next/server';

// Force dynamic to prevent static generation issues
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        console.log('[API/Session] Processing login request...');

        // Safely parse body
        let body;
        try {
            body = await req.json();
        } catch (e: any) {
            console.error('[API/Session] invalid JSON');
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        const { idToken } = body;
        if (!idToken) {
            console.error('[API/Session] No ID token provided');
            return NextResponse.json({ error: 'No ID token provided' }, { status: 400 });
        }

        // Create Session Cookie using Admin SDK
        // (Now that we have the private key, this will work)
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

        if (!adminAuth) {
            console.error('[API/Session] Admin Auth not initialized (Check env vars)');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        const isProduction = process.env.NODE_ENV === 'production';

        const response = NextResponse.json({ status: 'success', mode: 'live' });

        response.cookies.set('session', sessionCookie, {
            maxAge: expiresIn / 1000,
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('[API/Session] Unhandled Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error?.message || String(error) },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const session = req.cookies.get('session')?.value;
    if (!session) {
        return NextResponse.json({ error: 'No session' }, { status: 401 });
    }

    try {
        if (!adminAuth) {
            throw new Error('Admin Auth not initialized');
        }

        const decodedClaims = await adminAuth.verifySessionCookie(session, true);

        return NextResponse.json({
            uid: decodedClaims.uid,
            email: decodedClaims.email,
            role: decodedClaims.role || 'user',
            mode: 'live'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ status: 'logged out' });
    response.cookies.delete('session');
    return response;
}
