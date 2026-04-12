// Neon's Vercel integration sets DATABASE_URL.
// @vercel/postgres expects POSTGRES_URL.
// This side-effect module bridges the gap — import it before @vercel/postgres.
if (process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}
if (process.env.DATABASE_URL_UNPOOLED && !process.env.POSTGRES_URL_NON_POOLING) {
  process.env.POSTGRES_URL_NON_POOLING = process.env.DATABASE_URL_UNPOOLED;
}
