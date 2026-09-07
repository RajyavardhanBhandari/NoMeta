import { LegalLayout } from '../../components/legal/LegalLayout';

export default function Refunds() {
  return <LegalLayout eyebrow="Payments & refunds" title="Clear rules for ₹5 cleanings." intro="This page describes the intended V1 treatment of paid credits and payment errors. Final production policy should be reviewed before launch.">
    <section><h2>Price</h2><p>V1 additional image cleaning is priced at ₹5 per successful paid cleaning. One paid credit represents one successful paid cleaning.</p></section>
    <section><h2>When a credit is consumed</h2><p>A paid credit should be consumed only after the image has been successfully cleaned and the result has passed the product's verification step. Failed or cancelled processing should not consume a paid credit.</p></section>
    <section><h2>Payment failure</h2><p>If a payment is not verified by the server, no paid credit should be granted. Do not rely on a successful-looking browser callback alone.</p></section>
    <section><h2>Duplicate or erroneous charges</h2><p>If you believe you were charged more than once for the same intended purchase, or a technical error resulted in an incorrect credit balance, contact support with the relevant order or payment identifier. Do not send card, UPI PIN or banking credentials.</p></section>
    <section><h2>Refund handling</h2><p>Eligible refunds, reversals and payment disputes will be handled according to the final operating entity's policy, applicable law and Razorpay's payment processes. The final support contact and refund window should be published before launch.</p></section>
  </LegalLayout>;
}
