'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { Button } from '@/components/ui/Button';

const OPTIONS = [
    { value: '<10', label: 'น้อยกว่า 10 คน', desc: 'ธุรกิจขนาดเล็ก' },
    { value: '10-49', label: '10 – 49 คน', desc: 'ธุรกิจขนาดเล็ก-กลาง' },
    { value: '50-99', label: '50 – 99 คน', desc: 'ต้องมี จป. ตามกฎหมาย' },
    { value: '100-199', label: '100 – 199 คน', desc: 'ต้องมี คปอ. ตามกฎหมาย' },
    { value: '>=200', label: '200 คนขึ้นไป', desc: 'ข้อกำหนดเพิ่มเติมด้านความปลอดภัย' },
];

export function PageEmployeeCount() {
    const { profile, updateProfile, nextPage, prevPage } = useAssessmentStore();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">จำนวนพนักงาน</h2>
                <p className="text-slate-500 mt-1 text-sm">เลือกช่วงจำนวนพนักงานทั้งหมดในองค์กร</p>
            </div>

            <div className="space-y-3">
                {OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => updateProfile({ employee_threshold: opt.value })}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-150 ${profile.employee_threshold === opt.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <div>
                            <div className={`text-sm font-medium ${profile.employee_threshold === opt.value ? 'text-blue-900' : 'text-slate-700'}`}>
                                {opt.label}
                            </div>
                            <div className={`text-xs mt-0.5 ${profile.employee_threshold === opt.value ? 'text-blue-600' : 'text-slate-400'}`}>
                                {opt.desc}
                            </div>
                        </div>
                        {profile.employee_threshold === opt.value && (
                            <span className="text-blue-500">✓</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevPage} className="flex-1">← ย้อนกลับ</Button>
                <Button onClick={nextPage} className="flex-1" disabled={!profile.employee_threshold}>ถัดไป →</Button>
            </div>
        </div>
    );
}
