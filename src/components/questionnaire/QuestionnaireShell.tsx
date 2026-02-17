'use client';

import { useAssessmentStore } from '@/stores/assessmentStore';
import { PageWelcome } from './PageWelcome';
import { PageWorkplaceType } from './PageWorkplaceType';
import { PageEmployeeCount } from './PageEmployeeCount';
import { PageContractor } from './PageContractor';
import { PageMainActivity } from './PageMainActivity';
import { PageMachinery } from './PageMachinery';
import { PageRiskProcess } from './PageRiskProcess';
import { PageEnvironment } from './PageEnvironment';
import { PageEnergy } from './PageEnergy';
import { PagePublicHealth } from './PagePublicHealth';
import { PageSummary } from './PageSummary';
import { PageProcessing } from './PageProcessing';
import { Progress } from '@/components/ui/Progress';

const PAGES = [
    PageWelcome,
    PageWorkplaceType,
    PageEmployeeCount,
    PageContractor,
    PageMainActivity,
    PageMachinery,
    PageRiskProcess,
    PageEnvironment,
    PageEnergy,
    PagePublicHealth,
    PageSummary,
    PageProcessing,
];

const PAGE_LABELS = [
    '',
    'ประเภทสถานที่',
    'จำนวนพนักงาน',
    'ผู้รับเหมา',
    'กิจกรรมหลัก',
    'เครื่องจักร',
    'งานเสี่ยง',
    'สิ่งแวดล้อม',
    'พลังงาน',
    'สาธารณสุข',
    'ยืนยันข้อมูล',
    'กำลังวิเคราะห์',
];

export function QuestionnaireShell() {
    const { currentPage } = useAssessmentStore();
    const CurrentPage = PAGES[currentPage];

    const isWelcome = currentPage === 0;
    const isProcessing = currentPage === PAGES.length - 1;
    const progress = ((currentPage) / (PAGES.length - 2)) * 100;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            {!isWelcome && !isProcessing && (
                <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-500 font-medium">
                                {PAGE_LABELS[currentPage]}
                            </span>
                            <span className="text-sm text-slate-400">
                                {currentPage} / {PAGES.length - 2}
                            </span>
                        </div>
                        <Progress value={progress} />
                    </div>
                </div>
            )}

            {/* Page content */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                <CurrentPage />
            </div>
        </div>
    );
}
