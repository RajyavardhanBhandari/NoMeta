import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
export async function getAuthenticatedUser(){const supabase=await createClient();const{data,error}=await supabase.auth.getUser();return error||!data.user?null:data.user;}
export async function requireUser(){const user=await getAuthenticatedUser();if(!user)redirect('/auth/sign-in?next=/dashboard');return user;}
