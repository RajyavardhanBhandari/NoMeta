import { Nav } from '../components/ui/Nav';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { UploadExperience } from '../components/uploader/UploadExperience';

const privacyPrinciples = [
  ['Local processing', 'Your selected image is processed in your browser. The core cleaning flow does not require uploading the image to NoMeta.', 'lock'],
  ['No original storage', 'NoMeta creates a cleaned copy while your original stays on your device.', 'shield'],
  ['Minimal server data', 'Account, usage, payment and cleaning-history information stay separate from the image itself.', 'check'],
  ['Verify before download', 'The cleaned result is checked locally before it becomes available to download.', 'check'],
] as const;

export default function HomePage() {
  return <>
    <Nav />
    <main>
      <section className="nm-hero nm-hero--home">
        <div className="nm-container nm-hero__grid">
          <div className="nm-hero__content">
            <div className="nm-kicker"><span className="nm-kicker__dot" /> Privacy-first photo cleaning</div>
            <h1>Your photos reveal more than you think.</h1>
            <p className="nm-hero__copy">See the hidden information inside a photo, understand the risk, and remove supported metadata before you share it.</p>
            <div className="nm-hero__actions">
              <Button href="#photo-tool" icon="arrow">Scan a photo</Button>
              <Button href="#how-it-works" variant="secondary">How it works</Button>
            </div>
            <div className="nm-hero__trust-row">
              <span><Icon name="lock" size={15}/> Processed locally</span>
              <span><Icon name="shield" size={15}/> Original stays on your device</span>
              <span><Icon name="check" size={15}/> 5 free cleanings daily</span>
            </div>
          </div>
          <div id="photo-tool" className="nm-home-tool">
            <UploadExperience />
          </div>
        </div>
        <div className="nm-hero__scroll-hint"><span>Scroll to learn more</span><i /></div>
      </section>

      <section className="nm-section nm-section--white">
        <div className="nm-container">
          <div className="nm-section__head">
            <span className="nm-eyebrow">Why privacy matters</span>
            <h2>The picture is visible. The metadata isn't.</h2>
            <p>A photo can carry location, device details, timestamps, authorship, editing software and other information that never appears in the image itself.</p>
          </div>
          <div className="nm-feature-grid">
            <Card className="nm-feature"><div className="nm-feature__icon"><Icon name="scan"/></div><span className="nm-feature__index">01</span><h3>See what's hidden</h3><p>Scan common image metadata and translate technical fields into plain-language privacy signals.</p></Card>
            <Card className="nm-feature"><div className="nm-feature__icon"><Icon name="shield"/></div><span className="nm-feature__index">02</span><h3>Maximum privacy by default</h3><p>No confusing protection choices. NoMeta automatically uses the strongest supported cleaning mode.</p></Card>
            <Card className="nm-feature"><div className="nm-feature__icon"><Icon name="lock"/></div><span className="nm-feature__index">03</span><h3>Keep the file with you</h3><p>Core image processing happens locally in your browser instead of uploading your photo to a server.</p></Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="nm-section nm-how-section">
        <div className="nm-container">
          <div className="nm-section__head">
            <span className="nm-eyebrow">How it works</span>
            <h2>Four steps. One calmer way to share.</h2>
          </div>
          <div className="nm-steps">
            {['Upload','Scan','Clean','Download'].map((step, i) => <div className="nm-step" key={step}>
              <span className="nm-step__num">0{i+1}</span><h3>{step}</h3>
              <p>{['Choose a JPG, PNG, WebP or supported HEIC/HEIF image from your device.','Understand what metadata was found and why it matters.','Create a cleaned copy using NoMeta’s strongest supported privacy cleanup.','Verify the result and save the cleaned copy to your device.'][i]}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section className="nm-section nm-section--white nm-ai-section">
        <div className="nm-container">
          <div className="nm-section__head">
            <span className="nm-eyebrow">AI images &amp; provenance</span>
            <h2>AI-generated images can carry information too.</h2>
            <p>Images created or edited with AI tools may contain metadata or provenance-related information. NoMeta removes supported metadata, but it does not determine whether an image was made by AI or erase every external authenticity signal.</p>
          </div>
          <div className="nm-feature-grid">
            <Card className="nm-feature"><div className="nm-feature__icon"><Icon name="scan"/></div><h3>Inspect AI metadata</h3><p>Check supported fields that may identify software, editing workflows or other image information.</p></Card>
            <Card className="nm-feature"><div className="nm-feature__icon"><Icon name="shield"/></div><h3>Clean supported metadata</h3><p>Remove supported metadata while leaving the visual image itself unchanged.</p></Card>
            <Card className="nm-feature"><div className="nm-feature__icon"><Icon name="check"/></div><h3>Know the limits</h3><p>Metadata removal is not the same as removing an AI watermark, pixel fingerprint, platform record or every provenance mechanism.</p></Card>
          </div>
          <div className="nm-privacy-callout"><strong>Privacy rule of thumb:</strong><span>Clean the file before sharing when you do not need its hidden metadata.</span></div>
        </div>
      </section>

      <section className="nm-section">
        <div className="nm-container">
          <div className="nm-section__head">
            <span className="nm-eyebrow">Built around your privacy</span>
            <h2>The photo should stay with you.</h2>
            <p>NoMeta is designed around data minimization instead of sending the original file to a server.</p>
          </div>
          <div className="nm-privacy-grid">
            {privacyPrinciples.map(([title, description, icon]) => <div className="nm-privacy-item" key={title}><div className="nm-feature__icon"><Icon name={icon}/></div><div><h3>{title}</h3><p>{description}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="nm-section nm-section--white">
        <div className="nm-container nm-trust">
          <div className="nm-trust__statement">Privacy should be a product feature, not a footnote.</div>
          <div className="nm-trust__list">
            <div className="nm-trust__item"><Icon name="lock"/><div><strong>Local-first processing</strong><span>Your image is handled in the browser for the core cleaning flow.</span></div></div>
            <div className="nm-trust__item"><Icon name="check"/><div><strong>No destructive edits</strong><span>NoMeta creates a cleaned copy. Your original stays yours.</span></div></div>
            <div className="nm-trust__item"><Icon name="shield"/><div><strong>Clear privacy language</strong><span>We explain what the interface knows and does instead of hiding behind vague security claims.</span></div></div>
          </div>
        </div>
      </section>

      <section className="nm-section nm-final-cta">
        <div className="nm-container" style={{textAlign:'center'}}>
          <div className="nm-section__head" style={{marginInline:'auto'}}><span className="nm-eyebrow">Ready when you are</span><h2>See what your next photo is carrying.</h2><p>Five successful cleanings are free every day for registered users.</p></div>
          <Button href="#photo-tool" icon="arrow">Scan a photo</Button>
        </div>
      </section>
    </main>
  </>;
}
