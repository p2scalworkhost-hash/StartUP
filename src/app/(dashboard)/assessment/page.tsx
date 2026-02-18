'use client';

import { useEffect, useState } from 'react';
import { QuestionnaireShell } from '@/components/questionnaire/QuestionnaireShell';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { ChecklistShell } from '@/components/checklist/ChecklistShell';
import { useAuthStore } from '@/stores/authStore';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { AssessmentDoc } from '@/types/assessment';

export default function AssessmentPage() {
    const { companyId } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'profiling' | 'checklist' | 'completed'>('profiling');
    const [assessmentId, setAssessmentId] = useState<string | null>(null);

    useEffect(() => {
        async function checkStatus() {
            if (!companyId) {
                // If no company, definitely profiling
                setView('profiling');
                setLoading(false);
                return;
            }

            try {
                // Find latest active assessment
                // Remove orderBy to avoid index error
                const q = query(
                    collection(db, 'assessments'),
                    where('company_id', '==', companyId)
                );
                const snap = await getDocs(q);

                if (snap.empty) {
                    // Reset store to ensure clean slate
                    useAssessmentStore.getState().resetProfile();
                    setView('profiling');
                } else {
                    // Client-side sort
                    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as AssessmentDoc & { id: string }));
                    docs.sort((a, b) => {
                        const tA = a.created_at?.seconds || 0;
                        const tB = b.created_at?.seconds || 0;
                        return tB - tA;
                    });

                    const latest = docs[0];
                    const status = latest.status;

                    if (status === 'completed') {
                        router.push('/dashboard');
                        return;
                    } else if (status === 'checklist' || status === 'gap_analysis') {
                        setAssessmentId(latest.id);
                        setView('checklist');
                    } else {
                        // Reset store for new/cancelled assessment
                        useAssessmentStore.getState().resetProfile();
                        setView('profiling');
                    }
                }
            } catch (err) {
                console.error(err);
                setView('profiling');
            } finally {
                setLoading(false);
            }
        }

        checkStatus();
    }, [companyId, router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">กำลังตรวจสอบสถานะ...</div>;
    }

    if (view === 'checklist' && assessmentId) {
        return (
            <div className="py-8 px-4 bg-slate-50 min-h-screen">
                <ChecklistShell assessmentId={assessmentId} />
            </div>
        );
    }

    // Default to profiling (New Assessment)
    return <QuestionnaireShell />;
}
