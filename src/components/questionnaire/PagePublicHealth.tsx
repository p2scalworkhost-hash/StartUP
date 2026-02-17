'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { Button } from '@/components/ui/Button';

const OPTIONS = [
    { value: 'มีโรงอาหาร / ครัว / การปรุงอาหาร', icon: '🍳' },
    { value: 'มีหอพักหรือที่พักพนักงาน', icon: '🏠' },
    { value: 'มีการสัมผัสปัจจัยเสี่ยงต่อสุขภาพ', icon: '🏥' },
];

export function PagePublicHealth() {
    const { profile, updateProfile, nextPage, prevPage } = useAssessmentStore();
    const selected = profile.public_health_aspect || [];

    const toggle = (value: string) => {
        const next = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];
        updateProfile({ public_health_aspect: next });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">ด้านสาธารณสุข</h2>
                <p className="text-slate-500 mt-1 text-sm">เลือกปัจจัยด้านสาธารณสุขที่เกี่ยวข้อง</p>
            </div>

            <div className="space-y-3">
                {OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => toggle(opt.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${selected.includes(opt.value)
                                ? 'border-rose-500 bg-rose-50 text-rose-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.value}</span>
                        {selected.includes(opt.value) && <span className="ml-auto text-rose-500">✓</span>}
                    </button>
                ))}
            </div>

            <button
                onClick={() => updateProfile({ public_health_aspect: [] })}
                className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${selected.length === 0
                        ? 'border-slate-400 bg-slate-100 text-slate-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
            >
                ไม่มีปัจจัยด้านสาธารณสุข
            </button>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevPage} className="flex-1">← ย้อนกลับ</Button>
                <Button onClick={nextPage} className="flex-1">ถัดไป →</Button>
            </div>
        </div>
    );
}
