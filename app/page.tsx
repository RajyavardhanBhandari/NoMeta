import { Nav } from '../components/ui/Nav';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';

export default function HomePage() {
  return <>
    <Nav />
    <main>
      <section className="nm-hero">
        <div className="nm-container nm-hero__grid">
          <div>
            <div className="nm-kicker">Private by design</div>
            <h1>Your photos reveal more than you think.</h1>
            <p className="nm-hero__copy">Find hidden metadata. Remove it. Share safely. NoMeta helps you see what a photo carries before it leaves your device.</p>
            <div className="nm-hero__actions"><Button href="/clean" icon="arrow">Scan a photo</Button><Button href="/how-it-works" variant="secondary">See how it works</Button></div>
            <p className="nm-hero__note"><Icon name="lock" size={15}/> Processed locally in your browser · 2 free cleanings every day</p>
          </div>
          <div className="nm-demo" aria-label="Illustration of a photo metadata scan">
            <div className="nm-demo__top"><span>nometa / scan</span><span className="nm-demo__dots"><i/><i/><i/></span></div>
            <div className="nm-demo__photo"><span className="nm-demo__scan"/></div>
            <div className="nm-demo__panel">
              <div className="nm-demo__row"><span>GPS location</span><span className="nm-demo__risk">Found</span></div>
              <div className="nm-demo__row"><span>Camera model</span><span className="nm-demo__risk">Found</span></div>
              <div className="nm-demo__row"><span>Captured at</span><span>14:32 · Today</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="nm-section nm-section--white">
        <div className="nm-container">
          <div className="nm-section__head"><h2>Metadata is invisible. The consequences don't have to be.</h2><p>A photo can carry location, device, timestamps, authorship and software information alongside the pixels you see.</p></div>
          <div className="nm-feature-grid">
            <Card className="nm-feature"><div className="nm-feature__icon"><Icon name="scan"/></div><h3>See what's hidden</h3><p>Scan common image metadata and translate technical fields into plain-language privacy signals.</p></Card>
            <Card className="nm-feature"><div className="nm-feature__icon"><Icon name="shield"/></div><h3>Choose your privacy level</h3><p>Use Standard Clean for a balanced result or Maximum Privacy when you want the most aggressive cleanup.</p></Card>
            <Card className="nm-feature"><div className="nm-feature__icon"><Icon name="lock"/></div><h3>Keep the file on your device</h3><p>Core image processing is designed to happen locally in your browser instead of uploading your photo to a server.</p></Card>
          </div>
        </div>
      </section>

      <section className="nm-section">
        <div className="nm-container">
          <div className="nm-section__head"><span className="nm-eyebrow">The workflow</span><h2>Four steps. One calmer way to share.</h2></div>
          <div className="nm-steps">
            {['Upload','Scan','Clean','Download'].map((step, i) => <div className="nm-step" key={step}><span className="nm-step__num">0{i+1}</span><h3>{step}</h3><p>{['Choose a JPG, PNG or WebP from your device.','Understand what metadata was found and why it matters.','Create a cleaned copy without destructively changing your original.','Verify the result and save the cleaned copy to your device.'][i]}</p></div>)}
          </div>
        </div>
      </section>

      <section className="nm-section nm-section--white">
        <div className="nm-container nm-trust">
          <div className="nm-trust__statement">Privacy should be a product feature, not a footnote.</div>
          <div className="nm-trust__list">
            <div className="nm-trust__item"><Icon name="lock"/><div><strong>Local-first processing</strong><span>Your image is handled in the browser for the core cleaning flow.</span></div></div>
            <div className="nm-trust__item"><Icon name="check"/><div><strong>No destructive edits</strong><span>NoMeta creates a cleaned copy. Your original stays yours.</span></div></div>
            <div className="nm-trust__item"><Icon name="shield"/><div><strong>Clear privacy language</strong><span>No vague “security score” claims. We explain exactly what the interface knows and does.</span></div></div>
          </div>
        </div>
      </section>

      <section className="nm-section">
        <div className="nm-container" style={{textAlign:'center'}}>
          <div className="nm-section__head" style={{marginInline:'auto'}}><span className="nm-eyebrow">Ready when you are</span><h2>See what your next photo is carrying.</h2><p>Two successful cleanings are free every day for registered users.</p></div>
          <Button href="/clean" icon="arrow">Scan a photo</Button>
        </div>
      </section>
    </main>
    <footer className="nm-footer"><div className="nm-container nm-footer__row"><span>© {new Date().getFullYear()} NoMeta · Created by Rajyavardhan Bhandari</span><div className="nm-footer__links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/how-it-works">How it works</a><a href="https://thefoundernation.com/?utm_source=nometa&utm_medium=referral&utm_campaign=nometa_v1" target="_blank" rel="noreferrer">The Founder Nation</a></div></div></footer>
  </>;
}
