'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { GapSummary, AssessmentDoc, GapItem } from '@/types/assessment';

export default function DashboardPage() {
    const { companyId } = useAuthStore();
    const [summary, setSummary] = useState<GapSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAssessment() {
            if (!companyId) return;

            try {
                // Query without orderBy to avoid composite index requirement
                const q = query(
                    collection(db, 'assessments'),
                    where('company_id', '==', companyId)
                );
                const snap = await getDocs(q);

                if (!snap.empty) {
                    // Client-side sort: newest first
                    const docs = snap.docs.map(d => d.data() as AssessmentDoc);
                    docs.sort((a, b) => {
                        const tA = a.created_at?.seconds || 0;
                        const tB = b.created_at?.seconds || 0;
                        return tB - tA;
                    });

                    const latest = docs[0];
                    if (latest.gap_summary) {
                        setSummary(latest.gap_summary as GapSummary);
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAssessment();
    }, [companyId]);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">กำลังโหลดข้อมูล...</div>;
    }

    if (!summary) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-semibold text-slate-800">ยังไม่มีการประเมิน</h2>
                <p className="text-slate-500 mt-2 mb-6">เริ่มทำแบบประเมินเพื่อดูสถานะความสอดคล้องกฎหมายของคุณ</p>
                <Link href="/assessment">
                    <Button>เริ่มทำแบบประเมิน</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">แดชบอร์ด</h1>
                    <p className="text-slate-500 text-sm mt-1">ภาพรวมการประเมินความสอดคล้องกฎหมาย SHEQ</p>
                </div>
                <Link href="/assessment">
                    <Button variant="outline">ทำแบบประเมินใหม่</Button>
                </Link>
            </div>

            {/* AI Insight Card */}
            {summary.ai_summary && typeof summary.ai_summary === 'object' && (
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100 p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-100 hidden sm:block">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-indigo-900">
                                    AI Strategic Profile
                                </h3>
                                <Badge variant="info" size="sm">Gemini 2.5 Pro</Badge>
                                <Badge variant={
                                    summary.ai_summary.risk_profile.level === 'Critical' ? 'danger' :
                                        summary.ai_summary.risk_profile.level === 'High' ? 'warning' : 'success'
                                }>
                                    Risk: {summary.ai_summary.risk_profile.level}
                                </Badge>
                                <span className="text-xs text-indigo-400">
                                    Maturity: {summary.ai_summary.maturity_level}
                                </span>
                            </div>

                            <p className="text-indigo-800 text-sm leading-relaxed">
                                {summary.ai_summary.executive_summary}
                            </p>
                        </div>
                    </div>

                    {/* Strategic Recommendations grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-indigo-200/50 pt-4">
                        <div>
                            <h4 className="text-xs font-semibold text-red-600 uppercase mb-2">🔥 ดำเนินการทันที</h4>
                            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                {summary.ai_summary.strategic_recommendations.immediate.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-amber-600 uppercase mb-2">⚠️ ระยะสั้น</h4>
                            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                {summary.ai_summary.strategic_recommendations.short_term.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold text-blue-600 uppercase mb-2">🏁 ระยะยาว</h4>
                            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                {summary.ai_summary.strategic_recommendations.long_term.map((rec, i) => (
                                    <li key={i}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>
            )}

            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">คะแนนรวม</p>
                            <p className="text-5xl font-bold mt-1">{summary.overall_score}%</p>
                            <p className="text-blue-200 text-sm mt-2">
                                พบความเสี่ยงสูง {summary.red_count} รายการ
                            </p>
                        </div>
                        <div className="text-6xl opacity-20">⚖️</div>
                    </div>
                </Card>

                <Card>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 mb-2">
                            <span className="text-red-600 font-bold text-lg">{summary.red_count}</span>
                        </div>
                        <p className="text-sm text-slate-500">ไม่สอดคล้อง (Red)</p>
                        <Badge variant="danger" className="mt-1">ต้องแก้ไขทันที</Badge>
                    </div>
                </Card>

                <Card>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 mb-2">
                            <span className="text-amber-600 font-bold text-lg">{summary.yellow_count}</span>
                        </div>
                        <p className="text-sm text-slate-500">บางส่วน (Yellow)</p>
                        <Badge variant="warning" className="mt-1">ควรปรับปรุง</Badge>
                    </div>
                </Card>
            </div>

            {/* Prioritized Action Items */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">ประเด็นที่ต้องดำเนินการ (Top 5)</h2>
                    <Badge variant="danger">{summary.red_count + summary.yellow_count} รายการทั้งหมด</Badge>
                </div>

                <div className="space-y-3">
                    {summary.items
                        .filter(i => i.gap_level === 'red' || i.gap_level === 'yellow')
                        .slice(0, 5)
                        .map((gap, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${gap.gap_level === 'red' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 truncate">
                                        {(gap as GapItem).category || 'ข้อกำหนดกฎหมาย'}
                                    </p>
                                    <p className="text-xs text-slate-400">{(gap as GapItem).category} • Risk Score: {gap.risk_score}</p>
                                </div>
                                <Badge variant={gap.gap_level === 'red' ? 'danger' : 'warning'} size="sm">
                                    {gap.gap_level === 'red' ? 'Critical' : 'Major'}
                                </Badge>
                            </div>
                        ))}
                </div>
            </Card>
        </div>
    );
}
