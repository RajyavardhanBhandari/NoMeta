import { createClient } from '@supabase/supabase-js';
let admin: ReturnType<typeof createClient> | undefined;
export function createAdminClient(){if(admin)return admin;const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Supabase service-role environment variable is missing.');admin=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});return admin;}
