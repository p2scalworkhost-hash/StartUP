'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { db } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { CompanyDoc } from '@/types/company';
import { AssessmentDoc } from '@/types/assessment';

export default function CompanyPage() {
    const { companyId, uid, setCompany } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<CompanyDoc>>({
        name: '',
        legal_type: 'other',
        employee_count: '<10',
        province: '',
        district: '',
        branch_count: 1,
        has_contractor: false,
    });

    useEffect(() => {
        async function loadData() {
            if (!uid) return;
            setLoading(true);

            try {
                // 1. Try to fetch existing Company Profile
                let currentProfile: Partial<CompanyDoc> | null = null;

                if (companyId) {
                    const docRef = doc(db, 'companies', companyId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        currentProfile = docSnap.data() as CompanyDoc;
                    }
                }

                // 2. If no profile or incomplete, fetch latest assessment to auto-fill
                if (!currentProfile) {
                    const q = query(
                        collection(db, 'assessments'),
                        where('company_id', '==', companyId || 'unknown'),
                        // orderBy('created_at', 'desc') // Avoid index issues, sort manually
                    );
                    const querySnap = await getDocs(q);

                    if (!querySnap.empty) {
                        const docs = querySnap.docs.map(d => d.data() as AssessmentDoc);
                        // Sort by newest
                        docs.sort((a, b) => b.created_at.seconds - a.created_at.seconds);
                        const latest = docs[0];

                        // Map Assessment -> Company
                        currentProfile = {
                            name: useAuthStore.getState().companyName || '',
                            legal_type: mapWorkplaceType(latest.profile.workplace_type),
                            employee_count: latest.profile.employee_threshold as CompanyDoc['employee_count'],
                            has_contractor: latest.profile.has_contractor,
                            branch_count: 1,
                        };
                    }
                }

                if (currentProfile) {
                    setFormData(prev => ({ ...prev, ...currentProfile }));
                }

            } catch (error) {
                console.error('Error loading company data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [companyId, uid]);

    const handleSave = async () => {
        if (!uid) return;
        setSaving(true);
        try {
            const idToUse = companyId || doc(collection(db, 'companies')).id;

            const dataToSave: Partial<CompanyDoc> & {
                company_id: string;
                owner_uid: string;
                updated_at: Timestamp;
                created_at?: Timestamp;
                member_uids?: string[];
            } = {
                ...formData,
                company_id: idToUse,
                owner_uid: uid,
                updated_at: Timestamp.now(),
            };

            if (!companyId) {
                dataToSave.created_at = Timestamp.now();
                dataToSave.member_uids = [uid];
            }

            await setDoc(doc(db, 'companies', idToUse), dataToSave, { merge: true });

            // Update local store
            setCompany({ id: idToUse, name: formData.name || '' });

            // Show feedback (using alert for now since toast might not be installed)
            alert('บันทึกข้อมูลสำเร็จ!');

        } catch (error) {
            console.error('Error saving profile:', error);
            alert('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">กำลังโหลดข้อมูลบริษัท...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">โปรไฟล์บริษัท</h1>
                <p className="text-slate-500">จัดการข้อมูลบริษัทและสาขาเพื่อการประเมินที่แม่นยำ</p>
            </div>

            <Card className="p-6 md:p-8 space-y-8">
                {/* Basic Info */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">ข้อมูลทั่วไป</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">ชื่อบริษัท / สถานประกอบการ</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="ระบุชื่อบริษัท"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">ประเภทนิติบุคคล</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={formData.legal_type}
                                onChange={e => setFormData({ ...formData, legal_type: e.target.value as CompanyDoc['legal_type'] })}
                            >
                                <option value="บริษัท">บริษัทจำกัด</option>
                                <option value="หจก.">ห้างหุ้นส่วนจำกัด (หจก.)</option>
                                <option value="โรงงาน">โรงงานอุตสาหกรรม</option>
                                <option value="other">อื่นๆ / บุคคลธรรมดา</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Operations */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">ข้อมูลการดำเนินงาน</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">จำนวนพนักงาน</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={formData.employee_count}
                                onChange={e => setFormData({ ...formData, employee_count: e.target.value as CompanyDoc['employee_count'] })}
                            >
                                <option value="<10">น้อยกว่า 10 คน</option>
                                <option value="10-49">10 - 49 คน</option>
                                <option value="50-99">50 - 99 คน</option>
                                <option value="100-199">100 - 199 คน</option>
                                <option value=">=200">200 คนขึ้นไป</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">จำนวนสาขา</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={formData.branch_count}
                                onChange={e => setFormData({ ...formData, branch_count: parseInt(e.target.value) || 1 })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                        <input
                            type="checkbox"
                            id="has_contractor"
                            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                            checked={formData.has_contractor}
                            onChange={e => setFormData({ ...formData, has_contractor: e.target.checked })}
                        />
                        <label htmlFor="has_contractor" className="text-sm text-slate-700 font-medium cursor-pointer">
                            มีการจ้างผู้รับเหมา (Outsource/Contractor) เข้ามาปฏิบัติงานในพื้นที่
                        </label>
                    </div>
                </section>

                {/* Location */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">ที่ตั้งสำนักงานใหญ่</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">จังหวัด</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={formData.province}
                                onChange={e => setFormData({ ...formData, province: e.target.value })}
                                placeholder="ระบุจังหวัด"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">เขต / อำเภอ</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={formData.district}
                                onChange={e => setFormData({ ...formData, district: e.target.value })}
                                placeholder="ระบุเขต/อำเภอ"
                            />
                        </div>
                    </div>
                </section>

                <div className="pt-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => window.history.back()}>ยกเลิก</Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

function mapWorkplaceType(type?: string): CompanyDoc['legal_type'] {
    if (!type) return 'other';
    if (type.includes('โรงงาน')) return 'โรงงาน';
    if (type.includes('บริษัท')) return 'บริษัท';
    if (type.includes('ห้างหุ้นส่วน')) return 'หจก.';
    return 'other';
}
