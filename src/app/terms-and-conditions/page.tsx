import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';

export const metadata: Metadata = {
  title: 'Business Terms & Conditions | Axster Panels',
  description: 'Terms for using Axster Panels and purchasing digital products, including pricing, payments and delivery.',
};

export default function Terms() {
  return <PolicyPage title="Business Terms & Conditions" intro="These terms apply to the Axster Panels online store at axsterpanelstore.netlify.app and purchases of its digital products. Read them together with our Return / Refund Policy and Privacy Policy before placing an order." sections={[
    { title: 'Store and customer contact', paragraphs: [
      'Axster Panels is the store name used on this website, also displayed as AXSTER 999 PANELS. Customer support, order enquiries, refund requests and privacy enquiries can be directed to +94 77 498 1339 on WhatsApp.',
      'You must be legally able to make the purchase, or have authorization from a parent or guardian where required. Supply accurate order information and use only payment methods you are authorized to use.',
    ] },
    { title: 'Products and compatibility', paragraphs: [
      'Products are digital software-related products, codes or access described in the relevant listing. Check the supported device, operating system, access period and setup requirements before paying. Ask support if anything is unclear. No physical item is shipped unless a listing expressly says otherwise.',
      'A lifetime label does not promise that a third-party game, platform or service will operate forever. Ask support to confirm the specific access period and limitations before buying. Changes made by third-party platforms can affect compatibility. These terms do not remove remedies where a supplied product fails to match what was agreed.',
      'We are not affiliated with Garena Free Fire. Third-party marks belong to their respective owners. We cannot guarantee a particular game result, uninterrupted third-party availability or freedom from account restrictions imposed by another platform.',
    ] },
    { title: 'Prices and payment', paragraphs: [
      'The checkout shows the amount and currency payable for the selected device and method. Bank and eZ Cash orders are quoted in LKR; Binance orders are quoted in USDT. Any store conversion is a pricing conversion displayed at checkout, rather than a live market exchange quote. Check the final total before transferring funds.',
      'Use only the receiving details displayed for your order and confirm the intended recipient in the payment provider before sending. Your payment provider may apply its own charges. The site currently supports receipt submission and manual review; it does not currently offer an active Visa or Mastercard gateway.',
      'A submitted slip does not by itself confirm cleared funds. False, altered or reused evidence may be rejected. If a payment is made but cannot be matched, contact support with the reference rather than paying again.',
    ] },
    { title: 'Order confirmation and digital delivery', paragraphs: [
      'An order reference records your purchase request. Receipt-based payments remain under review until the store confirms the incoming transaction. Payment approval is separate from delivery; the site does not automatically send a product after slip approval.',
      'Digital delivery or activation is arranged by the store after payment confirmation. Contact support with your order reference for the delivery method and expected time, and confirm any time-sensitive requirement before paying. Promotional delivery times are estimates, not a guarantee that manual payment review is immediate. Non-delivery is covered by our Return / Refund Policy.',
      'Keep your order reference and payment record. We may decline or cancel an order for unavailability, a material listing error or suspected unauthorized activity. We will explain the issue and refund a received payment where the order is not supplied; a price change requires your agreement before proceeding.',
    ] },
    { title: 'Use of products and website', paragraphs: [
      'Use products only where you have the required rights and permissions, and comply with applicable law and relevant platform rules. Do not use the site to distribute malware, access another person’s account, submit fraudulent payment evidence or infringe intellectual property rights.',
      'A purchase does not transfer ownership of third-party intellectual property or grant resale rights unless those rights are expressly included. Do not share private access codes or customer order tokens. A reseller application alone does not create a reseller agreement or grant permission to redistribute software.',
    ] },
    { title: 'Cancellations, returns and disputes', paragraphs: [
      'Our Return / Refund Policy explains cancellation before delivery, problems with digital access, duplicate payments and refund requests. Our Privacy Policy explains how order and support information is handled. Both are linked on this page and in the footer.',
      'Please contact support first so that we can investigate an order problem. This does not prevent you from using any complaint or dispute process available through your payment provider or applicable law.',
    ] },
    { title: 'Responsibility and applicable rights', paragraphs: [
      'You are responsible for checking compatibility and obtaining necessary permissions. We remain responsible for supplying what was agreed and for any obligations that cannot be excluded by law. Nothing here excludes liability or consumer rights that applicable law does not allow us to exclude.',
      'Applicable Sri Lankan law governs these terms, subject to any mandatory protections that apply to you. We will try to resolve complaints through support before either party uses an available legal remedy.',
    ] },
    { title: 'Changes to these terms', paragraphs: [
      'We may update these terms for future use of the site. The version in effect when an order is placed applies to that purchase unless a change is required by law or agreed with you. A revised date will be shown on this page.',
    ] },
  ]} />;
}
