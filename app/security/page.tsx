import { LegalLayout } from '../../components/legal/LegalLayout';

export default function Security() {
  return <LegalLayout eyebrow="Security & trust" title="Minimize data. Verify sensitive operations." intro="NoMeta's security model starts with reducing the amount of sensitive material the service needs to receive.">
    <section><h2>Local-first processing</h2><p>The core V1 image workflow is designed to run in the browser. Keeping the original image local reduces the impact of a server-side image breach and removes the need for image storage for the core feature.</p></section>
    <section><h2>Server boundaries</h2><p>Account, usage and payment operations are separated from the image-processing workflow. Usage limits and paid-credit changes are intended to be decided server-side rather than by localStorage, cookies or client-controlled counters.</p></section>
    <section><h2>Payment verification</h2><p>Razorpay payment signatures and webhooks are intended to be verified on the server. The browser callback is not treated as proof of payment, and webhook handling should be idempotent.</p></section>
    <section><h2>Security limitations</h2><p>No software can promise perfect security. NoMeta cannot control your device, browser extensions, operating system, network, downloaded files or third-party services.</p></section>
    <section><h2>Responsible disclosure</h2><p>If you discover a security issue, please report it privately to the service operator before publicly disclosing exploit details. A dedicated security contact should be published before production launch.</p></section>
    <section><h2>Trust statement</h2><p>NoMeta's privacy score and cleaning result are product signals, not independent security certifications. Users should verify important files independently when the stakes are high.</p></section>
  </LegalLayout>;
}
