import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { getUserByEmail, getUserByUsername, createUser, initializeUserRecords } from '@/lib/db/database';

export async function POST(request: Request) {
  try {
    const { email, password, username, displayName } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: 'Email, password, and username are required' }, { status: 400 });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
    }

    const password_hash = await hash(password, 12);

    const user = await createUser({
      email,
      password_hash,
      username,
      display_name: displayName || username,
    });

    await initializeUserRecords(user.id);

    return NextResponse.json({ user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
