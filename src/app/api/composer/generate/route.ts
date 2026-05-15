import { NextRequest, NextResponse } from 'next/server';
import { generateSmartWorkflow } from '@/lib/smartComposer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface GenerateBody {
  prompt?: string;
  language?: 'typescript' | 'python';
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateBody;
    const prompt = body.prompt?.trim() ?? '';
    const language = body.language === 'python' ? 'python' : 'typescript';

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    if (prompt.length > 4000) {
      return NextResponse.json({ error: 'Prompt is too long. Please keep it under 4000 characters.' }, { status: 400 });
    }

    const result = await generateSmartWorkflow({
      prompt,
      language,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Composer generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate workflow.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}