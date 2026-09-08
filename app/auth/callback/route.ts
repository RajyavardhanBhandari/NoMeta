import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function getOrigin(request: Request) {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  return url.origin;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const nextParam = url.searchParams.get('next');
  const next = nextParam?.startsWith('/') ? nextParam : '/dashboard';
  const origin = getOrigin(request);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }

  return NextResponse.redirect(new URL('/auth/sign-in?error=oauth', origin));
}
