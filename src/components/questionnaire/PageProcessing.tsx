'use client';

import { useEffect, useState } from 'react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useAuthStore } from '@/stores/authStore';
import { db, auth } from '@/lib/firebase/client';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { mapTagsFromProfile } from '@/lib/engines/legal-mapper';
import { useRouter } from 'next/navigation';

const STEPS = [
    { label: 'กำลังสร้างโปรไฟล์บริษัท...', duration: 1000 },
    { label: 'กำลังประมวลผลข้อมูล...', duration: 1500 },
    { label: 'กำลังตรวจสอบกฎหมายที่เกี่ยวข้อง...', duration: 2000 },
    { label: 'กำลังสร้างรายการตรวจสอบ...', duration: 1500 },
    { label: 'เสร็จสิ้น! กำลังเปลี่ยนหน้า...', duration: 1000 },
];

export function PageProcessing() {
    const { profile, companyName, setProcessingStep, resetProfile } = useAssessmentStore();
    const { setCompany } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [done, setDone] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const processSteps = async () => {
            if (!auth.currentUser) {
                console.error('No user logged in');
                return;
            }

            const uid = auth.currentUser.uid;

            try {
                // Step 0: Create Company Profile
                setCurrentStep(0);
                setProcessingStep(STEPS[0].label);

                // Create company doc ref with auto-ID
                const companyRef = doc(collection(db, 'companies'));
                await setDoc(companyRef, {
                    company_id: companyRef.id,
                    name: companyName || 'New Company',
                    owner_uid: uid,
                    member_uids: [uid],
                    employee_count: profile.employee_threshold,
                    legal_type: 'บริษัท', // Default
                    package: 'basic',
                    subscription_end: null,
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp(),
                    // ... other profile fields
                    ...profile
                });

                // Update Auth Store immediately so Dashboard know we have a company
                setCompany({ id: companyRef.id, name: companyName || 'New Company' });

                await new Promise(r => setTimeout(r, 1000));

                // Step 1: Analyze Tags
                setCurrentStep(1);
                setProcessingStep(STEPS[1].label);
                const activityTags = mapTagsFromProfile(profile as any); // Cast profile
                await new Promise(r => setTimeout(r, 1000));

                // Step 2: Find Laws
                setCurrentStep(2);
                setProcessingStep(STEPS[2].label);

                const applicableLaws: string[] = [];
                // Chunk tags for query (max 10)
                const tagBatches = [];
                for (let i = 0; i < activityTags.length; i += 10) {
                    tagBatches.push(activityTags.slice(i, i + 10));
                }

                for (const batch of tagBatches) {
                    if (batch.length === 0) continue;
                    const lawsQ = query(collection(db, 'laws'), where('applicable_tags', 'array-contains-any', batch));
                    const snap = await getDocs(lawsQ);
                    snap.forEach(d => {
                        const data = d.data();
                        if (!applicableLaws.includes(data.law_id)) {
                            applicableLaws.push(data.law_id);
                        }
                    });
                }

                // Step 2.5: Find Obligations
                const applicableObligations: string[] = [];
                const lawBatches = [];
                for (let i = 0; i < applicableLaws.length; i += 10) {
                    lawBatches.push(applicableLaws.slice(i, i + 10));
                }

                for (const batch of lawBatches) {
                    if (batch.length === 0) continue;
                    const obQ = query(collection(db, 'obligations'), where('law_id', 'in', batch));
                    const snap = await getDocs(obQ);
                    snap.forEach(d => {
                        const oid = d.data().obligation_id;
                        if (oid) applicableObligations.push(oid);
                    });
                }

                await new Promise(r => setTimeout(r, 1000));

                // Step 3: Create Assessment
                setCurrentStep(3);
                setProcessingStep(STEPS[3].label);

                const assessmentRef = await addDoc(collection(db, 'assessments'), {
                    company_id: companyRef.id,
                    profile,
                    activity_tags: activityTags,
                    applicable_laws: applicableLaws,
                    applicable_obligations: applicableObligations,
                    compliance_records: {},
                    gap_summary: null,
                    status: 'checklist', // Ready for checklist
                    created_at: serverTimestamp(),
                    updated_at: serverTimestamp(),
                });

                await new Promise(r => setTimeout(r, 1000));

                // Step 4: Done
                setCurrentStep(4);
                setProcessingStep(STEPS[4].label);
                setDone(true);
                setProcessingStep(null);

                // Redirect
                setTimeout(() => {
                    // Reset store so next time it's fresh? Or keep it?
                    // Better to reset.
                    resetProfile();
                    router.push('/dashboard');
                }, 1500);

            } catch (error) {
                console.error('Error in processing:', error);
                setProcessingStep('เกิดข้อผิดพลาด: ' + String(error));
            }
        };

        processSteps();

        return () => { isMounted = false; };
    }, []);

    return (
        <div className="text-center py-16 space-y-8">
            {/* Spinner */}
            <div className="relative inline-flex">
                <div className="w-24 h-24 rounded-full border-4 border-slate-200" />
                <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl">⚖️</span>
                </div>
            </div>

            {/* Progress */}
            <div className="space-y-4 max-w-sm mx-auto">
                {STEPS.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${i < currentStep
                            ? 'bg-green-100 text-green-600'
                            : i === currentStep
                                ? 'bg-blue-100 text-blue-600 animate-pulse'
                                : 'bg-slate-100 text-slate-400'
                            }`}>
                            {i < currentStep ? '✓' : i === currentStep ? '●' : '○'}
                        </div>
                        <span className={`text-sm ${i <= currentStep ? 'text-slate-700' : 'text-slate-400'
                            }`}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>

            {done && (
                <div className="space-y-3 animate-fadeIn">
                    <div className="text-4xl">🎉</div>
                    <p className="text-lg font-semibold text-slate-800">การวิเคราะห์เสร็จสมบูรณ์!</p>
                    <p className="text-sm text-slate-500">กำลังย้ายไปหน้า Dashboard...</p>
                </div>
            )}
        </div>
    );
}
