'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { Button } from '@/components/ui/Button';

const OPTIONS = [
    { value: 'ไม่มีเครื่องจักร', label: 'ไม่มีเครื่องจักร', icon: '📝' },
    { value: 'เครื่องจักรไม่เกิน 20 แรงม้า', label: 'ไม่เกิน 20 แรงม้า', icon: '⚙️' },
    { value: 'เครื่องจักร 20-75 แรงม้า', label: '20 – 75 แรงม้า', icon: '🔩' },
    { value: 'เครื่องจักรเกิน 75 แรงม้า', label: 'เกิน 75 แรงม้า', icon: '🏭' },
];

export function PageMachinery() {
    const { profile, updateProfile, nextPage, prevPage } = useAssessmentStore();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">ระดับเครื่องจักรที่ใช้</h2>
                <p className="text-slate-500 mt-1 text-sm">เลือกระดับกำลังเครื่องจักรรวมสูงสุด</p>
            </div>

            <div className="space-y-3">
                {OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => updateProfile({ machine_level: opt.value })}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${profile.machine_level === opt.value
                                ? 'border-blue-500 bg-blue-50 text-blue-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.label}</span>
                        {profile.machine_level === opt.value && <span className="ml-auto text-blue-500">✓</span>}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevPage} className="flex-1">← ย้อนกลับ</Button>
                <Button onClick={nextPage} className="flex-1" disabled={!profile.machine_level}>ถัดไป →</Button>
            </div>
        </div>
    );
}
