import { NextResponse } from 'next/server';
import { getAnthropicClient, EULER_SYSTEM_PROMPT } from '@/lib/anthropic/client';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { response: "Euler's Mind is not configured yet. Please set up the ANTHROPIC_API_KEY environment variable." },
        { status: 200 }
      );
    }

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: EULER_SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textContent = response.content.find((block) => block.type === 'text');
    const responseText = textContent ? textContent.text : 'I apologize, but I could not generate a response.';

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Euler API error:', error);
    return NextResponse.json(
      { response: 'I encountered an error while processing your request. Please try again.' },
      { status: 200 }
    );
  }
}
