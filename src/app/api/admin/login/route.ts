import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const inputUser = (username || '').trim().toLowerCase();
    const inputPass = (password || '').trim();

    // Read environment variables or fallback values
    const envUser = (
      process.env.ADMIN_USERNAME ||
      process.env.NEXT_PUBLIC_ADMIN_USERNAME ||
      'MITHILESH'
    ).trim().toLowerCase();

    const envPass = (
      process.env.ADMIN_PASSWORD ||
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
      'SAURAVvalo@1234'
    ).trim();

    // Allowed usernames (env username, MITHILESH, saurav, admin)
    const allowedUsernames = new Set([
      envUser,
      'mithilesh',
      'saurav',
      'admin',
    ]);

    // Allowed passwords (env password, SAURAVvalo@1234, admin, password)
    const allowedPasswords = new Set([
      envPass,
      'SAURAVvalo@1234',
      'admin',
      'password',
    ]);

    const isUserValid = allowedUsernames.has(inputUser);
    const isPassValid = allowedPasswords.has(inputPass);

    if (isUserValid && isPassValid) {
      return NextResponse.json({ success: true, message: 'Authentication successful' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Error during admin login:', error);
    return NextResponse.json(
      { success: false, error: 'Server authentication error' },
      { status: 500 }
    );
  }
}
