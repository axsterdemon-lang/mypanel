import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';

export const metadata: Metadata = {
  title: 'Return / Refund Policy | Axster Panels',
  description: 'Returns, cancellations and refunds for digital products purchased from Axster Panels.',
};

export default function RefundPolicy() {
  return <PolicyPage title="Return / Refund Policy" intro="This policy applies to digital products and access purchased through Axster Panels at axsterpanelstore.netlify.app. Please read the product description, supported device and these conditions before paying." sections={[
    { title: 'Digital products and returns', paragraphs: [
      'Our store supplies digital products, codes or access rather than physical goods. There is no physical return shipment or return postage. Contact support before sending back or sharing any access code or downloaded file.',
      'A change-of-mind refund is generally unavailable after a working digital code, download or access has been supplied or activated. This does not exclude a remedy for non-delivery, a defective or incorrectly supplied product, or any rights that cannot lawfully be excluded.',
    ] },
    { title: 'When you can request a refund', paragraphs: [
      'You may request a refund for a duplicate payment for the same order, a confirmed payment for an order we cannot fulfil, an incorrect product supplied by us, or a product that materially fails to match its description or cannot be made to work on the device and setup stated as supported at the time of purchase.',
      'For an access or technical issue, we may first offer troubleshooting, restored access or a suitable replacement. If we cannot resolve an eligible issue within a reasonable time, a refund is available. If we cancel an order after receiving payment and before supplying it, we will refund the payment.',
    ] },
    { title: 'Cancellation before delivery', paragraphs: [
      'Contact us as soon as possible if you want to cancel an order that has not yet been supplied or activated. We will check its fulfilment status and confirm the cancellation and any refund due. A request does not itself confirm that an order has been cancelled.',
    ] },
    { title: 'How to request help', paragraphs: [
      'Contact us on WhatsApp at +94 77 498 1339. Provide the order reference, product and device, payment date and amount, transaction reference, and a description of the problem. For a technical issue, include a screenshot that does not expose passwords or private access codes.',
      'Please report issues promptly so that we can investigate. We review each request against the order, delivery information and actual incoming payment, and communicate the outcome through the support conversation. A payment slip or OCR result alone does not establish that funds were received.',
    ] },
    { title: 'Refund method and timing', paragraphs: [
      'An approved refund is normally sent through the original payment method to the original payer, where supported. If that is not possible, we will agree an appropriate verified alternative with the payer before sending it. Refunds are handled by support; submitting a request does not initiate an automatic refund.',
      'We will confirm the amount and expected processing time when the refund is approved. Banks and payment providers can take additional time to credit funds. Any proposed deduction or currency conversion will be explained before an alternative refund arrangement is agreed; we will not deduct fees where doing so would conflict with applicable rights.',
    ] },
    { title: 'Your rights', paragraphs: [
      'This policy does not limit mandatory consumer rights or remedies available under applicable law. Keep your order and payment records until the matter is resolved. Changes to this policy apply prospectively and do not remove rights relating to an existing purchase.',
    ] },
  ]} />;
}
