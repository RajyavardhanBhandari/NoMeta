export default function HomePage() {
  return (
    <main>
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 24px' }}>
        <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
          NoMeta
        </p>
        <h1 style={{ fontSize: 'clamp(48px, 8vw, 88px)', lineHeight: 0.98, maxWidth: 850, margin: '28px 0' }}>
          Your photos reveal more than you think.
        </h1>
        <p style={{ fontSize: 21, lineHeight: 1.5, color: 'var(--muted)', maxWidth: 680 }}>
          Find hidden metadata. Remove it. Share safely.
        </p>
        <a
          href="/clean"
          style={{ display: 'inline-block', marginTop: 32, padding: '14px 20px', borderRadius: 10, background: '#111', color: '#fff', fontWeight: 700 }}
        >
          Scan a photo
        </a>
        <p style={{ marginTop: 18, fontSize: 14, color: 'var(--muted)' }}>
          Processed locally in your browser · 2 free cleanings every day
        </p>
      </section>
    </main>
  );
}
