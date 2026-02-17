import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { computeGapLevel, computeRiskScore, computeOverallScore, computeByCategory } from '@/lib/engines/gap-analyzer';
import { getTemplateRecommendation } from '@/lib/engines/recommendation-engine';
import { chatCompletion } from '@/lib/openrouter';

function chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const assessmentId = params.id;

    const assessmentRef = adminDb.collection('assessments').doc(assessmentId);
    const assessmentSnap = await assessmentRef.get();
    const assessment = assessmentSnap.data()!;

    const { compliance_records, applicable_obligations, profile } = assessment;

    // Fetch all obligations
    const obligations: any[] = [];
    const batches = chunkArray(applicable_obligations, 10);

    for (const batch of batches) {
        if (batch.length === 0) continue;
        const snap = await adminDb.collection('obligations')
            .where('obligation_id', 'in', batch)
            .get();
        obligations.push(...snap.docs.map(d => d.data()));
    }

    // Run rule-based gap analysis
    const gapItems = obligations.map(obl => {
        const record = compliance_records[obl.obligation_id];
        const status = record?.status || 'no';

        const gapLevel = computeGapLevel(status, obl.risk_weight);
        const riskScore = computeRiskScore(status, obl.risk_weight);
        const recommendation = getTemplateRecommendation(obl, gapLevel);

        return {
            obligation_id: obl.obligation_id,
            law_id: obl.law_id,
            category: obl.category,
            topic: obl.topic || obl.checklist_question, // Ensure we have a label
            gap_level: gapLevel,
            risk_score: riskScore,
            recommendation,
        };
    });

    // Compute summary
    let gapSummary: any = {
        overall_score: computeOverallScore(gapItems),
        red_count: gapItems.filter(i => i.gap_level === 'red').length,
        yellow_count: gapItems.filter(i => i.gap_level === 'yellow').length,
        green_count: gapItems.filter(i => i.gap_level === 'green').length,
        by_category: computeByCategory(gapItems),
        items: gapItems,
        computed_at: new Date().toISOString(),
    };

    // --- AI Analysis ---
    // Only query AI if there are issues (Red/Yellow)
    const criticalIssues = gapItems.filter(i => i.gap_level === 'red' || i.gap_level === 'yellow');

    if (criticalIssues.length > 0) {
        try {
            const prompt = `
Role: You are a SHEQ (Safety, Health, Environment, Quality) Compliance Auditor.
Task: Analyze the following compliance gaps and provide an "Executive Summary".
Context:
- Company Profile: ${JSON.stringify(profile)}
- Critical Gaps Found: ${criticalIssues.length} items

Top 5 Critical Gaps:
${criticalIssues.slice(0, 5).map(i => `- [${i.gap_level.toUpperCase()}] ${i.topic} (Category: ${i.category})`).join('\n')}

Output Format:
1. Executive Summary (2-3 sentences)
2. Immediate Action Plan (Bullet points, prioritized)
3. Long-term Suggestion

Keep it professional, concise, and in Thai language.
`;

            const aiResponse = await chatCompletion([
                { role: 'user', content: prompt }
            ]);

            gapSummary.ai_summary = aiResponse;

        } catch (error) {
            console.error('AI Analysis failed:', error);
            gapSummary.ai_summary = 'AI Analysis unavailable at this time.';
        }
    } else {
        gapSummary.ai_summary = 'ยอดเยี่ยม! ไม่พบข้อบกพร่องที่มีความเสี่ยงสูงหรือปานกลางในขณะนี้ รักษามาตรฐานต่อไป';
    }

    await assessmentRef.update({
        gap_summary: gapSummary,
        status: 'completed',
        updated_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ gap_summary: gapSummary });
}
