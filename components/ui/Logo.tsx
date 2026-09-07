import Link from 'next/link';

export function Logo() {
  return <Link href="/" className="nm-logo" aria-label="NoMeta home"><span className="nm-logo__mark" aria-hidden="true">N</span><span>NoMeta</span></Link>;
}
