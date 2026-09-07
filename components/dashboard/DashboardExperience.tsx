'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface UsageSummary {
  free_used_today: number;
  free_daily_limit: number;
  paid_credits: number;
  total_cleanings: number;
}

export function DashboardExperience() {
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/usage')
      .then(r => r.json())
      .then(setUsage)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const freeRemaining = usage
    ? Math.max(0, (usage.free_daily_limit ?? 1) - (usage.free_used_today ?? 0))
    : null;

  return (
    <div className="nm-dashboard__grid">
      <div className="nm-dashboard-card">
        <span className="nm-eyebrow">Free allowance</span>
        <div className="nm-dashboard-stat">
          {loading ? '…' : freeRemaining ?? 0}
        </div>
        <p>Cleanings left today</p>
      </div>

      <div className="nm-dashboard-card">
        <span className="nm-eyebrow">Paid credits</span>
        <div className="nm-dashboard-stat">
          {loading ? '…' : usage?.paid_credits ?? 0}
        </div>
        <p>Available anytime</p>
        <Button href="/pricing" variant="secondary">Get more credits</Button>
      </div>

      <div className="nm-dashboard-card">
        <span className="nm-eyebrow">All time</span>
        <div className="nm-dashboard-stat">
          {loading ? '…' : usage?.total_cleanings ?? 0}
        </div>
        <p>Images cleaned</p>
        <Button href="/clean" variant="primary" icon="arrow">Clean a photo</Button>
      </div>
    </div>
  );
}
