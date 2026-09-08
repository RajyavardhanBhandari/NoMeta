import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="nm-logo" aria-label="NoMeta home">
      <span className="nm-logo__mark" aria-hidden="true">
        <Image src="/logo-mark.svg" alt="" width={24} height={24} priority />
      </span>
      <span className="nm-logo__wordmark">NoMeta</span>
    </Link>
  );
}
