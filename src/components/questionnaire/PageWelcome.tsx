'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';

export function PageWelcome() {
    const { nextPage, companyName, setCompanyName } = useAssessmentStore();
    const { companyName: authCompanyName } = useAuthStore();

    useEffect(() => {
        if (authCompanyName && !companyName) {
            setCompanyName(authCompanyName);
        }
    }, [authCompanyName, companyName, setCompanyName]);

    return (
        <div className="text-center py-12 space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25">
                <span className="text-4xl">⚖️</span>
            </div>

            <div className="space-y-3">
                <h1 className="text-3xl font-bold text-slate-800">
                    ประเมินความสอดคล้องกฎหมาย
                </h1>
                <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
                    ตอบคำถามเพียง 10 ข้อ เพื่อให้ระบบวิเคราะห์กฎหมาย SHEQ ที่เกี่ยวข้องกับองค์กรของคุณ
                </p>
            </div>

            {/* Company Name Input */}
            <div className="max-w-xs mx-auto">
                <label className="block text-sm font-medium text-slate-700 mb-1 text-left">
                    ชื่อบริษัท / องค์กร <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
                    placeholder="ระบุชื่อบริษัทของคุณ"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={!!authCompanyName} // Disable if auto-filled from auth
                />
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                <div className="p-3 rounded-xl bg-blue-50 text-center">
                    <div className="text-2xl mb-1">🦺</div>
                    <div className="text-xs text-blue-700 font-medium">Safety</div>
                </div>
                <div className="p-3 rounded-xl bg-green-50 text-center">
                    <div className="text-2xl mb-1">🌿</div>
                    <div className="text-xs text-green-700 font-medium">Environment</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 text-center">
                    <div className="text-2xl mb-1">✅</div>
                    <div className="text-xs text-amber-700 font-medium">Quality</div>
                </div>
            </div>

            <div className="space-y-3">
                <Button
                    onClick={nextPage}
                    size="lg"
                    className="px-12"
                    disabled={!companyName.trim()}
                >
                    เริ่มประเมิน →
                </Button>
                <p className="text-xs text-slate-400">
                    ใช้เวลาประมาณ 3-5 นาที • ข้อมูลจะถูกบันทึกอัตโนมัติ
                </p>
            </div>
        </div>
    );
}
