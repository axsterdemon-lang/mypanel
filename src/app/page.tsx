import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import HowItWorksSection from '@/app/components/HowItWorksSection';
import FeaturedPanelsSection from '@/app/components/FeaturedPanelsSection';
import TrustStatsSection from '@/app/components/TrustStatsSection';
import TestimonialsSection from '@/app/components/TestimonialsSection';
import CustomerFeedback from '@/app/components/CustomerFeedback';
import ResellerApplicationSection from '@/app/components/ResellerApplicationSection';

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <Header />
      <HeroSection />
      <CustomerFeedback />
      <HowItWorksSection />
      <FeaturedPanelsSection />
      <TrustStatsSection />
      <TestimonialsSection />
      <ResellerApplicationSection />
      <Footer />
    </main>
  );
}