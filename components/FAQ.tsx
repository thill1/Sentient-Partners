import React, { useState } from 'react';
import { FAQS } from '../constants';
import { Plus, Minus } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Common Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Everything you need to know about automating your business.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index} 
              className="border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-500/50 dark:hover:border-brand-500/50"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-slate-900 dark:text-white pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-brand-600 shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};