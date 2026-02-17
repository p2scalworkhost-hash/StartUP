import { Timestamp } from 'firebase/firestore';

export interface LawDoc {
    law_id: string;
    law_name: string;
    category: 'safety' | 'environment' | 'labor' | 'quality' | 'energy' | 'public_health';
    ministry: string;
    effective_date: string;
    source_url: string;
    summary: string;
    applicable_tags: string[];

    // For RAG
    full_text: string;
    embedding_id: string;

    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface ObligationDoc {
    obligation_id: string;
    law_id: string;

    description: string;
    simplified_description: string;
    category: 'safety' | 'environment' | 'labor' | 'quality' | 'energy' | 'public_health';

    risk_weight: 1 | 2 | 3;
    risk_level: 'low' | 'medium' | 'high';

    required_evidence: string[];
    applicability_condition: string;

    // Checklist display
    checklist_question: string;
    guidance_text: string;

    created_at: Timestamp;
}

export type LawCategory = LawDoc['category'];
