import type { Metadata } from 'next';
import PolicyPage from '@/components/legal/PolicyPage';

export const metadata: Metadata = {
  title: 'Privacy Policy | Axster Panels',
  description: 'How Axster Panels handles orders, payment slips, browser storage and support information.',
};

export default function PrivacyPolicy() {
  return <PolicyPage title="Privacy Policy" intro="This policy explains how Axster Panels handles information when you browse this website, place an order, upload a payment slip or contact the store. For privacy questions and requests, contact +94 77 498 1339 on WhatsApp." sections={[
    { title: 'Information we handle', paragraphs: [
      'Order records include the product, selected device, payment method, amount, currency, order reference, creation time, payment status and review notes. If you submit a slip, we receive the uploaded file, transaction account or receiving number, amount, date, time, reference, and any extracted receipt text you submit. A slip may also contain your name, bank details or other information visible in the document.',
      'Support conversations contain the information you choose to send. The reseller application form asks for name, age, address, phone number and email; submitting it opens WhatsApp with these details in a prepared message. WhatsApp receives the information you choose to send through its service.',
      'Hosting and security services may process IP addresses, request details, browser information and technical logs. The payment service uses hashed network identifiers and transaction or file fingerprints to help limit abuse and detect reused submissions.',
    ] },
    { title: 'Why we use this information', paragraphs: [
      'If you choose to submit a reseller application, its name, age, phone number, email and address are placed in a pre-filled WhatsApp message. Sending that message shares those details with the recipient through WhatsApp. Support conversations may also contain the contact and order details you choose to share.',
      'We use necessary information to create and manage orders, reconcile incoming payments, provide products and support, investigate refund requests, prevent fraud and maintain the website. We also use information when needed to meet applicable recordkeeping obligations or resolve disputes.',
      'Only send information needed for the request. Never upload a card security code, password or one-time passcode. You may redact unrelated transactions from a slip while leaving the information required to identify your payment readable.',
    ] },
    { title: 'Slip reading and payment review', paragraphs: [
      'Optional image text recognition runs in your browser and may download OCR software and language assets. When you submit the payment form, the slip, entered fields and extracted text are sent to our payment service for review. The current slip-reading feature does not send your slip to an external generative AI service.',
      'Matching text is review evidence rather than automatic confirmation of payment. Store staff must check the actual incoming transaction before approving a receipt-based payment.',
    ] },
    { title: 'Storage, cookies and device data', paragraphs: [
      'The site stores order references and customer access tokens in your browser local storage so you can return to your order. Treat this browser access as private. Clearing site storage can remove your ability to reopen an order from that browser; contact support with your order reference if you need assistance.',
      'The feedback feature currently saves submitted names, comments and selected photos in local storage on the browser used to submit them; it does not provide a shared server review database. Owner payment administration uses a session cookie. These features can be managed through your browser site-data settings.',
    ] },
    { title: 'Service providers and external links', paragraphs: [
      'The website and production payment records are hosted using Netlify services, including private storage for submitted slips. Technical providers may process data outside Sri Lanka. Authorized store administrators can access payment records for review and support.',
      'Banks, eZ Cash, Binance and WhatsApp process transactions or communications under their own terms and privacy policies. External image and OCR asset providers may receive normal network request information when their resources load. We may disclose relevant records where required by law or needed to investigate fraud or protect legal rights. We do not sell customer personal information.',
      'This site does not currently provide a live card checkout. If a card gateway is introduced, its handling of card data will be disclosed before use. Do not send card details through our support chat or slip upload.',
    ] },
    { title: 'Retention and security', paragraphs: [
      'We retain order, payment and support records as needed to fulfil purchases, handle refunds and disputes, prevent fraud and meet applicable obligations. There is currently no automatic receipt-deletion schedule; deletion requests require review by the store. Browser-stored information remains until removed by you or your browser.',
      'Submitted slips use private server storage and restricted administrative access. No internet transmission or storage system is guaranteed to be completely secure. Protect your device and do not share order access tokens.',
    ] },
    { title: 'Your requests and policy changes', paragraphs: [
      'Contact +94 77 498 1339 to request access, correction or deletion of information, or to raise a privacy concern. We may need reasonable verification before acting. Some records may need to be retained for a dispute, security purpose or legal obligation; we will explain any applicable restriction.',
      'Please avoid submitting personal information about other people without authority. We do not knowingly seek personal information from children; a parent or guardian can contact us about information submitted by a child. Updates to this policy will appear here with a revised date.',
    ] },
  ]} />;
}
