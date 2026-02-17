/**
 * Legal Mapper Engine
 * Maps user questionnaire answers to activity_tags
 * and determines which laws apply
 *
 * Design principle: Rule-based, transparent, auditable
 * AI is NOT used here
 */

export interface AssessmentProfile {
    workplace_type: string;
    employee_threshold: string;
    has_contractor: boolean;
    main_activity: string[];
    machine_level: string;
    risk_process: string[];
    environment_aspect: string[];
    energy_use: string[];
    public_health_aspect: string[];
}

// Tag mapping rules
const TAG_RULES: Array<{
    condition: (p: AssessmentProfile) => boolean;
    tags: string[];
}> = [
        // Workplace type tags
        { condition: p => p.workplace_type === 'โรงงาน / สถานที่ผลิต', tags: ['factory', 'manufacturing'] },
        { condition: p => p.workplace_type === 'สำนักงาน / ออฟฟิศ', tags: ['office'] },
        { condition: p => p.workplace_type === 'หน้างานก่อสร้าง', tags: ['construction'] },
        { condition: p => p.workplace_type === 'คลังสินค้า / ศูนย์กระจายสินค้า', tags: ['warehouse', 'logistics'] },
        { condition: p => p.workplace_type === 'ห้องปฏิบัติการ', tags: ['laboratory'] },

        // Employee count
        { condition: p => ['50-99', '100-199', '>=200'].includes(p.employee_threshold), tags: ['employee_50plus'] },
        { condition: p => ['100-199', '>=200'].includes(p.employee_threshold), tags: ['employee_100plus'] },
        { condition: p => p.employee_threshold === '>=200', tags: ['employee_200plus'] },

        // Contractor
        { condition: p => p.has_contractor, tags: ['has_contractor'] },

        // Main activities
        { condition: p => p.main_activity.includes('ผลิต / แปรรูปสินค้า'), tags: ['production'] },
        { condition: p => p.main_activity.includes('ซ่อมบำรุง / ประกอบ'), tags: ['maintenance'] },
        { condition: p => p.main_activity.includes('เก็บ / ขนส่งสินค้า'), tags: ['storage', 'transport'] },
        { condition: p => p.main_activity.includes('ก่อสร้าง / รื้อถอน'), tags: ['construction'] },

        // Machinery
        { condition: p => p.machine_level === 'เครื่องจักรเกิน 75 แรงม้า', tags: ['factory_act', 'heavy_machinery'] },
        { condition: p => p.machine_level !== 'ไม่มีเครื่องจักร', tags: ['has_machinery'] },

        // Risk processes
        { condition: p => p.risk_process.includes('เหมืองแร่'), tags: ['mining'] },
        { condition: p => p.risk_process.includes('งานเชื่อม / ตัด / เจียร'), tags: ['hot_work'] },
        { condition: p => p.risk_process.includes('งานในที่อับอากาศ'), tags: ['confined_space'] },
        { condition: p => p.risk_process.includes('งานบนที่สูง'), tags: ['work_at_height'] },
        { condition: p => p.risk_process.includes('ผลิต ใช้หรือจัดเก็บสารเคมี'), tags: ['chemical', 'hazmat'] },
        { condition: p => p.risk_process.includes('หม้อไอน้ำ / ภาชนะรับแรงดัน'), tags: ['pressure_vessel', 'boiler'] },
        { condition: p => p.risk_process.includes('งานที่เกี่ยวข้องกับไฟฟ้าแรงสูง'), tags: ['high_voltage'] },
        { condition: p => p.risk_process.includes('งานยก เคลื่อนย้าย วัตถุหนัก'), tags: ['manual_handling', 'lifting'] },

        // Environment
        { condition: p => p.environment_aspect.includes('มีน้ำเสียจากกระบวนการผลิต/บริการ'), tags: ['wastewater'] },
        { condition: p => p.environment_aspect.includes('มีของเสียอันตราย'), tags: ['hazardous_waste'] },
        { condition: p => p.environment_aspect.includes('มีฝุ่น ควัน กลิ่น หรือปล่อง'), tags: ['air_emission'] },
        { condition: p => p.environment_aspect.includes('มีเสียงดัง/แรงสั่นสะเทือน'), tags: ['noise_vibration'] },

        // Energy
        { condition: p => p.energy_use.includes('หม้อไอน้ำ (Boiler)'), tags: ['boiler'] },
        { condition: p => p.energy_use.includes('เครื่องกำเนิดไฟฟ้า'), tags: ['generator'] },
        { condition: p => p.energy_use.includes('ถังเก็บเชื้อเพลิง / ก๊าซ'), tags: ['fuel_storage'] },
        { condition: p => p.energy_use.includes('ใช้พลังงานไฟฟ้าปริมาณสูง'), tags: ['high_energy_user'] },

        // Public health
        { condition: p => p.public_health_aspect.includes('มีโรงอาหาร / ครัว / การปรุงอาหาร'), tags: ['food_handling'] },
        { condition: p => p.public_health_aspect.includes('มีหอพักหรือที่พักพนักงาน'), tags: ['worker_accommodation'] },
        { condition: p => p.public_health_aspect.includes('มีการสัมผัสปัจจัยเสี่ยงต่อสุขภาพ'), tags: ['health_hazard'] },
    ];

export function mapTagsFromProfile(profile: AssessmentProfile): string[] {
    const tags = new Set<string>();

    for (const rule of TAG_RULES) {
        if (rule.condition(profile)) {
            rule.tags.forEach(t => tags.add(t));
        }
    }

    return Array.from(tags);
}

// Law-to-tag mapping (seed data for admin to configure)
export const LAW_TAG_MAPPING: Record<string, string[]> = {
    'พ.ร.บ. ความปลอดภัยฯ 2554': ['employee_50plus', 'factory', 'construction', 'manufacturing'],
    'พ.ร.บ. โรงงาน 2535': ['factory_act', 'heavy_machinery', 'manufacturing'],
    'พ.ร.บ. สิ่งแวดล้อม 2535': ['wastewater', 'hazardous_waste', 'air_emission'],
    'พ.ร.บ. วัตถุอันตราย 2535': ['chemical', 'hazmat'],
    'พ.ร.บ. พลังงาน 2535': ['high_energy_user'],
    'กฎกระทรวง ที่อับอากาศ': ['confined_space'],
    'กฎกระทรวง งานบนที่สูง': ['work_at_height'],
    'กฎกระทรวง หม้อไอน้ำ': ['boiler', 'pressure_vessel'],
    'พ.ร.บ. สาธารณสุข 2535': ['food_handling', 'worker_accommodation'],
};

// Find applicable laws by querying Firestore with tags
export async function findApplicableLaws(
    tags: string[],
    queryFn: (tags: string[]) => Promise<any[]>
): Promise<any[]> {
    return queryFn(tags);
}
