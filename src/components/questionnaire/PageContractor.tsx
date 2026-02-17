'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { Button } from '@/components/ui/Button';

export function PageContractor() {
    const { profile, updateProfile, nextPage, prevPage } = useAssessmentStore();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">การใช้ผู้รับเหมา</h2>
                <p className="text-slate-500 mt-1 text-sm">บริษัทมีการจ้างผู้รับเหมา (Contractor) เข้ามาทำงานในสถานที่หรือไม่?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => updateProfile({ has_contractor: true })}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-150 ${profile.has_contractor === true
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                >
                    <div className="text-3xl mb-2">👷</div>
                    <div className={`text-sm font-medium ${profile.has_contractor ? 'text-blue-900' : 'text-slate-700'}`}>
                        มีผู้รับเหมา
                    </div>
                    <div className={`text-xs mt-1 ${profile.has_contractor ? 'text-blue-600' : 'text-slate-400'}`}>
                        จ้างผู้รับเหมาเข้ามาทำงาน
                    </div>
                </button>

                <button
                    onClick={() => updateProfile({ has_contractor: false })}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-150 ${profile.has_contractor === false
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                >
                    <div className="text-3xl mb-2">🏠</div>
                    <div className={`text-sm font-medium ${profile.has_contractor === false ? 'text-blue-900' : 'text-slate-700'}`}>
                        ไม่มีผู้รับเหมา
                    </div>
                    <div className={`text-xs mt-1 ${profile.has_contractor === false ? 'text-blue-600' : 'text-slate-400'}`}>
                        ใช้พนักงานของบริษัทเอง
                    </div>
                </button>
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevPage} className="flex-1">← ย้อนกลับ</Button>
                <Button onClick={nextPage} className="flex-1">ถัดไป →</Button>
            </div>
        </div>
    );
}
