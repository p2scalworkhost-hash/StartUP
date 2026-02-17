import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { mapTagsFromProfile } from '@/lib/engines/legal-mapper';
import type { AssessmentProfile } from '@/types/assessment';

export async function POST(req: NextRequest) {
    // 1. Auth check
    const session = req.cookies.get('session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!adminAuth) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let uid: string;
    try {
        const claims = await adminAuth.verifySessionCookie(session, true);
        uid = claims.uid;
    } catch {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // 2. Get company
    const companiesRef = adminDb.collection('companies');
    const companySnap = await companiesRef.where('owner_uid', '==', uid).limit(1).get();

    if (companySnap.empty) {
        return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const company = companySnap.docs[0];

    // 3. Parse profile
    const profile: AssessmentProfile = await req.json();

    // 4. Compute activity tags
    const activityTags = mapTagsFromProfile(profile);

    // 5. Create assessment doc
    const assessmentRef = adminDb.collection('assessments').doc();
    await assessmentRef.set({
        assessment_id: assessmentRef.id,
        company_id: company.id,
        profile,
        activity_tags: activityTags,
        applicable_laws: [],
        applicable_obligations: [],
        compliance_records: {},
        gap_summary: null,
        status: 'mapping',
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
        assessment_id: assessmentRef.id,
        activity_tags: activityTags,
    });
}
