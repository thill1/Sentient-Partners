import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ArrowRight, Calendar } from 'lucide-react';

const SOLUTIONS = [
  "Intelligent Voice Receptionists",
  "24/7 SMS Lead Qualification",
  "Automated Revenue Pipelines",
  "5-Star Reputation Management",
  "Smart CRM Optimization"
];

export const CTASection: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SOLUTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-sentient-chat'));
  };
  
  const openBooking = () => {
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-900 dark:bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 to-purple-900/50 opacity-50"></div>
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-brand-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Ready to Automate Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
            Revenue Engine?
          </span>
        </h2>
        
        {/* Rotating Solutions Text */}
        <div className="h-40 flex items-center justify-center mb-8 overflow-hidden">
          <div key={index} className="animate-slide-up">
            <div className="p-[3px] rounded-full bg-gradient-to-r from-brand-400 via-purple-500 to-brand-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <span className="block px-12 py-6 rounded-full bg-slate-900/90 backdrop-blur-xl text-xl md:text-4xl font-light text-white tracking-wide whitespace-nowrap">
                {SOLUTIONS[index]}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Stop losing leads to missed calls and slow follow-ups. Let's build your custom AI implementation roadmap today.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto text-lg px-8 py-4"
            onClick={openBooking}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book Your Strategy Call
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10 dark:hover:bg-white/10"
            onClick={openChat}
          >
            Try the Demo Again
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <p className="mt-8 text-sm text-slate-400">
          No commitment required. 100% free discovery session.
        </p>
      </div>
    </section>
  );
};