import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, model } = body;

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        const response = await chatCompletion(messages, model); // Default model handled in lib

        return NextResponse.json({ result: response });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
