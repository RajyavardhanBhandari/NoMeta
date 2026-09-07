import { Nav } from '@/components/ui/Nav';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <>
      <Nav />
      <main className="nm-page">
        <div className="nm-container">
          <div className="nm-page__head" style={{ paddingTop: '4rem', textAlign: 'center', maxWidth: 640, margin: '0 auto 3rem' }}>
            <span className="nm-eyebrow">Privacy-first</span>
            <h1>Clean your photos before you share them.</h1>
            <p style={{ marginBottom: '2rem' }}>
              NoMeta strips EXIF data, GPS coordinates and hidden metadata from your images —
              entirely in your browser. Nothing is ever uploaded or stored.
            </p>
            <Button href="/clean" variant="primary" icon="arrow">Scan a photo — it&apos;s free</Button>
          </div>
        </div>
      </main>
    </>
  );
}
