import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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
    const assessmentId = params.id;
    const updates = await req.json();

    const assessmentRef = adminDb.collection('assessments').doc(assessmentId);
    await assessmentRef.update(updates);

    return NextResponse.json({ status: 'updated' });
}
