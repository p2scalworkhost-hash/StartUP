'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { Button } from '@/components/ui/Button';

const OPTIONS = [
    { value: 'หม้อไอน้ำ (Boiler)', icon: '♨️' },
    { value: 'เครื่องกำเนิดไฟฟ้า', icon: '⚡' },
    { value: 'ถังเก็บเชื้อเพลิง / ก๊าซ', icon: '⛽' },
    { value: 'ใช้พลังงานไฟฟ้าปริมาณสูง', icon: '🔌' },
];

export function PageEnergy() {
    const { profile, updateProfile, nextPage, prevPage } = useAssessmentStore();
    const selected = profile.energy_use || [];

    const toggle = (value: string) => {
        const next = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];
        updateProfile({ energy_use: next });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">ด้านพลังงาน</h2>
                <p className="text-slate-500 mt-1 text-sm">เลือกอุปกรณ์/ระบบพลังงานที่มีในสถานที่</p>
            </div>

            <div className="space-y-3">
                {OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => toggle(opt.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${selected.includes(opt.value)
                                ? 'border-amber-500 bg-amber-50 text-amber-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.value}</span>
                        {selected.includes(opt.value) && <span className="ml-auto text-amber-500">✓</span>}
                    </button>
                ))}
            </div>

            <button
                onClick={() => updateProfile({ energy_use: [] })}
                className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${selected.length === 0
                        ? 'border-slate-400 bg-slate-100 text-slate-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
            >
                ไม่มีอุปกรณ์ด้านพลังงานพิเศษ
            </button>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevPage} className="flex-1">← ย้อนกลับ</Button>
                <Button onClick={nextPage} className="flex-1">ถัดไป →</Button>
            </div>
        </div>
    );
}
