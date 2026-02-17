/**
 * Compliance Scorer Engine
 * Rule-based scoring for compliance assessment
 */

export type ComplianceStatus = 'yes' | 'partial' | 'no' | 'na';

export interface ScoreResult {
    total_items: number;
    compliant: number;
    partial: number;
    non_compliant: number;
    not_applicable: number;
    score_percentage: number;
}

export function computeComplianceScore(
    records: Record<string, { status: ComplianceStatus }>
): ScoreResult {
    const entries = Object.values(records);
    const total = entries.length;

    if (total === 0) {
        return {
            total_items: 0,
            compliant: 0,
            partial: 0,
            non_compliant: 0,
            not_applicable: 0,
            score_percentage: 0,
        };
    }

    const compliant = entries.filter(e => e.status === 'yes').length;
    const partial = entries.filter(e => e.status === 'partial').length;
    const nonCompliant = entries.filter(e => e.status === 'no').length;
    const notApplicable = entries.filter(e => e.status === 'na').length;

    // Score: yes=1, partial=0.5, no=0, na=excluded
    const scoreable = total - notApplicable;
    const score = scoreable > 0
        ? Math.round(((compliant + partial * 0.5) / scoreable) * 100)
        : 100;

    return {
        total_items: total,
        compliant,
        partial,
        non_compliant: nonCompliant,
        not_applicable: notApplicable,
        score_percentage: score,
    };
}

export function computeCategoryScores(
    records: Record<string, { status: ComplianceStatus; category: string }>
): Record<string, ScoreResult> {
    const categories = new Set(Object.values(records).map(r => r.category));
    const result: Record<string, ScoreResult> = {};

    for (const cat of Array.from(categories)) {
        const catRecords: Record<string, { status: ComplianceStatus }> = {};
        for (const [id, record] of Object.entries(records)) {
            if (record.category === cat) {
                catRecords[id] = { status: record.status };
            }
        }
        result[cat] = computeComplianceScore(catRecords);
    }

    return result;
}
