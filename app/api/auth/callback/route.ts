import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Legacy callback route - NextAuth handles auth callbacks via /api/auth/[...nextauth]
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  return NextResponse.redirect(new URL('/home', requestUrl.origin));
}
