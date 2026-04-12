// Map Neon's DATABASE_URL to POSTGRES_URL before @vercel/postgres loads.
import './env';
import { sql } from '@vercel/postgres';

export { sql };

export async function query(text: string, params: unknown[] = []) {
  try {
    const result = await sql.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
