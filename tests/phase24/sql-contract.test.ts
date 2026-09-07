import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('NoMeta database migration contracts', () => {
  const root = process.cwd();
  const migration = fs.readFileSync(path.join(root, 'supabase/migrations/202609070002_phase24_qa_hardening.sql'), 'utf8');

  it('grants complete_cleaning using the full five-argument signature', () => {
    expect(migration).toContain('grant execute on function public.complete_cleaning(uuid,text,text,text,bigint) to authenticated;');
  });

  it('does not grant the payment credit function to browser roles', () => {
    expect(migration).toContain('revoke execute on function public.grant_payment_credit(text,text) from public, anon, authenticated;');
  });
});
