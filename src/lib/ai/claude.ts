import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function explainLaw(
    lawTitle: string,
    lawContent: string,
    companyContext: string
): Promise<string> {
    const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: `คุณเป็นผู้เชี่ยวชาญกฎหมาย SHEQ ของประเทศไทย ตอบเป็นภาษาไทย กระชับ เข้าใจง่าย เหมาะสำหรับผู้ประกอบการที่ไม่ใช่นักกฎหมาย`,
        messages: [
            {
                role: 'user',
                content: `อธิบายกฎหมาย "${lawTitle}" ให้เข้าใจง่าย สำหรับบริษัทประเภท: ${companyContext}\n\nเนื้อหา: ${lawContent}\n\nอธิบายใน 3 หัวข้อ:\n1. สรุปง่ายๆ (2-3 บรรทัด)\n2. ใครต้องปฏิบัติ\n3. ต้องทำอะไร (bullet points)`,
            },
        ],
    });

    const block = message.content[0];
    return block.type === 'text' ? block.text : '';
}

export async function generateAIRecommendation(
    gapItems: Array<{
        obligation_id: string;
        category: string;
        gap_level: string;
        checklist_question: string;
    }>,
    companyProfile: {
        workplace_type: string;
        employee_count: string;
        activities: string[];
    }
): Promise<string> {
    const gapSummary = gapItems
        .filter(i => i.gap_level !== 'green')
        .map(i => `- [${i.gap_level.toUpperCase()}] ${i.checklist_question} (${i.category})`)
        .join('\n');

    const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3000,
        system: `คุณเป็นที่ปรึกษาด้าน SHEQ ผู้เชี่ยวชาญ ให้คำแนะนำที่ปฏิบัติได้จริง เป็นภาษาไทย`,
        messages: [
            {
                role: 'user',
                content: `บริษัทประเภท: ${companyProfile.workplace_type}, พนักงาน: ${companyProfile.employee_count}, กิจกรรม: ${companyProfile.activities.join(', ')}\n\nGap Analysis พบประเด็นดังนี้:\n${gapSummary}\n\nกรุณาให้:\n1. สรุปภาพรวมความเสี่ยง\n2. แผนการดำเนินการเรียงลำดับความสำคัญ\n3. ระยะเวลาที่แนะนำ\n4. ทรัพยากรที่จำเป็น`,
            },
        ],
    });

    const block = message.content[0];
    return block.type === 'text' ? block.text : '';
}

export async function chatWithContext(
    userMessage: string,
    context: string
): Promise<string> {
    const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        system: `คุณเป็นผู้ช่วย AI ด้าน SHEQ ตอบเป็นภาษาไทย กระชับ ชัดเจน ใช้ข้อมูลจากบริบทที่ให้\n\nบริบท:\n${context}`,
        messages: [
            { role: 'user', content: userMessage },
        ],
    });

    const block = message.content[0];
    return block.type === 'text' ? block.text : '';
}
