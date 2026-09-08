import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '../../components/ui/Nav';

export const metadata: Metadata = {
  title: 'About NoMeta | Privacy-First Photo Metadata Remover & Rajyavardhan Bhandari',
  description: 'Learn how NoMeta removes hidden photo metadata locally in your browser, why it was built, and about founder Rajyavardhan Bhandari, WebGravity and The Founder Nation.',
  keywords: [
    'NoMeta', 'NoMeta app', 'NoMeta photo metadata remover', 'photo metadata remover', 'EXIF remover',
    'remove EXIF data', 'remove GPS metadata from photos', 'photo privacy tool', 'image metadata cleaner',
    'privacy-first photo cleaner', 'local image metadata removal', 'Rajyavardhan Bhandari',
    'Rajyavardhan Bhandari founder', 'The Founder Nation', 'WebGravity Consulting'
  ],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About NoMeta | Photo Privacy, Rajyavardhan Bhandari & The Founder Nation',
    description: 'The story behind NoMeta, its privacy-first architecture, and the founder and ecosystem behind the product.',
    url: '/about', type: 'profile', siteName: 'NoMeta'
  },
  twitter: { card: 'summary', title: 'About NoMeta | Photo Privacy & Its Founder', description: 'Discover NoMeta, Rajyavardhan Bhandari, WebGravity and The Founder Nation.' },
};

const personSchema = {
  '@context': 'https://schema.org', '@type': 'Person', name: 'Rajyavardhan Bhandari', jobTitle: 'Founder & CEO', description: 'Entrepreneur, builder and startup ecosystem professional based in Dehradun, India. Founder of The Founder Nation and Founder & CEO of WebGravity Consulting.', url: 'https://www.thewebgravity.com/team/rajyavardhan-bhandari/', address: { '@type': 'PostalAddress', addressLocality: 'Dehradun', addressRegion: 'Uttarakhand', addressCountry: 'IN' }, sameAs: [
    'https://www.instagram.com/rajyavardhanbhandari/',
    'https://in.linkedin.com/in/rajyavardhan-bhandari',
    'https://www.thewebgravity.com/team/rajyavardhan-bhandari/',
    'https://www.thefoundernation.com/author/rajb822/'
  ]
};

const productSchema = {
  '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'NoMeta', alternateName: 'NoMeta Photo Metadata Remover', applicationCategory: 'SecurityApplication', operatingSystem: 'Web', description: 'A privacy-first browser-based photo metadata scanner and cleaner that helps users detect and remove privacy-sensitive image metadata locally.', url: 'https://no-meta-ochre.vercel.app', creator: { '@type': 'Person', name: 'Rajyavardhan Bhandari', url: 'https://www.thewebgravity.com/team/rajyavardhan-bhandari/' }, brand: { '@type': 'Brand', name: 'NoMeta' }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, featureList: 'Local image metadata scanning, EXIF metadata removal, GPS metadata privacy, local image cleaning, local verification, JPEG PNG WebP support'
};

const organizationSchema = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'NoMeta', url: 'https://no-meta-ochre.vercel.app', founder: { '@type': 'Person', name: 'Rajyavardhan Bhandari' }, sameAs: ['https://www.instagram.com/rajyavardhanbhandari/', 'https://www.thefoundernation.com/', 'https://www.thewebgravity.com/']
};

export default function AboutPage() {
  return <><Nav /><main className="nm-container" style={{ maxWidth: 980, padding: '72px 24px 24px' }}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

    <section style={{ maxWidth: 790, marginBottom: 64 }}>
      <span className="nm-eyebrow">About NoMeta</span>
      <h1 style={{ fontSize: 'clamp(42px,7vw,72px)', lineHeight: 1.02, margin: '12px 0 20px' }}>A privacy-first photo metadata remover built for the way people actually share photos.</h1>
      <p style={{ fontSize: 20, lineHeight: 1.7, opacity: .78 }}>NoMeta helps you discover and remove hidden metadata from photos before you share them. The product is designed around a simple principle: your private image should stay on your device while the cleaning work happens.</p>
    </section>

    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 64 }}>
      <article className="nm-card"><h2>What is photo metadata?</h2><p>Digital photos can contain information beyond the visible image, including EXIF data, device details, timestamps, orientation and, when present, GPS location information. That data can be useful, but it can also reveal more than someone intended to share.</p><p>NoMeta gives people a simple workflow to inspect supported metadata and create a cleaner copy before publishing, messaging or uploading a photo elsewhere.</p></article>
      <article className="nm-card"><h2>How NoMeta protects your photos</h2><p>Supported image processing is performed locally in your browser. The original image does not need to be uploaded to NoMeta's servers for scanning or cleaning.</p><p>The server handles account, usage, entitlement and billing workflows. The product is deliberately designed to minimize what needs to leave your device.</p></article>
    </section>

    <section style={{ marginBottom: 64 }}><span className="nm-eyebrow">Founder</span><h2 style={{ fontSize: 40, margin: '10px 0 14px' }}>Rajyavardhan Bhandari</h2><p style={{ maxWidth: 780, fontSize: 18, lineHeight: 1.75, opacity: .8 }}>Rajyavardhan Bhandari is an entrepreneur and builder based in Dehradun, Uttarakhand, India. He is the Founder & CEO of WebGravity Consulting and the founder of The Founder Nation. His public work spans technology, digital products, startup ecosystems, entrepreneurship, content and founder-focused initiatives.</p><p style={{ maxWidth: 780, fontSize: 18, lineHeight: 1.75, opacity: .8 }}>His professional profile describes experience across web development, digital marketing, brand consulting, public speaking and startup ecosystem work. He studied Computer Science at UPES, where he served in student entrepreneurship and innovation roles. He has also worked with founders through startup communities, mentoring and ecosystem initiatives. citeturn0search4</p><p style={{ maxWidth: 780, fontSize: 18, lineHeight: 1.75, opacity: .8 }}>Rajyavardhan's journey into entrepreneurship includes building WebGravity with Himank Arora during his college years. His public account of that journey describes starting with a small amount of capital and learning the realities of acquiring clients, delivering projects and building a business from the ground up. citeturn0search8</p><p style={{ maxWidth: 780, fontSize: 18, lineHeight: 1.75, opacity: .8 }}>Today, his work also includes building The Founder Nation, a startup and business media platform covering founders, funding, entrepreneurship and India's business ecosystem. The Founder Nation's official terms identify Rajyavardhan Bhandari as its founder, while his author profile lists his published startup and business research. citeturn0search3turn0search0</p><div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}><a className="nm-button nm-button--secondary" href="https://www.instagram.com/rajyavardhanbhandari/" target="_blank" rel="noreferrer">Follow Rajyavardhan on Instagram</a><a className="nm-button nm-button--secondary" href="https://in.linkedin.com/in/rajyavardhan-bhandari" target="_blank" rel="noreferrer">Rajyavardhan on LinkedIn</a><a className="nm-button nm-button--secondary" href="https://www.thewebgravity.com/team/rajyavardhan-bhandari/" target="_blank" rel="noreferrer">WebGravity founder profile</a><a className="nm-button nm-button--secondary" href="https://www.thefoundernation.com/author/rajb822/" target="_blank" rel="noreferrer">Rajyavardhan on The Founder Nation</a></div></section>

    <section style={{ marginBottom: 64 }}><span className="nm-eyebrow">The ecosystem behind the product</span><h2 style={{ fontSize: 40, margin: '10px 0 14px' }}>The Founder Nation × WebGravity</h2><p style={{ maxWidth: 780, fontSize: 18, lineHeight: 1.75, opacity: .8 }}>NoMeta is a product in the broader builder ecosystem around The Founder Nation and WebGravity Consulting Pvt. Ltd. The Founder Nation is a digital news and insights platform focused on startups, founders and the Indian business ecosystem. WebGravity is a Dehradun-based digital company working across branding, marketing, production, websites and digital solutions. citeturn0search2turn0search7</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginTop: 24 }}><article className="nm-card"><h3>The Founder Nation</h3><p>Startup and business media covering founders, venture capital, funding, entrepreneurship, technology, opportunities and India's startup ecosystem.</p><a href="https://thefoundernation.com" target="_blank" rel="noreferrer">Visit The Founder Nation →</a></article><article className="nm-card"><h3>WebGravity Consulting Pvt. Ltd.</h3><p>WebGravity's public company profile describes its work across branding, marketing and production, while its website presents digital and AI-powered solutions for businesses.</p><a href="https://www.thewebgravity.com/about-us/" target="_blank" rel="noreferrer">Visit WebGravity →</a></article></div></section>

    <section style={{ marginBottom: 64 }}><span className="nm-eyebrow">Why NoMeta exists</span><h2 style={{ fontSize: 40, margin: '10px 0 14px' }}>Privacy should not require technical expertise.</h2><p style={{ maxWidth: 780, fontSize: 18, lineHeight: 1.75, opacity: .8 }}>The idea behind NoMeta is straightforward: people should be able to understand what their photos contain and remove unnecessary metadata without learning specialist forensic tools. NoMeta turns that into a short workflow — select a supported image, scan it locally, clean it locally, verify the result and download the cleaned copy.</p><p style={{ maxWidth: 780, fontSize: 18, lineHeight: 1.75, opacity: .8 }}>The product currently focuses on common image formats including JPEG, PNG and WebP. More formats and capabilities can be added over time, but the core principle remains the same: make photo privacy understandable and practical.</p></section>

    <section className="nm-card" style={{ marginBottom: 30 }}><h2>Ready to clean a photo?</h2><p>See what hidden metadata is present and create a cleaner copy before you share your next image.</p><Link className="nm-button nm-button--primary" href="/clean">Clean a photo with NoMeta</Link></section>
    <p style={{ fontSize: 13, opacity: .6 }}>Founder and company information is based on publicly available profiles and official pages and may change over time. NoMeta's product and privacy claims describe the intended architecture of the application.</p>
  </main></>;
}
