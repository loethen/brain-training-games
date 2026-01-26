import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCloudflareContext } from '@opennextjs/cloudflare';
// Use dynamic import for the new SDK to avoid build-time issues if possible, 
// but we are in an API route so standard import is fine.
// Using the new SDK syntax:
import { GoogleGenAI } from '@google/genai';

// Check if user is authenticated
async function isAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');
        return !!session?.value;
    } catch {
        return false;
    }
}

export async function POST(request: NextRequest) {
    if (!(await isAuthenticated())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { env } = await getCloudflareContext();
        const apiKey = (env as unknown as Record<string, string>)?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
        }

        const body = await request.json() as {
            title: string;
            excerpt: string;
            content: string;
            keywords: string;
            author_name: string;
            targetLocale: string;
        };

        const { title, excerpt, content, keywords, author_name, targetLocale } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // New SDK Usage
        const client = new GoogleGenAI({ apiKey });

        const prompt = `
      You are a professional translator. Translate the following blog post content into ${targetLocale === 'zh' ? 'Chinese (Simplified)' : 'English'}.
      
      Maintain the original Markdown formatting exactly. Do not translate code blocks or URLs.
      
      Input Data:
      Title: ${title}
      Excerpt: ${excerpt}
      Keywords: ${keywords}
      Author: ${author_name}
      Content: 
      ${content}
      
      Respond ONLY with a valid JSON object in the following format (no markdown code fences):
      {
        "title": "Translated Title",
        "excerpt": "Translated Excerpt",
        "keywords": "Translated, Keywords",
        "author_name": "Translated Author Name",
        "content": "Translated Content in Markdown"
      }
    `;

        // New SDK method signature
        const response = await client.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        });

        const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Clean up potential markdown code blocks in response
        const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();

        const translatedData = JSON.parse(jsonStr);

        return NextResponse.json(translatedData);

    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json(
            { error: 'Translation failed', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
