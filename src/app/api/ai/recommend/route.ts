import { NextRequest, NextResponse } from 'next/server';
import { generateAIRecommendation } from '@/lib/ai/claude';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    const { gap_items, company_profile } = await req.json();

    try {
        const recommendation = await generateAIRecommendation(gap_items, company_profile);
        return NextResponse.json({ recommendation });
    } catch (error) {
        console.error('Recommendation API Error:', error);
        return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
    }
}
