import { redirect } from 'next/navigation';
import { Nav } from '@/components/ui/Nav';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/sign-in');

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  // The untyped admin client currently resolves table rows as `never`.
  // Keep the runtime value intact while giving this page the narrow shape it uses.
  const adminProfile = profile as { role?: string } | null;

  if (adminProfile?.role !== 'admin') redirect('/dashboard');

  const [{ count: users }, { count: payments }, { count: cleanings }] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('payment_orders').select('*', { count: 'exact', head: true }),
    admin.from('cleaning_history').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <>
      <Nav />
      <main className="nm-page">
        <div className="nm-container">
          <div className="nm-page__head">
            <span className="nm-eyebrow">Admin</span>
            <h1>NoMeta operations.</h1>
            <p>Operational counts only. Original images and raw metadata are never stored here.</p>
          </div>
          <div className="nm-dashboard__grid">
            <div className="nm-dashboard-card">
              <span className="nm-eyebrow">Users</span>
              <div className="nm-dashboard-stat">{users ?? 0}</div>
              <p>Registered accounts</p>
            </div>
            <div className="nm-dashboard-card">
              <span className="nm-eyebrow">Payments</span>
              <div className="nm-dashboard-stat">{payments ?? 0}</div>
              <p>Payment orders</p>
            </div>
            <div className="nm-dashboard-card">
              <span className="nm-eyebrow">Cleanings</span>
              <div className="nm-dashboard-stat">{cleanings ?? 0}</div>
              <p>Successful cleaning events</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
