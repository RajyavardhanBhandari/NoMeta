import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPublicSiteUrl } from '@/lib/config/env';
export async function GET(request:Request){const url=new URL(request.url),code=url.searchParams.get('code'),next=url.searchParams.get('next');if(code){const supabase=await createClient();const{error}=await supabase.auth.exchangeCodeForSession(code);if(!error){const target=next?.startsWith('/')?next:'/dashboard';return NextResponse.redirect(new URL(target,getPublicSiteUrl()));}}return NextResponse.redirect(new URL('/auth/sign-in?error=oauth',getPublicSiteUrl()));}
