'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { Button } from '@/components/ui/Button';

const OPTIONS = [
    { value: 'มีน้ำเสียจากกระบวนการผลิต/บริการ', icon: '💧' },
    { value: 'มีของเสียอันตราย', icon: '☢️' },
    { value: 'มีฝุ่น ควัน กลิ่น หรือปล่อง', icon: '🏭' },
    { value: 'มีเสียงดัง/แรงสั่นสะเทือน', icon: '🔊' },
];

export function PageEnvironment() {
    const { profile, updateProfile, nextPage, prevPage } = useAssessmentStore();
    const selected = profile.environment_aspect || [];

    const toggle = (value: string) => {
        const next = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];
        updateProfile({ environment_aspect: next });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">ด้านสิ่งแวดล้อม</h2>
                <p className="text-slate-500 mt-1 text-sm">เลือกปัจจัยด้านสิ่งแวดล้อมที่เกี่ยวข้อง</p>
            </div>

            <div className="space-y-3">
                {OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => toggle(opt.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${selected.includes(opt.value)
                                ? 'border-green-500 bg-green-50 text-green-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.value}</span>
                        {selected.includes(opt.value) && <span className="ml-auto text-green-500">✓</span>}
                    </button>
                ))}
            </div>

            <button
                onClick={() => updateProfile({ environment_aspect: [] })}
                className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${selected.length === 0
                        ? 'border-slate-400 bg-slate-100 text-slate-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
            >
                ไม่มีปัจจัยด้านสิ่งแวดล้อม
            </button>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevPage} className="flex-1">← ย้อนกลับ</Button>
                <Button onClick={nextPage} className="flex-1">ถัดไป →</Button>
            </div>
        </div>
    );
}
