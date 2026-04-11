#!/usr/bin/env node
/**
 * Mathly lesson generator.
 *
 * Usage:
 *   npm run generate-lesson -- <path-to-outline.json>
 *
 * Example:
 *   npm run generate-lesson -- outlines/rules-of-exponents.json
 *
 * Reads a lesson outline JSON file, sends a structured prompt to
 * Claude via the Anthropic SDK, parses the response, and writes a
 * reviewable SQL seed file to supabase/generated/<slug>.sql.
 *
 * The generated SQL is NEVER run automatically. You review it in
 * git diff and paste it into the Neon SQL editor when you're happy.
 *
 * See scripts/README.md for the full workflow and safety rules.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 8192;

// --- CLI entry point ---------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(args.length < 1 ? 1 : 0);
  }

  const outlinePath = path.resolve(REPO_ROOT, args[0]);
  let outlineRaw;
  try {
    outlineRaw = await fs.readFile(outlinePath, 'utf8');
  } catch (e) {
    fail(`Could not read outline file: ${outlinePath}\n${e.message}`);
  }

  let outline;
  try {
    outline = JSON.parse(outlineRaw);
  } catch (e) {
    fail(`Outline file is not valid JSON: ${e.message}`);
  }

  validateOutline(outline);

  if (!process.env.ANTHROPIC_API_KEY) {
    fail('ANTHROPIC_API_KEY environment variable is not set. Export it before running this script.');
  }

  const systemPromptPath = path.join(__dirname, 'prompts', 'generate-lesson-system.md');
  let systemPrompt;
  try {
    systemPrompt = await fs.readFile(systemPromptPath, 'utf8');
  } catch (e) {
    fail(`Could not read system prompt at ${systemPromptPath}: ${e.message}`);
  }

  const userPrompt = buildUserPrompt(outline);

  console.log(`\nGenerating lesson: ${outline.lesson_name}`);
  console.log(`  Path: ${outline.path_name} (${outline.path_id})`);
  console.log(`  Unit: ${outline.unit_name}${outline.unit_id ? ` (${outline.unit_id})` : ' (new)'}`);
  console.log(`  Questions: ${outline.question_count || 5}`);
  console.log(`\nCalling Claude (${MODEL})...`);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let response;
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });
  } catch (e) {
    fail(`Anthropic API call failed: ${e.message}`);
  }

  const usage = response.usage || {};
  console.log(`  Input tokens:  ${usage.input_tokens ?? '?'}`);
  console.log(`  Output tokens: ${usage.output_tokens ?? '?'}`);

  const responseText = extractTextContent(response);
  if (!responseText) {
    fail('Claude response contained no text content.');
  }

  let generated;
  try {
    generated = parseJsonFromResponse(responseText);
  } catch (e) {
    console.error('\n--- Raw Claude response ---');
    console.error(responseText);
    console.error('--- End raw response ---\n');
    fail(`Could not parse JSON from Claude response: ${e.message}`);
  }

  if (generated.error) {
    fail(`Claude refused to generate: ${generated.error}`);
  }

  try {
    validateGenerated(generated);
  } catch (e) {
    console.error('\n--- Generated JSON (fails validation) ---');
    console.error(JSON.stringify(generated, null, 2));
    console.error('--- End generated JSON ---\n');
    fail(`Generated content failed validation: ${e.message}`);
  }

  const sql = buildSeedSql(outline, generated);
  const slug = slugify(outline.lesson_name);
  const outputDir = path.join(REPO_ROOT, 'supabase', 'generated');
  await fs.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${slug}.sql`);
  await fs.writeFile(outputPath, sql, 'utf8');

  const relOut = path.relative(REPO_ROOT, outputPath);
  console.log(`\n✅ Generated: ${relOut}`);
  console.log('\nNext steps:');
  console.log(`  1. Review the file:   cat ${relOut}`);
  console.log(`  2. Check the git diff to eyeball the changes`);
  console.log(`  3. When you're happy, paste the SQL into the Neon SQL editor`);
  console.log(`  4. Commit the generated file so it lives in git\n`);
}

// --- Helpers ------------------------------------------------------------

function printUsage() {
  console.log('Mathly lesson generator');
  console.log('');
  console.log('Usage:');
  console.log('  npm run generate-lesson -- <path-to-outline.json>');
  console.log('');
  console.log('Example:');
  console.log('  npm run generate-lesson -- outlines/rules-of-exponents.json');
  console.log('');
  console.log('Prereqs:');
  console.log('  - ANTHROPIC_API_KEY env var set');
  console.log('  - Migration 002 applied to Neon (history_intro column exists)');
  console.log('  - Target path_id already exists in curriculum_paths');
  console.log('');
  console.log('See scripts/README.md for full workflow.');
}

function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

function validateOutline(outline) {
  const required = ['path_name', 'path_id', 'unit_name', 'lesson_name', 'brief'];
  for (const field of required) {
    if (!outline[field] || typeof outline[field] !== 'string') {
      fail(`outline.${field} is required and must be a non-empty string`);
    }
  }
  if (!outline.lesson_type) outline.lesson_type = 'tutorial';
  if (!outline.question_count) outline.question_count = 5;
  if (outline.question_count < 1 || outline.question_count > 20) {
    fail(`outline.question_count must be between 1 and 20, got ${outline.question_count}`);
  }
}

function buildUserPrompt(outline) {
  return `Generate a Mathly lesson with the following outline:

Path: ${outline.path_name}
Unit: ${outline.unit_name}
Lesson: ${outline.lesson_name}
Lesson type: ${outline.lesson_type}
Number of questions: ${outline.question_count}

Brief from the curriculum designer:
${outline.brief}

Output the JSON object now. Remember: only JSON, no prose, no markdown fences.`;
}

function extractTextContent(response) {
  if (!response || !Array.isArray(response.content)) return '';
  const textBlock = response.content.find((b) => b.type === 'text');
  return textBlock ? textBlock.text : '';
}

function parseJsonFromResponse(text) {
  let cleaned = String(text).trim();
  // Strip markdown code fences if Claude added them anyway
  cleaned = cleaned.replace(/^```(?:json)?\s*/m, '');
  cleaned = cleaned.replace(/```\s*$/m, '');
  try {
    return JSON.parse(cleaned);
  } catch (firstError) {
    // Last resort: find the first { and last } and parse the slice
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw firstError;
  }
}

function validateGenerated(generated) {
  if (!generated || typeof generated !== 'object') {
    throw new Error('generated must be an object');
  }
  const required = ['lesson_description', 'history_intro', 'questions'];
  for (const field of required) {
    if (generated[field] === undefined || generated[field] === null) {
      throw new Error(`generated.${field} is required`);
    }
  }
  if (!Array.isArray(generated.questions) || generated.questions.length === 0) {
    throw new Error('generated.questions must be a non-empty array');
  }
  const h = generated.history_intro;
  if (typeof h !== 'object') {
    throw new Error('generated.history_intro must be an object');
  }
  if (!Array.isArray(h.story_paragraphs) || h.story_paragraphs.length === 0) {
    throw new Error('generated.history_intro.story_paragraphs must be a non-empty array');
  }
  generated.questions.forEach((q, i) => {
    if (!q.question_type || !q.question_text || q.correct_answer === undefined) {
      throw new Error(`question[${i}] is missing required fields`);
    }
    const validTypes = ['multiple_choice', 'fill_in_blank', 'true_false', 'equation_solver'];
    if (!validTypes.includes(q.question_type)) {
      throw new Error(`question[${i}].question_type "${q.question_type}" is not in ${validTypes.join(', ')}`);
    }
    if (q.question_type === 'multiple_choice') {
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`question[${i}] (multiple_choice) must have exactly 4 options`);
      }
    }
  });
}

function buildSeedSql(outline, generated) {
  const unitId = outline.unit_id || randomUUID();
  const lessonId = randomUUID();
  const now = new Date().toISOString();

  const lines = [];
  lines.push(`-- Generated lesson: ${outline.lesson_name}`);
  lines.push(`-- Path: ${outline.path_name} (${outline.path_id})`);
  lines.push(`-- Unit: ${outline.unit_name}${outline.unit_id ? ` (existing)` : ` (new)`}`);
  lines.push(`-- Generated on: ${now}`);
  lines.push(`-- Generator: scripts/generate-lesson.mjs (Anthropic Claude)`);
  lines.push(`-- Review this file carefully before running in Neon SQL editor.`);
  lines.push(``);

  if (!outline.unit_id) {
    lines.push(`-- New unit`);
    lines.push(`INSERT INTO units (id, path_id, name, description, order_index, xp_reward, icon) VALUES`);
    lines.push(`  (${sqlString(unitId)},`);
    lines.push(`   ${sqlString(outline.path_id)},`);
    lines.push(`   ${sqlString(outline.unit_name)},`);
    lines.push(`   ${sqlString(outline.unit_description || '')},`);
    lines.push(`   ${Number(outline.unit_order_index) || 1}, 80, ${sqlString(outline.unit_icon || '📖')})`);
    lines.push(`ON CONFLICT (id) DO NOTHING;`);
    lines.push(``);
  }

  lines.push(`-- Lesson`);
  lines.push(`INSERT INTO lessons (`);
  lines.push(`  id, unit_id, name, description, order_index, lesson_type,`);
  lines.push(`  xp_reward, estimated_minutes, origin_year, origin_figure, history_intro`);
  lines.push(`) VALUES (`);
  lines.push(`  ${sqlString(lessonId)},`);
  lines.push(`  ${sqlString(unitId)},`);
  lines.push(`  ${sqlString(outline.lesson_name)},`);
  lines.push(`  ${sqlString(generated.lesson_description)},`);
  lines.push(`  1,`);
  lines.push(`  ${sqlString(outline.lesson_type)},`);
  lines.push(`  ${Number(generated.xp_reward) || 25},`);
  lines.push(`  ${Number(generated.estimated_minutes) || 8},`);
  lines.push(`  ${generated.origin_year ? Number(generated.origin_year) : 'NULL'},`);
  lines.push(`  ${sqlStringOrNull(generated.origin_figure)},`);
  lines.push(`  ${sqlJsonb(generated.history_intro)}`);
  lines.push(`)`);
  lines.push(`ON CONFLICT (id) DO NOTHING;`);
  lines.push(``);

  lines.push(`-- Questions`);
  lines.push(`INSERT INTO questions (`);
  lines.push(`  id, lesson_id, question_type, difficulty, question_text, question_latex,`);
  lines.push(`  options, correct_answer, explanation, hint, xp_value, order_index`);
  lines.push(`) VALUES`);

  const questionRows = generated.questions.map((q, i) => {
    const qId = randomUUID();
    const optionsSql = q.options ? sqlJsonb(q.options) : 'NULL';
    const latexSql = q.question_latex ? sqlString(q.question_latex) : 'NULL';
    return `  (${sqlString(qId)}, ${sqlString(lessonId)}, ${sqlString(q.question_type)}, ${sqlString(q.difficulty || 'easy')}, ${sqlString(q.question_text)}, ${latexSql}, ${optionsSql}, ${sqlJsonb(q.correct_answer)}, ${sqlString(q.explanation || '')}, ${sqlStringOrNull(q.hint)}, ${Number(q.xp_value) || 5}, ${i + 1})`;
  });

  lines.push(questionRows.join(',\n'));
  lines.push(`ON CONFLICT (id) DO NOTHING;`);
  lines.push(``);

  return lines.join('\n');
}

// --- SQL escaping helpers ----------------------------------------------

function sqlString(value) {
  if (value === null || value === undefined) return "''";
  return "'" + String(value).replace(/'/g, "''") + "'";
}

function sqlStringOrNull(value) {
  if (value === null || value === undefined || value === '') return 'NULL';
  return sqlString(value);
}

function sqlJsonb(obj) {
  const json = JSON.stringify(obj);
  // Single-quote escape the JSON for SQL, then cast to jsonb
  return "'" + json.replace(/'/g, "''") + "'::jsonb";
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// --- Kick it off --------------------------------------------------------

main().catch((e) => {
  fail(e.stack || e.message || String(e));
});
