'use client';

import { Card } from '@/components/ui/Card';

export default function CompanyPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">โปรไฟล์บริษัท</h1>
                <p className="text-slate-500">จัดการข้อมูลบริษัทและสาขา</p>
            </div>

            <Card className="p-12 text-center text-slate-400 border-dashed">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-lg font-medium text-slate-600">กำลังพัฒนา (Coming Soon)</h3>
                <p>หน้าจัดการโปรไฟล์บริษัทจะเปิดใช้งานในเวอร์ชันถัดไป</p>
            </Card>
        </div>
    );
}
