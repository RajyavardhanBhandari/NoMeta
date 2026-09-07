import { NextResponse } from 'next/server';

export async function GET() {
  // Production: resolve authenticated user and read a DB-backed ledger balance.
  return NextResponse.json({ configured: false, credits: 0, message: 'Credit persistence is not connected yet.' });
}
