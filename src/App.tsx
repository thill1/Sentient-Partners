import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { DemoSection } from './components/DemoSection';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { CTASection } from './components/CTASection';
import { Process } from './components/Process';
import { ChatInterface } from './components/ChatInterface';
import { BookingModal } from './components/BookingModal';
import { ContactModal } from './components/ContactModal';
import { Toast } from './components/Toast';

function App() {
  return (
    <div className="min-h-screen selection:bg-brand-500 selection:text-white font-sans relative">
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <DemoSection />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
      {/* Global Overlays */}
      <ChatInterface />
      <BookingModal />
      <ContactModal />
      <Toast />
    </div>
  );
}

export default App;