import { Icon } from '../ui/Icon';

export function PrivacyScore({ score = 82 }: { score?: number }) {
  const tone = score >= 70 ? 'danger' : score >= 40 ? 'warning' : 'success';
  const label = score >= 70 ? 'High exposure' : score >= 40 ? 'Some exposure' : 'Low exposure';
  return <div className={`nm-score nm-score--${tone}`}>
    <div className="nm-score__top"><div><span className="nm-eyebrow">Privacy exposure</span><strong>{label}</strong></div><div className="nm-score__number">{score}</div></div>
    <div className="nm-score__track"><span style={{ width: `${score}%` }} /></div>
    <p><Icon name="info" size={15} /> This is an informational score based on metadata found in this image.</p>
  </div>;
}
