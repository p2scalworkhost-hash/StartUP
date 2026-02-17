import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

function chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const assessmentId = params.id;

    if (!adminDb) {
        console.error('Firebase Admin not initialized');
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const assessmentRef = adminDb.collection('assessments').doc(assessmentId);
    const assessmentSnap = await assessmentRef.get();

    if (!assessmentSnap.exists) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const assessment = assessmentSnap.data()!;
    const { applicable_obligations } = assessment;

    if (!applicable_obligations || applicable_obligations.length === 0) {
        return NextResponse.json({ obligations: [], compliance_records: {} });
    }

    // Fetch obligations
    const obligations: any[] = [];
    // Validating obligations list
    const validObligations = applicable_obligations.filter((id: any) => typeof id === 'string' && id.length > 0);

    if (validObligations.length === 0) {
        return NextResponse.json({ obligations: [], compliance_records: {} });
    }

    const batches = chunkArray(validObligations, 10);

    for (const batch of batches) {
        const snap = await adminDb.collection('obligations')
            .where('obligation_id', 'in', batch)
            .get();
        obligations.push(...snap.docs.map(d => d.data()));
    }

    return NextResponse.json({
        obligations,
        compliance_records: assessment.compliance_records || {},
    });
}
