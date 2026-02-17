'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { Button } from '@/components/ui/Button';

const OPTIONS = [
    { value: 'ผลิต / แปรรูปสินค้า', icon: '🏭' },
    { value: 'ซ่อมบำรุง / ประกอบ', icon: '🔧' },
    { value: 'เก็บ / ขนส่งสินค้า', icon: '🚛' },
    { value: 'ก่อสร้าง / รื้อถอน', icon: '🏗️' },
    { value: 'บริการ / สำนักงาน', icon: '💼' },
    { value: 'วิจัย / ทดสอบ', icon: '🔬' },
];

export function PageMainActivity() {
    const { profile, updateProfile, nextPage, prevPage } = useAssessmentStore();
    const selected = profile.main_activity || [];

    const toggle = (value: string) => {
        const next = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];
        updateProfile({ main_activity: next });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">กิจกรรมหลักของสถานประกอบการ</h2>
                <p className="text-slate-500 mt-1 text-sm">เลือกทุกข้อที่เกี่ยวข้อง</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => toggle(opt.value)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${selected.includes(opt.value)
                                ? 'border-blue-500 bg-blue-50 text-blue-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                        <span className="text-sm font-medium leading-snug">{opt.value}</span>
                        {selected.includes(opt.value) && <span className="ml-auto text-blue-500">✓</span>}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevPage} className="flex-1">← ย้อนกลับ</Button>
                <Button onClick={nextPage} className="flex-1" disabled={selected.length === 0}>ถัดไป →</Button>
            </div>
        </div>
    );
}
