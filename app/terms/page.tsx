import { LegalLayout } from '../../components/legal/LegalLayout';

export default function Terms() {
  return <LegalLayout eyebrow="Terms of Service" title="Simple terms for a simple tool." intro="These V1 terms describe the intended use of NoMeta, its limitations, accounts, payments and responsible use.">
    <section><h2>1. Service</h2><p>NoMeta provides browser-based tools for inspecting and cleaning metadata from supported image formats. Features may change as the product evolves.</p></section>
    <section><h2>2. Your files</h2><p>You remain responsible for the images you select. Do not use NoMeta with content you do not have the right to process. The core V1 workflow is designed to process images locally in the browser; you should still verify the browser workflow and downloaded result before sharing sensitive material.</p></section>
    <section><h2>3. Results and limitations</h2><p>NoMeta's scanner and cleaner are not exhaustive forensic or security tools. Metadata formats differ between files and software. A clean result should be treated as a practical privacy measure, not a certification that an image contains no hidden information.</p></section>
    <section><h2>4. Accounts</h2><p>You are responsible for maintaining access to your account and for providing accurate information. We may restrict or suspend access where necessary to prevent abuse, fraud or security incidents.</p></section>
    <section><h2>5. Free allowance and paid credits</h2><p>Registered users receive up to two successful free image cleanings per calendar day under the V1 rules. Additional successful cleanings are priced at ₹5 each when paid credits are available. A cleaning should consume a credit only after successful processing and verification.</p></section>
    <section><h2>6. Payments</h2><p>Payment orders are created and verified server-side. A client-side payment callback alone does not establish that a payment succeeded. Payment provider rules also apply to the transaction.</p></section>
    <section><h2>7. Refunds</h2><p>Refund eligibility is described on the <a href="/refunds">Payments &amp; refunds</a> page. We may reverse incorrectly granted credits or transactions caused by technical errors.</p></section>
    <section><h2>8. Prohibited use</h2><p>You may not use the service to attack, overload, probe or bypass security controls, impersonate another person, process unlawful content, or interfere with another user's access.</p></section>
    <section><h2>9. Availability</h2><p>NoMeta is provided on an availability-dependent basis. Browser compatibility, unsupported file structures, payment outages and other technical issues may prevent a cleaning from completing.</p></section>
    <section><h2>10. Intellectual property</h2><p>NoMeta's software, branding and original product materials are protected by applicable intellectual-property laws. These terms do not transfer ownership to you.</p></section>
    <section><h2>11. Disclaimer</h2><p>NoMeta is a privacy utility. It is not a substitute for a professional digital-forensics workflow, legal advice, enterprise security assessment or guaranteed anonymization service.</p></section>
    <section><h2>12. Changes</h2><p>We may update these terms as the service changes. Continued use after an effective update constitutes acceptance where permitted by applicable law.</p></section>
    <section><h2>Effective date</h2><p>September 7, 2026. This is a V1 terms draft and should be reviewed for the final operating entity, jurisdiction and production policies before launch.</p></section>
  </LegalLayout>;
}
