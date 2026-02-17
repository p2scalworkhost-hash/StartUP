/**
 * Recommendation Engine
 * Template-based recommendations for Basic package
 * AI-based recommendations for Advanced package
 */

type Category = 'safety' | 'environment' | 'labor' | 'quality' | 'energy' | 'public_health';
type GapLevel = 'red' | 'yellow' | 'green';

interface ObligationWithGap {
    obligation_id: string;
    category: Category;
    checklist_question: string;
    required_evidence: string[];
    risk_level: string;
}

// Basic package: template-based recommendations
const RECOMMENDATION_TEMPLATES: Record<string, Record<GapLevel, string>> = {
    safety: {
        red: 'ต้องดำเนินการทันที: จัดทำแผนความปลอดภัยและดำเนินการตามกฎหมาย ติดต่อเจ้าหน้าที่ความปลอดภัย (จป.) เพื่อประเมินความเสี่ยงและออกมาตรการป้องกัน',
        yellow: 'ควรปรับปรุง: ทบทวนและปรับปรุงขั้นตอนการทำงานให้สมบูรณ์ จัดทำเอกสารหลักฐานให้ครบถ้วน',
        green: 'ดำเนินการถูกต้องแล้ว: รักษามาตรฐานและทบทวนเป็นประจำทุกปี',
    },
    environment: {
        red: 'ต้องดำเนินการทันที: ติดต่อหน่วยงานสิ่งแวดล้อม ขอใบอนุญาตที่จำเป็น และดำเนินการบำบัดของเสียตามมาตรฐาน',
        yellow: 'ควรปรับปรุง: ทบทวนระบบบำบัดและการจัดการของเสีย จัดทำรายงานให้ครบถ้วน',
        green: 'ดำเนินการถูกต้องแล้ว: ติดตามการเปลี่ยนแปลงกฎหมายสิ่งแวดล้อมอย่างสม่ำเสมอ',
    },
    labor: {
        red: 'ต้องดำเนินการทันที: ปรับปรุงสัญญาจ้าง สวัสดิการ และขั้นตอนตาม พ.ร.บ. คุ้มครองแรงงาน',
        yellow: 'ควรปรับปรุง: ทบทวนนโยบายและขั้นตอนด้านแรงงาน จัดทำบันทึกให้สมบูรณ์',
        green: 'ดำเนินการถูกต้องแล้ว: ติดตามการปรับปรุงกฎหมายแรงงาน',
    },
    energy: {
        red: 'ต้องดำเนินการทันที: ตรวจสอบและขอใบอนุญาตจากกรมโรงงาน/กรมพลังงาน',
        yellow: 'ควรปรับปรุง: จัดทำแผนการใช้พลังงานและบำรุงรักษาอุปกรณ์',
        green: 'ดำเนินการถูกต้องแล้ว: ทบทวนประสิทธิภาพพลังงานประจำปี',
    },
    quality: {
        red: 'ต้องดำเนินการทันที: จัดทำระบบควบคุณภาพตามมาตรฐานที่กำหนด',
        yellow: 'ควรปรับปรุง: ทบทวนกระบวนการควบคุณภาพและปรับปรุงเอกสาร',
        green: 'ดำเนินการถูกต้องแล้ว: ดำเนินการ continuous improvement ต่อไป',
    },
    public_health: {
        red: 'ต้องดำเนินการทันที: ติดต่อสำนักงานสาธารณสุข ขอใบอนุญาตที่จำเป็น',
        yellow: 'ควรปรับปรุง: ปรับปรุงสุขลักษณะสถานที่และจัดทำมาตรการสุขาภิบาล',
        green: 'ดำเนินการถูกต้องแล้ว: รักษาความสะอาดและตรวจสอบสุขลักษณะอย่างสม่ำเสมอ',
    },
};

export function getTemplateRecommendation(
    obligation: ObligationWithGap,
    gapLevel: GapLevel
): string {
    const categoryTemplate = RECOMMENDATION_TEMPLATES[obligation.category];
    if (!categoryTemplate) return 'กรุณาปรึกษาผู้เชี่ยวชาญ';

    const baseRec = categoryTemplate[gapLevel];

    if (gapLevel === 'green') return baseRec;

    // Add evidence hints
    if (obligation.required_evidence?.length > 0) {
        const evidenceList = obligation.required_evidence.join(', ');
        return `${baseRec}\n\nหลักฐานที่ต้องจัดเตรียม: ${evidenceList}`;
    }

    return baseRec;
}
