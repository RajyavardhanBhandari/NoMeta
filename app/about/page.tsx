import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '../../components/ui/Nav';
import { Footer } from '../../components/ui/Footer';

export const metadata: Metadata = {
  title: 'About NoMeta, Rajyavardhan Bhandari & The Founder Nation',
  description: 'Learn why NoMeta was built, meet founder Rajyavardhan Bhandari, and discover how NoMeta fits into The Founder Nation and WebGravity Consulting ecosystem.',
  keywords: ['NoMeta', 'NoMeta founder', 'Rajyavardhan Bhandari', 'photo metadata remover', 'EXIF remover', 'privacy photo cleaner', 'The Founder Nation', 'WebGravity Consulting'],
  alternates: { canonical: '/about' },
  openGraph: { title: 'About NoMeta | Rajyavardhan Bhandari', description: 'The story behind NoMeta and the people building it.', url: '/about', type: 'profile' },
};

const personSchema = {
  '@context': 'https://schema.org', '@type': 'Person', name: 'Rajyavardhan Bhandari', jobTitle: 'Founder & CEO', url: 'https://www.thewebgravity.com/team/rajyavardhan-bhandari/', sameAs: ['https://in.linkedin.com/in/rajyavardhan-bhandari', 'https://www.thefoundernation.com/author/rajb822/'],
};

const productSchema = {
  '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'NoMeta', applicationCategory: 'SecurityApplication', operatingSystem: 'Web', description: 'A browser-based photo metadata cleaner that helps users scan and remove privacy-sensitive metadata locally.', url: 'https://no-meta-ochre.vercel.app', creator: { '@type': 'Person', name: 'Rajyavardhan Bhandari' }, brand: { '@type': 'Brand', name: 'NoMeta' }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, featureList: 'Local photo metadata scanning, local metadata removal, local verification, privacy-first image processing',
};

export default function AboutPage() {
  return <><Nav /><main className="nm-container" style={{ maxWidth: 980, padding: '72px 24px 24px' }}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    <section style={{ maxWidth: 760, marginBottom: 64 }}>
      <span className="nm-eyebrow">About NoMeta</span>
      <h1 style={{ fontSize: 'clamp(42px,7vw,72px)', lineHeight: 1.02, margin: '12px 0 20px' }}>Your photos reveal more than you think.</h1>
      <p style={{ fontSize: 20, lineHeight: 1.7, opacity: .78 }}>NoMeta is a privacy-first photo metadata cleaner built to make one important step before sharing a photo simple: understand what is hidden inside it, remove what you do not want to share, and verify the cleaned copy.</p>
    </section>

    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 64 }}>
      <article className="nm-card"><h2>Why we built NoMeta</h2><p>Photos can carry information beyond the pixels: location, device details, timestamps and other metadata. Most people should not need technical tools or complicated settings to deal with that risk.</p><p>NoMeta takes the privacy-first route: supported image processing happens locally in your browser, so the image itself does not need to be uploaded to our servers.</p></article>
      <article className="nm-card"><h2>Privacy by architecture</h2><p>We designed NoMeta around a simple boundary. Your image is processed on your device. The server is used for account, usage, entitlement and billing workflows rather than storing the original photo.</p><p>The goal is not to ask you to trust a promise after upload. It is to minimize what needs to leave your device in the first place.</p></article>
    </section>

    <section style={{ marginBottom: 64 }}><span className="nm-eyebrow">Founder</span><h2 style={{ fontSize: 40, margin: '10px 0 14px' }}>Rajyavardhan Bhandari</h2><p style={{ maxWidth: 760, fontSize: 18, lineHeight: 1.75, opacity: .8 }}>Rajyavardhan Bhandari is an entrepreneur and builder based in Dehradun, India. He is the Founder & CEO of WebGravity Consulting and the founder of The Founder Nation, a startup and business media platform. His work spans technology, digital products, startup ecosystems, content and founder-focused initiatives.</p><p style={{ maxWidth: 760, fontSize: 18, lineHeight: 1.75, opacity: .8 }}>NoMeta comes from the same builder mindset: identify a practical problem, make the experience easier, and build the product around the user's interests rather than unnecessary complexity.</p><div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}><a className="nm-button nm-button--secondary" href="https://in.linkedin.com/in/rajyavardhan-bhandari" target="_blank" rel="noreferrer">Rajyavardhan on LinkedIn</a><a className="nm-button nm-button--secondary" href="https://www.thewebgravity.com/team/rajyavardhan-bhandari/" target="_blank" rel="noreferrer">Founder profile</a><a className="nm-button nm-button--secondary" href="https://www.thefoundernation.com/author/rajb822/" target="_blank" rel="noreferrer">The Founder Nation</a></div></section>

    <section style={{ marginBottom: 64 }}><span className="nm-eyebrow">Ecosystem</span><h2 style={{ fontSize: 40, margin: '10px 0 14px' }}>A product built across The Founder Nation × WebGravity</h2><p style={{ maxWidth: 760, fontSize: 18, lineHeight: 1.75, opacity: .8 }}>NoMeta is part of the broader ecosystem around The Founder Nation and WebGravity Consulting Pvt. Ltd. The Founder Nation focuses on startup news, insights, founders and the Indian business ecosystem. WebGravity builds digital, branding, marketing and AI-powered solutions for businesses.</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginTop: 24 }}><article className="nm-card"><h3>The Founder Nation</h3><p>Startup and business media covering founders, venture capital, funding, entrepreneurship, technology and the Indian startup ecosystem.</p><a href="https://thefoundernation.com" target="_blank" rel="noreferrer">Visit The Founder Nation →</a></article><article className="nm-card"><h3>WebGravity Consulting Pvt. Ltd.</h3><p>A Dehradun-based digital company working across branding, marketing, production, websites and AI-powered automation.</p><a href="https://www.thewebgravity.com/about-us/" target="_blank" rel="noreferrer">Visit WebGravity →</a></article></div></section>

    <section className="nm-card" style={{ marginBottom: 30 }}><h2>Build privacy into the workflow</h2><p>NoMeta is designed for people who want a fast, understandable way to clean photos before sharing them. Upload a supported image, scan it locally, clean it locally, verify the result, and download the cleaned copy.</p><Link className="nm-button nm-button--primary" href="/clean">Clean a photo with NoMeta</Link></section>
    <p style={{ fontSize: 13, opacity: .6 }}>Some founder and company information on this page is based on publicly available profiles and official company pages. Company roles and descriptions can change over time.</p>
  </main><Footer /></>;
}
