import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'node:crypto';
import { auth } from '@/lib/auth/config';
import { GENERATE_LESSON_SYSTEM_PROMPT } from '@/lib/content-generator/system-prompt';

export const dynamic = 'force-dynamic';

const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 8192;

interface Outline {
  path_name: string;
  path_id: string;
  unit_name: string;
  unit_description?: string;
  unit_order_index?: number;
  unit_icon?: string;
  unit_id?: string | null;
  lesson_name: string;
  lesson_type?: string;
  question_count?: number;
  brief: string;
}

export async function POST(request: Request) {
  // 1. Auth check — must be logged in
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Admin allowlist check (comma-separated emails in ADMIN_EMAILS)
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) {
    return NextResponse.json(
      { error: 'ADMIN_EMAILS is not configured in Vercel project settings' },
      { status: 500 }
    );
  }

  if (!adminEmails.includes(session.user.email.toLowerCase())) {
    return NextResponse.json(
      { error: 'Forbidden — your email is not in the admin allowlist' },
      { status: 403 }
    );
  }

  // 3. Check Anthropic key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured in Vercel project settings' },
      { status: 500 }
    );
  }

  // 4. Parse and validate outline from request body
  let outline: Outline;
  try {
    outline = (await request.json()) as Outline;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const outlineError = validateOutline(outline);
  if (outlineError) {
    return NextResponse.json({ error: outlineError }, { status: 400 });
  }

  // 5. Call Claude
  const userPrompt = buildUserPrompt(outline);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let response;
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: GENERATE_LESSON_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('Anthropic API error:', msg);
    return NextResponse.json(
      { error: `Anthropic API call failed: ${msg}` },
      { status: 502 }
    );
  }

  const usage = response.usage || { input_tokens: 0, output_tokens: 0 };

  // 6. Parse Claude response
  const responseText = extractTextContent(response);
  if (!responseText) {
    return NextResponse.json(
      { error: 'Claude response was empty' },
      { status: 502 }
    );
  }

  let generated: Record<string, unknown>;
  try {
    generated = parseJsonFromResponse(responseText);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        error: `Could not parse Claude response as JSON: ${msg}`,
        raw: responseText,
      },
      { status: 502 }
    );
  }

  if (typeof generated.error === 'string') {
    return NextResponse.json(
      { error: `Claude refused to generate: ${generated.error}` },
      { status: 422 }
    );
  }

  const generatedError = validateGenerated(generated);
  if (generatedError) {
    return NextResponse.json(
      {
        error: `Generated content failed validation: ${generatedError}`,
        generated,
      },
      { status: 502 }
    );
  }

  // 7. Build SQL seed
  const sql = buildSeedSql(outline, generated);

  // 8. Return
  return NextResponse.json({
    sql,
    lesson_name: outline.lesson_name,
    usage: {
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
    },
  });
}

// --- Helpers ------------------------------------------------------------

function validateOutline(outline: Outline): string | null {
  if (!outline || typeof outline !== 'object') return 'Outline must be an object';
  const required: (keyof Outline)[] = ['path_name', 'path_id', 'unit_name', 'lesson_name', 'brief'];
  for (const field of required) {
    const val = outline[field];
    if (typeof val !== 'string' || val.length === 0) {
      return `outline.${field} is required and must be a non-empty string`;
    }
  }
  if (outline.question_count !== undefined) {
    const n = Number(outline.question_count);
    if (!Number.isInteger(n) || n < 1 || n > 20) {
      return 'question_count must be an integer between 1 and 20';
    }
  }
  return null;
}

function buildUserPrompt(outline: Outline): string {
  return `Generate a Mathly lesson with the following outline:

Path: ${outline.path_name}
Unit: ${outline.unit_name}
Lesson: ${outline.lesson_name}
Lesson type: ${outline.lesson_type || 'tutorial'}
Number of questions: ${outline.question_count || 5}

Brief from the curriculum designer:
${outline.brief}

Output the JSON object now. Remember: only JSON, no prose, no markdown fences.`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextContent(response: any): string {
  if (!response || !Array.isArray(response.content)) return '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textBlock = response.content.find((b: any) => b.type === 'text');
  return textBlock ? textBlock.text : '';
}

function parseJsonFromResponse(text: string): Record<string, unknown> {
  let cleaned = String(text).trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/m, '');
  cleaned = cleaned.replace(/```\s*$/m, '');
  try {
    return JSON.parse(cleaned);
  } catch (firstError) {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw firstError;
  }
}

function validateGenerated(generated: Record<string, unknown>): string | null {
  if (!generated || typeof generated !== 'object') return 'generated must be an object';
  const required = ['lesson_description', 'history_intro', 'questions'];
  for (const field of required) {
    if (generated[field] === undefined || generated[field] === null) {
      return `generated.${field} is required`;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const questions = generated.questions as any;
  if (!Array.isArray(questions) || questions.length === 0) {
    return 'generated.questions must be a non-empty array';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const h = generated.history_intro as any;
  if (typeof h !== 'object' || h === null) return 'history_intro must be an object';
  if (!Array.isArray(h.story_paragraphs) || h.story_paragraphs.length === 0) {
    return 'history_intro.story_paragraphs must be a non-empty array';
  }
  return null;
}

function buildSeedSql(outline: Outline, generated: Record<string, unknown>): string {
  const unitId = outline.unit_id || randomUUID();
  const lessonId = randomUUID();
  const now = new Date().toISOString();

  const lines: string[] = [];
  lines.push(`-- Generated lesson: ${outline.lesson_name}`);
  lines.push(`-- Path: ${outline.path_name} (${outline.path_id})`);
  lines.push(`-- Unit: ${outline.unit_name}${outline.unit_id ? ' (existing)' : ' (new)'}`);
  lines.push(`-- Generated on: ${now}`);
  lines.push(`-- Generator: /api/admin/generate-lesson (Anthropic Claude)`);
  lines.push(`-- Review this SQL carefully before running in the Neon SQL editor.`);
  lines.push('');

  if (!outline.unit_id) {
    lines.push('-- New unit');
    lines.push('INSERT INTO units (id, path_id, name, description, order_index, xp_reward, icon) VALUES');
    lines.push(`  (${sqlString(unitId)},`);
    lines.push(`   ${sqlString(outline.path_id)},`);
    lines.push(`   ${sqlString(outline.unit_name)},`);
    lines.push(`   ${sqlString(outline.unit_description || '')},`);
    lines.push(`   ${Number(outline.unit_order_index) || 1}, 80, ${sqlString(outline.unit_icon || '📖')})`);
    lines.push('ON CONFLICT (id) DO NOTHING;');
    lines.push('');
  }

  lines.push('-- Lesson');
  lines.push('INSERT INTO lessons (');
  lines.push('  id, unit_id, name, description, order_index, lesson_type,');
  lines.push('  xp_reward, estimated_minutes, origin_year, origin_figure, history_intro');
  lines.push(') VALUES (');
  lines.push(`  ${sqlString(lessonId)},`);
  lines.push(`  ${sqlString(unitId)},`);
  lines.push(`  ${sqlString(outline.lesson_name)},`);
  lines.push(`  ${sqlString(generated.lesson_description)},`);
  lines.push(`  1,`);
  lines.push(`  ${sqlString(outline.lesson_type || 'tutorial')},`);
  lines.push(`  ${Number(generated.xp_reward) || 25},`);
  lines.push(`  ${Number(generated.estimated_minutes) || 8},`);
  lines.push(`  ${generated.origin_year ? Number(generated.origin_year) : 'NULL'},`);
  lines.push(`  ${sqlStringOrNull(generated.origin_figure)},`);
  lines.push(`  ${sqlJsonb(generated.history_intro)}`);
  lines.push(')');
  lines.push('ON CONFLICT (id) DO NOTHING;');
  lines.push('');

  lines.push('-- Questions');
  lines.push('INSERT INTO questions (');
  lines.push('  id, lesson_id, question_type, difficulty, question_text, question_latex,');
  lines.push('  options, correct_answer, explanation, hint, xp_value, order_index');
  lines.push(') VALUES');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const questions = generated.questions as any[];
  const questionRows = questions.map((q, i) => {
    const qId = randomUUID();
    const optionsSql = q.options ? sqlJsonb(q.options) : 'NULL';
    const latexSql = q.question_latex ? sqlString(q.question_latex) : 'NULL';
    return `  (${sqlString(qId)}, ${sqlString(lessonId)}, ${sqlString(q.question_type)}, ${sqlString(q.difficulty || 'easy')}, ${sqlString(q.question_text)}, ${latexSql}, ${optionsSql}, ${sqlJsonb(q.correct_answer)}, ${sqlString(q.explanation || '')}, ${sqlStringOrNull(q.hint)}, ${Number(q.xp_value) || 5}, ${i + 1})`;
  });

  lines.push(questionRows.join(',\n'));
  lines.push('ON CONFLICT (id) DO NOTHING;');
  lines.push('');

  return lines.join('\n');
}

function sqlString(value: unknown): string {
  if (value === null || value === undefined) return "''";
  return "'" + String(value).replace(/'/g, "''") + "'";
}

function sqlStringOrNull(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'NULL';
  return sqlString(value);
}

function sqlJsonb(obj: unknown): string {
  const json = JSON.stringify(obj);
  return "'" + json.replace(/'/g, "''") + "'::jsonb";
}
