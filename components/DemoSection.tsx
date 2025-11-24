import React from 'react';
import { Button } from './Button';
import { MessageSquare, Zap } from 'lucide-react';

export const DemoSection: React.FC = () => {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-sentient-chat'));
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 bg-white dark:bg-dark-card rounded-3xl p-8 md:p-16 border border-slate-200 dark:border-dark-border shadow-2xl text-center overflow-hidden">
          {/* Abstract Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none">
            <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-[200px] -left-[200px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]"></div>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
              <Zap size={16} />
              <span>Interactive Live Demo</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              See the Agent in Action
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
              We've deployed a live version of our Sentient Agent on this page. 
              Click the button below to open the floating interface and experience real-time voice and text automation.
            </p>

            <Button 
              size="lg" 
              onClick={openChat}
              className="px-10 py-4 text-lg shadow-xl shadow-brand-500/30 hover:scale-105 transition-transform"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Launch Interactive Demo
            </Button>
            
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              Try asking: "What time is it in Tokyo?" or "Book an appointment."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};