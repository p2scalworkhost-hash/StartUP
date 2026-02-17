'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/authStore';
import { db } from '@/lib/firebase/client';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface Obligation {
    obligation_id: string;
    topic: string;
    checklist_question: string;
    law_id: string;
    category: string;
    risk_weight: string;
}

interface ComplianceRecord {
    status: 'yes' | 'partial' | 'no' | 'na';
    notes?: string;
    answered_at?: string;
}

export function ChecklistShell({ assessmentId }: { assessmentId: string }) {
    const router = useRouter();
    const [obligations, setObligations] = useState<Obligation[]>([]);
    const [records, setRecords] = useState<Record<string, ComplianceRecord>>({});
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [saving, setSaving] = useState(false);

    // Fetch Checklist Data
    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch(`/api/assessment/${assessmentId}/checklist`);
                if (!res.ok) throw new Error('Failed to load checklist');
                const data = await res.json();
                setObligations(data.obligations || []);
                setRecords(data.compliance_records || {}); // Load existing answers
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [assessmentId]);

    const handleAnswer = async (status: 'yes' | 'partial' | 'no' | 'na') => {
        const currentObligation = obligations[currentIndex];
        if (!currentObligation) return;

        const newRecord: ComplianceRecord = {
            status,
            answered_at: new Date().toISOString()
        };

        // Optimistic Update
        setRecords(prev => ({
            ...prev,
            [currentObligation.obligation_id]: newRecord
        }));

        // Persist to DB (Fire and forget or wait?)
        // Waiting is safer to ensure data integrity
        setSaving(true);
        try {
            await fetch(`/api/assessment/${assessmentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    [`compliance_records.${currentObligation.obligation_id}`]: newRecord
                })
            });

            // Auto advance
            if (currentIndex < obligations.length - 1) {
                setCurrentIndex(prev => prev + 1);
            }
        } catch (err) {
            console.error('Failed to save answer:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleFinish = async () => {
        setSaving(true);
        try {
            // Trigger Gap Analysis
            await fetch(`/api/assessment/${assessmentId}/gap-analysis`, {
                method: 'POST'
            });

            // Redirect to Dashboard
            router.push('/dashboard');
        } catch (err) {
            console.error('Failed to finish assessment:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">กำลังโหลดแบบตรวจสอบ...</div>;

    if (obligations.length === 0) {
        return (
            <div className="p-10 text-center">
                <p>ไม่พบรายการตรวจสอบที่เกี่ยวข้อง </p>
                <Button onClick={handleFinish} className="mt-4">ข้ามไปดูผลการประเมิน</Button>
            </div>
        );
    }

    const currentObligation = obligations[currentIndex];
    const currentRecord = records[currentObligation.obligation_id];
    const progress = ((currentIndex) / obligations.length) * 100;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">แบบตรวจสอบความสอดคล้อง</h1>
                    <p className="text-sm text-slate-500">
                        {currentIndex + 1} จาก {obligations.length} รายการ
                    </p>
                </div>
                {currentIndex === obligations.length - 1 && (
                    <Button onClick={handleFinish} disabled={saving}>
                        {saving ? 'กำลังประมวลผล...' : 'วิเคราะห์ผล ⚡'}
                    </Button>
                )}
            </div>

            <Progress value={progress} className="h-2" />

            {/* Question Card */}
            <Card className="p-6 min-h-[300px] flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant="default">{currentObligation.category}</Badge>
                        <span className="text-xs text-slate-400">{currentObligation.law_id}</span>
                    </div>

                    <h2 className="text-lg font-medium text-slate-800 mb-2">
                        {currentObligation.checklist_question}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {currentObligation.topic}
                    </p>
                </div>

                {/* Answer Options */}
                <div className="space-y-3 mt-8">
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant={currentRecord?.status === 'yes' ? 'primary' : 'outline'}
                            onClick={() => handleAnswer('yes')}
                            disabled={saving}
                            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                        >
                            ✅ สอดคล้อง
                        </Button>
                        <Button
                            variant={currentRecord?.status === 'no' ? 'primary' : 'outline'}
                            onClick={() => handleAnswer('no')}
                            disabled={saving}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        >
                            ❌ ไม่สอดคล้อง
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant={currentRecord?.status === 'partial' ? 'primary' : 'outline'}
                            onClick={() => handleAnswer('partial')}
                            disabled={saving}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                        >
                            ⚠️ บางส่วน
                        </Button>
                        <Button
                            variant={currentRecord?.status === 'na' ? 'primary' : 'outline'}
                            onClick={() => handleAnswer('na')}
                            disabled={saving}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                        >
                            🚫 ไม่เกี่ยวข้อง
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="ghost"
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0 || saving}
                >
                    ← ย้อนกลับ
                </Button>
                <span className="text-xs text-slate-400 self-center">
                    บันทึกอัตโนมัติ
                </span>
                <Button
                    variant="ghost"
                    onClick={() => setCurrentIndex(prev => Math.min(obligations.length - 1, prev + 1))}
                    disabled={currentIndex === obligations.length - 1 || saving}
                >
                    ถัดไป →
                </Button>
            </div>
        </div>
    );
}
