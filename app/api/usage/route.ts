import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ configured: false, limit: 2, used: 0, remaining: 2, message: 'Daily usage persistence is not connected yet.' });
}
