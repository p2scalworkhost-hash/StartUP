'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';

const RISK_OPTIONS = [
    { value: 'เหมืองแร่', label: 'เหมืองแร่', icon: '⛏️' },
    { value: 'งานเชื่อม / ตัด / เจียร', label: 'งานเชื่อม / ตัด / เจียร', icon: '🔥' },
    { value: 'งานในที่อับอากาศ', label: 'งานในที่อับอากาศ', icon: '🕳️' },
    { value: 'งานบนที่สูง', label: 'งานบนที่สูง', icon: '🏗️' },
    { value: 'ผลิต ใช้หรือจัดเก็บสารเคมี', label: 'ผลิต / ใช้ / เก็บสารเคมี', icon: '⚗️' },
    { value: 'หม้อไอน้ำ / ภาชนะรับแรงดัน', label: 'หม้อไอน้ำ / ถังรับแรงดัน', icon: '🫙' },
    { value: 'งานที่เกี่ยวข้องกับไฟฟ้าแรงสูง', label: 'ไฟฟ้าแรงสูง', icon: '⚡' },
    { value: 'งานยก เคลื่อนย้าย วัตถุหนัก', label: 'ยก / เคลื่อนย้ายของหนัก', icon: '🏋️' },
];

export function PageRiskProcess() {
    const { profile, updateProfile, nextPage, prevPage } = useAssessmentStore();
    const selected = profile.risk_process || [];

    const toggle = (value: string) => {
        const next = selected.includes(value)
            ? selected.filter(v => v !== value)
            : [...selected, value];
        updateProfile({ risk_process: next });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">งานหรือกระบวนการที่มีความเสี่ยง</h2>
                <p className="text-slate-500 mt-1 text-sm flex items-center gap-1">
                    เลือกทุกข้อที่เกี่ยวข้อง
                    <Tooltip content="ใช้เพื่อประเมินกฎหมายความปลอดภัยที่เฉพาะเจาะจง เช่น งานในที่อับอากาศ และงานบนที่สูง มีกฎกระทรวงเฉพาะ">
                        <span className="w-4 h-4 text-slate-400 cursor-help">ℹ️</span>
                    </Tooltip>
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {RISK_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => toggle(opt.value)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 select-none ${selected.includes(opt.value)
                                ? 'border-blue-500 bg-blue-50 text-blue-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                        <span className="text-sm font-medium leading-snug">{opt.label}</span>
                        {selected.includes(opt.value) && <span className="ml-auto text-blue-500">✓</span>}
                    </button>
                ))}
            </div>

            <button
                onClick={() => updateProfile({ risk_process: [] })}
                className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${selected.length === 0
                        ? 'border-slate-400 bg-slate-100 text-slate-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
            >
                ไม่มีงานลักษณะข้างต้น
            </button>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevPage} className="flex-1">← ย้อนกลับ</Button>
                <Button onClick={nextPage} className="flex-1">ถัดไป →</Button>
            </div>
        </div>
    );
}
