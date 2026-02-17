import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

function chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}

function isObligationApplicable(obligation: any, profile: any): boolean {
    const condition = obligation.applicability_condition;
    if (!condition) return true;

    const employeeMap: Record<string, number> = {
        '<10': 5, '10-49': 30, '50-99': 75,
        '100-199': 150, '>=200': 250,
    };

    const empCount = employeeMap[profile.employee_threshold] || 0;

    if (condition.includes('employee_count >= 50') && empCount < 50) return false;
    if (condition.includes('employee_count >= 100') && empCount < 100) return false;
    if (condition.includes('has_contractor') && !profile.has_contractor) return false;
    if (condition.includes('machine_level == high') && profile.machine_level !== 'เครื่องจักรเกิน 75 แรงม้า') return false;

    return true;
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const assessmentId = params.id;

    const assessmentRef = adminDb.collection('assessments').doc(assessmentId);
    const assessmentSnap = await assessmentRef.get();

    if (!assessmentSnap.exists) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const assessment = assessmentSnap.data()!;
    const { activity_tags, profile } = assessment;

    // Query Legal KB
    const lawsRef = adminDb.collection('laws');
    const applicableLaws: any[] = [];
    const applicableObligations: any[] = [];

    const tagBatches = chunkArray(activity_tags, 10);

    for (const batch of tagBatches) {
        const lawSnap = await lawsRef
            .where('applicable_tags', 'array-contains-any', batch)
            .get();

        for (const doc of lawSnap.docs) {
            const law = doc.data();
            if (!applicableLaws.find(l => l.law_id === law.law_id)) {
                applicableLaws.push(law);
            }
        }
    }

    // Get obligations for each law
    for (const law of applicableLaws) {
        const oblSnap = await adminDb.collection('obligations')
            .where('law_id', '==', law.law_id)
            .get();

        for (const doc of oblSnap.docs) {
            const obl = doc.data();
            if (isObligationApplicable(obl, profile)) {
                applicableObligations.push(obl);
            }
        }
    }

    // Update assessment
    await assessmentRef.update({
        applicable_laws: applicableLaws.map(l => l.law_id),
        applicable_obligations: applicableObligations.map(o => o.obligation_id),
        status: 'checklist',
        updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
        laws: applicableLaws,
        obligations: applicableObligations,
        law_count: applicableLaws.length,
        obligation_count: applicableObligations.length,
    });
}
