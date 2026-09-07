import { Badge } from '../ui/Badge';

export function MetadataRow({ label, value, tone = 'warning' }: { label: string; value: string; tone?: 'neutral'|'success'|'warning'|'danger'|'info' }) {
  return <div className="nm-meta-row"><div><strong>{label}</strong><span>{value}</span></div><Badge tone={tone}>{tone === 'danger' ? 'High risk' : tone === 'warning' ? 'Review' : 'Found'}</Badge></div>;
}
