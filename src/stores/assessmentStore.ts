import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssessmentProfile } from '@/types/assessment';

interface AssessmentStore {
    // Navigation
    currentPage: number;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;

    // Profile data (questionnaire answers)
    profile: Partial<AssessmentProfile>;
    updateProfile: (data: Partial<AssessmentProfile>) => void;
    resetProfile: () => void;

    // Assessment metadata
    assessmentId: string | null;
    setAssessmentId: (id: string) => void;

    // Processing state
    // Processing state
    processingStep: string | null;
    setProcessingStep: (step: string | null) => void;

    // Company Name (New)
    companyName: string;
    setCompanyName: (name: string) => void;
}

const initialProfile: Partial<AssessmentProfile> = {
    workplace_type: '',
    employee_threshold: '',
    has_contractor: false,
    main_activity: [],
    machine_level: '',
    risk_process: [],
    environment_aspect: [],
    energy_use: [],
    public_health_aspect: [],
};

export const useAssessmentStore = create<AssessmentStore>()(
    persist(
        (set) => ({
            currentPage: 0,
            profile: initialProfile,
            assessmentId: null,
            processingStep: null,
            companyName: '',

            nextPage: () => set(s => ({ currentPage: s.currentPage + 1 })),
            prevPage: () => set(s => ({ currentPage: Math.max(0, s.currentPage - 1) })),
            goToPage: (page) => set({ currentPage: page }),

            updateProfile: (data) =>
                set(s => ({ profile: { ...s.profile, ...data } })),

            resetProfile: () =>
                set({ profile: initialProfile, currentPage: 0, assessmentId: null, companyName: '' }),

            setAssessmentId: (id) => set({ assessmentId: id }),
            setProcessingStep: (step) => set({ processingStep: step }),
            setCompanyName: (name) => set({ companyName: name }),
        }),
        {
            name: 'assessment-draft',
            partialize: (state) => ({
                currentPage: state.currentPage,
                profile: state.profile,
                assessmentId: state.assessmentId,
                companyName: state.companyName,
            }),
        }
    )
);
