import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Resolves the current session user from the server.
 * Redirects to sign-in if unauthenticated.
 */
export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in');
  return user;
}
