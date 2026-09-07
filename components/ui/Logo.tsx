import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="nm-logo" aria-label="NoMeta home">
      <span className="nm-logo__mark">NM</span>
      <span className="nm-logo__text">NoMeta</span>
    </Link>
  );
}
