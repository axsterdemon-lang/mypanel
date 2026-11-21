import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './PolicyPage.module.css';

export type PolicySection = { title: string; paragraphs: string[] };
export const policyLinks = [
  { href: '/refund-policy', label: 'Return / Refund Policy' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Business Terms & Conditions' },
];

export default function PolicyPage({ title, intro, sections }: { title: string; intro: string; sections: PolicySection[] }) {
  return <main className={styles.page}>
    <Header />
    <article className={styles.article}>
      <Link href="/" className={styles.back}>← Back to home</Link>
      <p className={styles.eyebrow}>AXSTER PANELS · STORE POLICIES</p>
      <h1>{title}</h1>
      <p className={styles.date}>Effective date: 22 November 2026 · Last updated: 22 November 2026</p>
      <p className={styles.intro}>{intro}</p>
      <nav className={styles.links} aria-label="Store policies">
        {policyLinks.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
      <div className={styles.body}>
        {sections.map((section, index) => <section key={section.title}>
          <h2>{index + 1}. {section.title}</h2>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </section>)}
        <section className={styles.contact}>
          <h2>Contact Axster Panels</h2>
          <p>For order support, refund requests or privacy enquiries, contact us by phone or WhatsApp. Include your order reference so we can locate your purchase.</p>
          <a href="tel:+94774981339">Phone: +94 77 498 1339</a>
          <a href="https://wa.me/94774981339" target="_blank" rel="noopener noreferrer">WhatsApp: 077 498 1339 ↗</a>
          <p>Please do not send passwords, OTPs, full card numbers or card security codes.</p>
        </section>
      </div>
    </article>
    <Footer />
  </main>;
}
