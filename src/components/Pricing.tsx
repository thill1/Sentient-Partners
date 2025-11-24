import React from 'react';
import { Button } from './Button';
import { Check, Sparkles } from 'lucide-react';
import { PRICING_PLANS } from '../constants';

export const Pricing: React.FC = () => {
  const openBooking = () => {
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  };

  const openContact = () => {
    window.dispatchEvent(new CustomEvent('open-contact-modal'));
  };

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-dark-bg border-t border-slate-100 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-brand-600 dark:text-brand-500 font-semibold tracking-wide uppercase text-sm mb-3">Pricing Plans</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
            Invest in Systems,<br/>
            <span className="text-slate-400">Not Overhead</span>
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Replace the cost of 3 full-time employees with one intelligent system. Simple, transparent pricing with no hidden implementation fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PRICING_PLANS.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.highlight 
                  ? 'bg-slate-900 text-white shadow-2xl scale-105 border-2 border-brand-500 z-10' 
                  : 'bg-slate-50 dark:bg-dark-card text-slate-900 dark:text-white border border-slate-200 dark:border-dark-border hover:shadow-lg'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                  <Sparkles className="w-3 h-3 mr-1" /> Most Popular
                </div>
              )}

              <h4 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {plan.name}
              </h4>
              <p className={`text-sm mb-6 h-10 ${plan.highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                {plan.description}
              </p>
              
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className={`ml-1 text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{plan.period}</span>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check className={`w-5 h-5 mr-3 shrink-0 ${plan.highlight ? 'text-brand-400' : 'text-brand-600 dark:text-brand-500'}`} />
                    <span className={`text-sm ${plan.highlight ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.highlight ? 'primary' : 'outline'} 
                className={`w-full ${plan.highlight ? 'bg-white text-slate-900 hover:bg-slate-100' : ''}`}
                onClick={plan.name === "Enterprise" ? openContact : openBooking}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                Need a custom implementation roadmap? <button onClick={openBooking} className="text-brand-600 underline hover:text-brand-500">Book a free strategy call</button> to discuss your needs.
            </p>
        </div>
      </div>
    </section>
  );
};