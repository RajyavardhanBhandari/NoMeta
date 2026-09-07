import { ReactNode } from 'react';
import { Nav } from '../ui/Nav';
import { LegalFooter } from './LegalFooter';

export function LegalLayout({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <><Nav/><main className="nm-page"><div className="nm-container"><div className="nm-page__head"><span className="nm-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div><div className="nm-legal">{children}</div></div></main><LegalFooter/></>;
}
