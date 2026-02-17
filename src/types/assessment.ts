import { Timestamp } from 'firebase/firestore';

export interface AssessmentProfile {
    workplace_type: string;
    employee_threshold: string;
    has_contractor: boolean;
    main_activity: string[];
    machine_level: string;
    risk_process: string[];
    environment_aspect: string[];
    energy_use: string[];
    public_health_aspect: string[];
}

export interface ComplianceRecord {
    obligation_id: string;
    status: 'yes' | 'partial' | 'no' | 'na';
    evidence_files?: string[];
    notes?: string;
    answered_at: Timestamp;
}

export interface GapItem {
    obligation_id: string;
    law_id: string;
    category: string;
    gap_level: 'red' | 'yellow' | 'green';
    risk_score: number;
    recommendation: string;
}

export interface GapSummary {
    overall_score: number;
    red_count: number;
    yellow_count: number;
    green_count: number;
    by_category: {
        [category: string]: {
            score: number;
            red: number;
            yellow: number;
            green: number;
        };
    };
    items: GapItem[];
    ai_summary: AIAnalysisResult | null;
}

export interface AIAnalysisResult {
    executive_summary: string;
    maturity_level: 'Reactive' | 'Compliant' | 'Proactive' | 'Strategic';
    risk_profile: {
        score: number;
        level: 'Low' | 'Medium' | 'High' | 'Critical';
        top_risks: string[];
    };
    strength_weakness: {
        strengths: string[];
        weaknesses: string[];
    };
    strategic_recommendations: {
        immediate: string[];
        short_term: string[];
        long_term: string[];
    };
    computed_at: Timestamp | string;
}

export interface AssessmentDoc {
    assessment_id: string;
    company_id: string;

    // Business Profile
    profile: AssessmentProfile;

    activity_tags: string[];

    // Legal Mapping Result
    applicable_laws: string[];
    applicable_obligations: string[];

    // Compliance Responses
    compliance_records: {
        [obligation_id: string]: ComplianceRecord;
    };

    // Gap Analysis Result
    gap_summary: GapSummary | null;

    // Status
    status: 'profiling' | 'mapping' | 'checklist' | 'gap_analysis' | 'completed';

    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface ActionStep {
    step: number;
    title: string;
    description: string;
    timeline: string;
    responsible: string;
    evidence_required: string[];
}
