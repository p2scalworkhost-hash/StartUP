'use client';

import { useEffect, useState } from 'react';
import { QuestionnaireShell } from '@/components/questionnaire/QuestionnaireShell';
import { ChecklistShell } from '@/components/checklist/ChecklistShell';
import { useAuthStore } from '@/stores/authStore';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

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
                const q = query(
                    collection(db, 'assessments'),
                    where('company_id', '==', companyId),
                    orderBy('created_at', 'desc'),
                    limit(1)
                );
                const snap = await getDocs(q);

                if (snap.empty) {
                    setView('profiling');
                } else {
                    const data = snap.docs[0].data();
                    const status = data.status;

                    if (status === 'completed') {
                        // If completed, redirect to dashboard or show summary?
                        // Usually redirect.
                        router.push('/dashboard');
                        return;
                    } else if (status === 'checklist' || status === 'gap_analysis') {
                        setAssessmentId(snap.docs[0].id);
                        setView('checklist');
                    } else {
                        // 'profiling' or 'mapping'
                        // If mapping, should auto-transition to checklist eventually
                        // For now treat as profiling or loading
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
