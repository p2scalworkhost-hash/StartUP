'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function PageSummary() {
    const { profile, prevPage, nextPage } = useAssessmentStore();

    const summaryItems = [
        { label: 'ประเภทสถานที่', value: profile.workplace_type || '-' },
        { label: 'จำนวนพนักงาน', value: profile.employee_threshold || '-' },
        { label: 'ผู้รับเหมา', value: profile.has_contractor ? 'มี' : 'ไม่มี' },
        { label: 'กิจกรรมหลัก', value: profile.main_activity?.join(', ') || '-' },
        { label: 'เครื่องจักร', value: profile.machine_level || '-' },
        { label: 'งานเสี่ยง', value: profile.risk_process?.join(', ') || 'ไม่มี' },
        { label: 'สิ่งแวดล้อม', value: profile.environment_aspect?.join(', ') || 'ไม่มี' },
        { label: 'พลังงาน', value: profile.energy_use?.join(', ') || 'ไม่มี' },
        { label: 'สาธารณสุข', value: profile.public_health_aspect?.join(', ') || 'ไม่มี' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">ยืนยันข้อมูลของคุณ</h2>
                <p className="text-slate-500 mt-1 text-sm">ตรวจสอบข้อมูลก่อนส่งเพื่อวิเคราะห์</p>
            </div>

            <Card variant="bordered" padding="none">
                <div className="divide-y divide-slate-100">
                    {summaryItems.map((item, i) => (
                        <div key={i} className="px-4 py-3 flex items-start gap-4">
                            <span className="text-sm text-slate-500 font-medium min-w-[120px] flex-shrink-0">
                                {item.label}
                            </span>
                            <span className="text-sm text-slate-800">{item.value}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevPage} className="flex-1">← แก้ไข</Button>
                <Button onClick={nextPage} className="flex-1">ยืนยันและวิเคราะห์ →</Button>
            </div>
        </div>
    );
}
