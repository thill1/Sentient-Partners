import React from 'react';
import { Mail, Linkedin, Facebook, Instagram } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';

const XIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-label="X"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer: React.FC = () => {
  const handleBookCall = () => {
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  };

  const handleContact = () => {
    window.dispatchEvent(new CustomEvent('open-contact-modal'));
  };

  const handleServiceClick = (e: React.MouseEvent, serviceId: string) => {
    e.preventDefault();
    const event = new CustomEvent('open-service-modal', { 
      detail: { id: serviceId } 
    });
    window.dispatchEvent(event);
  };

  const footerServices = [
    { name: 'AI Voice Agents', id: 'voice' },
    { name: 'Chat Automation', id: 'chat' },
    { name: 'Web Development', id: 'web' },
    { name: 'CRM Systems', id: 'crm' },
    { name: 'Reputation Management', id: 'reputation' },
    { name: 'Consulting', id: 'strategy' }
  ];

  return (
    <footer id="contact" className="bg-white dark:bg-dark-bg border-t border-slate-200 dark:border-dark-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          <div className="md:col-span-5">
            <div className="flex items-center mb-6">
              <div className="mr-4 shrink-0">
                <Logo className="h-10" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Sentient<span className="text-brand-600">Partners</span>
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">
              Empowering businesses with next-generation AI automation. 
              We build the systems that build your revenue.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 text-slate-400 hover:text-brand-600 transition-colors" aria-label="Facebook">
                <Facebook size={20}/>
              </a>
              <a href="#" className="p-2 text-slate-400 hover:text-brand-600 transition-colors" aria-label="Instagram">
                <Instagram size={20}/>
              </a>
              <a href="#" className="p-2 text-slate-400 hover:text-brand-600 transition-colors" aria-label="X">
                <XIcon className="w-5 h-5"/>
              </a>
              <a href="#" className="p-2 text-slate-400 hover:text-brand-600 transition-colors" aria-label="LinkedIn">
                <Linkedin size={20}/>
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Services</h4>
            <ul className="space-y-4">
              {footerServices.map((item) => (
                <li key={item.id}>
                  <a 
                    href={`#service-${item.id}`}
                    onClick={(e) => handleServiceClick(e, item.id)}
                    className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 text-sm transition-colors cursor-pointer block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Ready to Scale?</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Book a discovery call to see how we can automate your workflow.
            </p>
            <div className="space-y-4">
              <Button className="w-full justify-center" onClick={handleBookCall}>
                Book Strategy Call
              </Button>
              <button 
                onClick={handleContact}
                className="flex items-center text-sm text-slate-500 dark:text-slate-500 justify-center mt-4 hover:text-brand-600 dark:hover:text-brand-400 transition-colors w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                hello@sentientpartners.com
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-dark-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Sentient Partners. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};