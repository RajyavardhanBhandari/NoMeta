-- Phase 24 QA hardening
-- Fix the execute grant to match the complete_cleaning function's actual signature.
-- The function is defined with five arguments, the last two having defaults.
revoke execute on function public.complete_cleaning(uuid,text,text,bigint) from public, anon, authenticated;
revoke execute on function public.complete_cleaning(uuid,text,text,bigint,bigint) from public, anon, authenticated;
grant execute on function public.complete_cleaning(uuid,text,text,text,bigint) to authenticated;

-- Keep payment credit grants callable only by the server-side service role.
revoke execute on function public.grant_payment_credit(text,text) from public, anon, authenticated;
