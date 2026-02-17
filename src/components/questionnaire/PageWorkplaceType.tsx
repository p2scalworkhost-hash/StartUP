'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { Button } from '@/components/ui/Button';

const OPTIONS = [
    { value: 'โรงงาน / สถานที่ผลิต', label: 'โรงงาน / สถานที่ผลิต', icon: '🏭' },
    { value: 'สำนักงาน / ออฟฟิศ', label: 'สำนักงาน / ออฟฟิศ', icon: '🏢' },
    { value: 'หน้างานก่อสร้าง', label: 'หน้างานก่อสร้าง', icon: '🏗️' },
    { value: 'คลังสินค้า / ศูนย์กระจายสินค้า', label: 'คลังสินค้า / ศูนย์กระจายสินค้า', icon: '📦' },
    { value: 'ห้องปฏิบัติการ', label: 'ห้องปฏิบัติการ', icon: '🔬' },
];

export function PageWorkplaceType() {
    const { profile, updateProfile, nextPage, prevPage } = useAssessmentStore();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">ประเภทสถานที่ทำงาน</h2>
                <p className="text-slate-500 mt-1 text-sm">เลือกประเภทสถานที่ทำงานหลักของบริษัท</p>
            </div>

            <div className="space-y-3">
                {OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => updateProfile({ workplace_type: opt.value })}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${profile.workplace_type === opt.value
                                ? 'border-blue-500 bg-blue-50 text-blue-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.label}</span>
                        {profile.workplace_type === opt.value && (
                            <span className="ml-auto text-blue-500">✓</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevPage} className="flex-1">← ย้อนกลับ</Button>
                <Button onClick={nextPage} className="flex-1" disabled={!profile.workplace_type}>ถัดไป →</Button>
            </div>
        </div>
    );
}
