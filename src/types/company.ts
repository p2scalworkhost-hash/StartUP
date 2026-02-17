import { Timestamp } from 'firebase/firestore';

export interface CompanyDoc {
    company_id: string;
    owner_uid: string;
    member_uids: string[];

    // Profile
    name: string;
    legal_type: 'บริษัท' | 'หจก.' | 'โรงงาน' | 'other';
    employee_count: '<10' | '10-49' | '50-99' | '100-199' | '>=200';
    province: string;
    district: string;
    branch_count: number;
    has_contractor: boolean;

    // System
    package: 'basic' | 'advanced';
    subscription_end: Timestamp;
    created_at: Timestamp;
    updated_at: Timestamp;
}
