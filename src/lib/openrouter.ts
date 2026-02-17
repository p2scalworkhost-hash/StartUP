const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:3000';
const OPENROUTER_SITE_NAME = process.env.OPENROUTER_SITE_NAME || 'SHEQ Platform';

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string | ContentPart[];
}

export interface ContentPart {
    type: 'text' | 'image_url' | 'video_url' | 'input_audio';
    text?: string;
    image_url?: { url: string };
    video_url?: { url: string };
    input_audio?: { data: string; format: string };
}

export async function chatCompletion(
    messages: ChatMessage[],
    model: string = 'google/gemini-2.5-pro'
): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        console.warn('OPENROUTER_API_KEY is not set');
        return 'AI Service Unavailable: Missing API Key';
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": OPENROUTER_SITE_URL,
                "X-Title": OPENROUTER_SITE_NAME,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model,
                messages
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('AI Completion Error:', error);
        return 'Error generating AI response. Please try again later.';
    }
}
