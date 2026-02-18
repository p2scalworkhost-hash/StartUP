import { NextRequest, NextResponse } from 'next/server';
import { explainLaw } from '@/lib/ai/claude';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    const { law_title, law_content, company_context } = await req.json();

    try {
        const explanation = await explainLaw(law_title, law_content, company_context);
        return NextResponse.json({ explanation });
    } catch (error) {
        console.error('Explanation API Error:', error);
        return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
    }
}
