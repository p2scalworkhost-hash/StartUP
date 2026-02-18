import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { computeGapLevel, computeRiskScore, computeOverallScore, computeByCategory, RiskWeight } from '@/lib/engines/gap-analyzer';
import { getTemplateRecommendation } from '@/lib/engines/recommendation-engine';

interface ObligationDoc {
    obligation_id: string;
    law_id: string;
    category: string;
    risk_weight: RiskWeight;
    topic?: string;
    checklist_question?: string;
    required_evidence?: string;
    risk_level?: string;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    // Auth check
    const session = req.cookies.get('session')?.value;
    if (!session || !adminAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        await adminAuth.verifySessionCookie(session, true);
    } catch {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const assessmentId = params.id;

    if (!adminDb) {
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const assessmentRef = adminDb.collection('assessments').doc(assessmentId);
    const assessmentSnap = await assessmentRef.get();

    if (!assessmentSnap.exists) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const assessment = assessmentSnap.data()!;

    const { compliance_records = {}, applicable_obligations = [] } = assessment;

    // Fetch all obligations
    const obligations: ObligationDoc[] = [];
    const batches = chunkArray(applicable_obligations, 10);

    // Parallel fetch (Eliminating Waterfall)
    const promises = batches.map(batch => {
        if (batch.length === 0) return Promise.resolve(null);
        return adminDb.collection('obligations')
            .where('obligation_id', 'in', batch)
            .get();
    });

    const snapshots = await Promise.all(promises);

    snapshots.forEach(snap => {
        if (snap) {
            obligations.push(...snap.docs.map(d => d.data() as ObligationDoc));
        }
    });

    // Run rule-based gap analysis
    const gapItems = obligations.map(obl => {
        const record = compliance_records[obl.obligation_id];
        const status = record?.status || 'no';

        const gapLevel = computeGapLevel(status, obl.risk_weight);
        const riskScore = computeRiskScore(status, obl.risk_weight);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recommendation = getTemplateRecommendation(obl as any, gapLevel); // cast for recommendation engine if needed

        return {
            obligation_id: obl.obligation_id,
            law_id: obl.law_id,
            category: obl.category,
            topic: obl.topic || obl.checklist_question || 'Topic',
            gap_level: gapLevel,
            risk_score: riskScore,
            recommendation,
        };
    });

    // Compute summary
    const gapSummary = {
        overall_score: computeOverallScore(gapItems),
        red_count: gapItems.filter(i => i.gap_level === 'red').length,
        yellow_count: gapItems.filter(i => i.gap_level === 'yellow').length,
        green_count: gapItems.filter(i => i.gap_level === 'green').length,
        by_category: computeByCategory(gapItems),
        items: gapItems,
        ai_summary: {
            executive_summary: 'การวิเคราะห์เสร็จสมบูรณ์ (AI Analysis Disabled)',
            maturity_level: 'Reactive',
            risk_profile: { score: 0, level: 'Low', top_risks: [] },
            strength_weakness: { strengths: [], weaknesses: [] },
            strategic_recommendations: { immediate: [], short_term: [], long_term: [] },
            computed_at: new Date().toISOString()
        },
        computed_at: new Date().toISOString(),
    };

    await assessmentRef.update({
        gap_summary: gapSummary,
        status: 'completed',
        updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ gap_summary: gapSummary });
}
