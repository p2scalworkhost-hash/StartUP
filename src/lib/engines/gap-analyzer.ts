/**
 * Gap Analyzer Engine
 * Computes gap levels and risk scores based on compliance records
 *
 * Design principle: Rule-based, transparent, NO AI for gap scoring
 */

export type ComplianceStatus = 'yes' | 'partial' | 'no' | 'na';
export type RiskWeight = 1 | 2 | 3;
export type GapLevel = 'red' | 'yellow' | 'green';

export function computeGapLevel(
    status: ComplianceStatus,
    riskWeight: RiskWeight
): GapLevel {
    if (status === 'na') return 'green';
    if (status === 'yes') return 'green';
    if (status === 'partial') {
        return riskWeight === 3 ? 'red' : 'yellow';
    }
    // status === 'no'
    if (riskWeight === 1) return 'yellow';
    return 'red';
}

export function computeRiskScore(
    status: ComplianceStatus,
    riskWeight: RiskWeight
): number {
    const statusMultiplier: Record<ComplianceStatus, number> = {
        yes: 0,
        partial: 0.5,
        no: 1,
        na: 0,
    };
    const mult = statusMultiplier[status] ?? 1;
    return Math.round(riskWeight * mult * 33.33);
}

export function computeOverallScore(
    items: Array<{ gap_level: GapLevel }>
): number {
    if (items.length === 0) return 100;
    const greenCount = items.filter(i => i.gap_level === 'green').length;
    return Math.round((greenCount / items.length) * 100);
}

export function computeByCategory(
    items: Array<{ gap_level: GapLevel; category: string }>
): Record<string, { score: number; red: number; yellow: number; green: number }> {
    const categories = ['safety', 'environment', 'labor', 'quality', 'energy', 'public_health'];
    const result: Record<string, { score: number; red: number; yellow: number; green: number }> = {};

    for (const cat of categories) {
        const catItems = items.filter(i => i.category === cat);
        if (catItems.length === 0) continue;

        result[cat] = {
            score: computeOverallScore(catItems),
            red: catItems.filter(i => i.gap_level === 'red').length,
            yellow: catItems.filter(i => i.gap_level === 'yellow').length,
            green: catItems.filter(i => i.gap_level === 'green').length,
        };
    }

    return result;
}

export function computeGapAnalysis(
    obligations: Array<{
        obligation_id: string;
        law_id: string;
        category: string;
        risk_weight: RiskWeight;
    }>,
    complianceRecords: Record<string, { status: ComplianceStatus }>
) {
    return obligations.map(obl => {
        const record = complianceRecords[obl.obligation_id];
        const status: ComplianceStatus = record?.status || 'no';

        const gapLevel = computeGapLevel(status, obl.risk_weight);
        const riskScore = computeRiskScore(status, obl.risk_weight);

        return {
            obligation_id: obl.obligation_id,
            law_id: obl.law_id,
            category: obl.category,
            gap_level: gapLevel,
            risk_score: riskScore,
        };
    });
}
