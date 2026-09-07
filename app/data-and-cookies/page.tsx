import { LegalLayout } from '../../components/legal/LegalLayout';

export default function DataAndCookies() {
  return <LegalLayout eyebrow="Data & cookies" title="What data exists—and what should not." intro="NoMeta's privacy model depends on keeping the image itself out of the server-side account and payment systems.">
    <section><h2>Core image workflow</h2><ul><li><strong>Original image:</strong> intended to stay in your browser.</li><li><strong>Image preview:</strong> generated locally with browser object URLs.</li><li><strong>Raw EXIF/XMP/IPTC payload:</strong> processed locally for scanning and cleaning; not intended for server storage.</li><li><strong>Cleaned image:</strong> generated locally and downloaded by you.</li></ul></section>
    <section><h2>Account and service data</h2><ul><li>Account/authentication identifier and email, where an account is created.</li><li>Daily successful-cleaning usage records.</li><li>Paid-credit ledger and payment/order identifiers.</li><li>Security and operational logs where necessary to protect the service.</li></ul></section>
    <section><h2>Cookies</h2><p>NoMeta may use a secure, HTTP-only authentication session cookie because account authentication cannot safely depend on client-controlled state. Non-essential tracking cookies should not be introduced without updating this disclosure.</p></section>
    <section><h2>Local browser storage</h2><p>The V1 image workflow can use browser memory and temporary object URLs to display files. These are implementation details of the local workflow and are not a substitute for server-side storage.</p></section>
    <section><h2>What we do not want to collect</h2><p>The V1 architecture intentionally avoids uploading original images, thumbnails, GPS values, or full metadata payloads for ordinary image cleaning.</p></section>
  </LegalLayout>;
}
