import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// Whitelist of fields allowed in PATCH updates
const ALLOWED_PATCH_FIELDS = new Set([
    'compliance_records',
    'status',
    'profile',
    'applicable_laws',
    'applicable_obligations',
    'activity_tags',
]);

async function verifySession(req: NextRequest): Promise<string | null> {
    const session = req.cookies.get('session')?.value;
    if (!session || !adminAuth) return null;
    try {
        const claims = await adminAuth.verifySessionCookie(session, true);
        return claims.uid;
    } catch {
        return null;
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const uid = await verifySession(req);
    if (!uid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assessmentId = params.id;

    const assessmentRef = adminDb.collection('assessments').doc(assessmentId);
    const assessmentSnap = await assessmentRef.get();

    if (!assessmentSnap.exists) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json(assessmentSnap.data());
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const uid = await verifySession(req);
    if (!uid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assessmentId = params.id;
    const rawUpdates = await req.json();

    // Sanitize: only allow whitelisted fields
    const updates: Record<string, unknown> = {};
    for (const key of Object.keys(rawUpdates)) {
        if (ALLOWED_PATCH_FIELDS.has(key)) {
            updates[key] = rawUpdates[key];
        }
    }

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    updates.updated_at = FieldValue.serverTimestamp();

    const assessmentRef = adminDb.collection('assessments').doc(assessmentId);
    await assessmentRef.update(updates);

    return NextResponse.json({ status: 'updated' });
}
