import type { ReactNode } from 'react';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }) {
  return <span className={`nm-badge nm-badge--${tone}`}><span className="nm-badge__dot" />{children}</span>;
}
