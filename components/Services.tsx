import React, { useState } from 'react';
import { SERVICES } from '../constants';
import { CheckCircle2, ArrowRight, RotateCcw, Zap } from 'lucide-react';

export const Services: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling if nested
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="services" className="py-24 bg-slate-50 dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-600 dark:text-brand-500 font-semibold tracking-wide uppercase text-sm mb-3">Core Services</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
            Everything You Need to <br/>
            <span className="text-slate-400 dark:text-slate-500">Scale Automatically</span>
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
             We integrate cutting-edge AI directly into your existing workflow, replacing manual grunt work with instant, 24/7 performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {SERVICES.map((service, index) => {
            // Bento Grid Logic
            let colSpan = "md:col-span-1";
            if (index === 0) colSpan = "md:col-span-2";
            if (index === 3) colSpan = "md:col-span-2";
            if (index === 5) colSpan = "md:col-span-2";

            const isDarkCard = index === 0 || index === 5;
            const isFlipped = flippedCards[service.id];
            
            return (
              <div 
                key={service.id}
                className={`${colSpan} group h-full cursor-pointer [perspective:1000px] min-h-[320px]`}
                onClick={(e) => toggleFlip(service.id, e)}
              >
                <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                  
                  {/* FRONT FACE */}
                  <div className={`
                    w-full h-full rounded-3xl p-8 overflow-hidden [backface-visibility:hidden]
                    flex flex-col
                    ${isDarkCard 
                      ? 'bg-slate-900 text-white shadow-2xl shadow-brand-900/20' 
                      : 'bg-white dark:bg-dark-card text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-dark-border'
                    }
                  `}>
                    {/* Background Gradients for "Dark" emphasized cards */}
                    {isDarkCard && (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    )}

                    <div className="relative z-10 h-full flex flex-col">
                      <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110
                        ${isDarkCard ? 'bg-white/10 text-brand-400' : 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'}
                      `}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      
                      <h4 className={`text-2xl font-bold mb-3 ${isDarkCard ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {service.title}
                      </h4>
                      
                      <p className={`mb-6 leading-relaxed flex-grow ${isDarkCard ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                        {service.description}
                      </p>
                      
                      <div className="space-y-3 mt-auto">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm font-medium opacity-90">
                            <CheckCircle2 className={`w-4 h-4 mr-2 ${isDarkCard ? 'text-brand-400' : 'text-brand-500'}`} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Click indicator */}
                      <div className="absolute bottom-1 right-1">
                         <div className={`
                           p-2 rounded-full transition-all duration-300
                           ${isDarkCard ? 'bg-white/10 text-white' : 'bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-white'}
                           group-hover:translate-x-1 group-hover:shadow-lg
                         `}>
                           <ArrowRight className="w-5 h-5" />
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div className={`
                    absolute inset-0 w-full h-full rounded-3xl p-8 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]
                    bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 text-white shadow-2xl
                  `}>
                    <div className="absolute inset-0 bg-brand-500/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-brand-400">
                          <Zap size={18} />
                          <span className="text-xs font-bold tracking-widest uppercase">Deep Dive</span>
                        </div>
                        <button 
                          onClick={(e) => toggleFlip(service.id, e)}
                          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                        >
                          <RotateCcw size={16} />
                        </button>
                      </div>

                      <h4 className="text-xl font-bold text-white mb-2 leading-tight">
                        {service.details.heading}
                      </h4>
                      
                      <div className="mb-6">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Use Case</span>
                         <p className="text-slate-300 text-sm mt-1 leading-relaxed border-l-2 border-brand-500/50 pl-3">
                           {service.details.useCase}
                         </p>
                      </div>

                      <div className="mt-auto">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 block">Key Benefits</span>
                        <ul className="space-y-3">
                          {service.details.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start text-sm text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 mr-2.5 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.5)]"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};