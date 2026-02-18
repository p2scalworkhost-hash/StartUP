// API Response types

export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    status: 'success' | 'error';
}

export interface CreateAssessmentResponse {
    assessment_id: string;
    activity_tags: string[];
}

export interface LegalMappingResponse {
    laws: unknown[];
    obligations: unknown[];
    law_count: number;
    obligation_count: number;
}

export interface GapAnalysisResponse {
    gap_summary: import('./assessment').GapSummary;
}

export interface SessionResponse {
    uid: string;
    email: string;
    role: string;
}

export interface ExplainLawResponse {
    explanation: string;
}

export interface RecommendationResponse {
    action_plan: import('./assessment').ActionStep[];
    executive_summary: string;
}
