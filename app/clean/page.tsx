import { Nav } from '../../components/ui/Nav';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { PrivacyScore } from '../../components/privacy/PrivacyScore';
import { MetadataRow } from '../../components/privacy/MetadataRow';
import { CleaningMode } from '../../components/privacy/CleaningMode';

import { UploadExperience } from '../../components/uploader/UploadExperience';

export default function CleanPage() {
  return <><Nav/><main className="nm-page"><div className="nm-container">
    <div className="nm-page__head"><span className="nm-eyebrow">Private image cleaner</span><h1>Scan a photo before you share it.</h1><p>Choose one or more images to inspect their hidden metadata. Your originals stay on your device throughout the local-first workflow.</p></div>
    <UploadExperience />
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:16}}>
      <Card style={{padding:24}}><span className="nm-eyebrow">Example result</span><h2 style={{margin:'0 0 18px',fontSize:24}}>What NoMeta will look for</h2><MetadataRow label="GPS location" value="52.5200° N, 13.4050° E" tone="danger"/><MetadataRow label="Camera model" value="Example Camera · 24mm"/><MetadataRow label="Captured at" value="7 Sep 2026 · 14:32"/><MetadataRow label="Software" value="Example editor" tone="neutral"/></Card>
      <div><PrivacyScore/><div style={{marginTop:16}}><span className="nm-eyebrow">Choose a cleaning mode</span><CleaningMode/></div></div>
    </div>
  </div></main></>;
}
