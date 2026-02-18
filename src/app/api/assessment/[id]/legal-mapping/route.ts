import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { AssessmentProfile } from '@/types/assessment';

interface Obligation {
    obligation_id: string;
    law_id: string;
    applicability_condition?: string | string[];
    [key: string]: unknown;
}

interface Law {
    law_id: string;
    applicable_tags: string[];
    [key: string]: unknown;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}

function isObligationApplicable(obligation: Obligation, profile: AssessmentProfile): boolean {
    const condition = obligation.applicability_condition;
    if (!condition) return true;

    // Normalize condition to string if array (though usually string)
    const condStr = Array.isArray(condition) ? condition.join(' ') : condition;

    const employeeMap: Record<string, number> = {
        '<10': 5, '10-49': 30, '50-99': 75,
        '100-199': 150, '>=200': 250,
    };

    const empCount = employeeMap[profile.employee_threshold] || 0;

    if (condStr.includes('employee_count >= 50') && empCount < 50) return false;
    if (condStr.includes('employee_count >= 100') && empCount < 100) return false;
    if (condStr.includes('has_contractor') && !profile.has_contractor) return false;
    if (condStr.includes('machine_level == high') && profile.machine_level !== 'เครื่องจักรเกิน 75 แรงม้า') return false;

    return true;
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const assessmentId = params.id;

    const assessmentRef = adminDb.collection('assessments').doc(assessmentId);
    let assessmentSnap;
    try {
        assessmentSnap = await assessmentRef.get();
    } catch {
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }

    if (!assessmentSnap.exists) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const assessment = assessmentSnap.data()!;
    const { activity_tags, profile } = assessment;

    // Query Legal KB
    const lawsRef = adminDb.collection('laws');
    const applicableLaws: Law[] = [];
    const applicableObligations: Obligation[] = [];

    // Ensure activity_tags is string[]
    const tags: string[] = Array.isArray(activity_tags) ? activity_tags : [];
    const tagBatches = chunkArray(tags, 10);

    for (const batch of tagBatches) {
        if (batch.length === 0) continue;
        const lawSnap = await lawsRef
            .where('applicable_tags', 'array-contains-any', batch)
            .get();

        for (const doc of lawSnap.docs) {
            const law = doc.data() as Law;
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
            const obl = doc.data() as Obligation;
            if (isObligationApplicable(obl, profile as AssessmentProfile)) {
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
