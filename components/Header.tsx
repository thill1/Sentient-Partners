import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { Button } from './Button';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Banner text configuration
  const bannerText = "Limited Time Offer - Free 2nd Month - Ends 12/31/25";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Check initial theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleBookCall = () => {
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 flex flex-col ${
        isScrolled 
          ? 'glass-panel border-b border-slate-200 dark:border-dark-border shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      {/* Static Banner */}
      <div className="bg-slate-900 dark:bg-brand-900 text-white py-2.5 relative z-[51] shrink-0 border-b border-white/10 flex justify-center items-center px-4">
        <span className="text-xs font-bold tracking-widest uppercase text-center">
          {bannerText}
        </span>
      </div>

      {/* Main Navigation */}
      <div className={`w-full transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center cursor-pointer group shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
              <div className="transition-transform duration-300 group-hover:scale-105 mr-3 flex items-center shrink-0">
                <Logo className="h-10 md:h-12" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Sentient<span className="text-brand-600 dark:text-brand-500">Partners</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Button size="sm" onClick={handleBookCall}>
                Book Strategy Call
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-900 dark:text-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-panel border-b border-slate-200 dark:border-dark-border shadow-xl animate-fade-in">
          <div className="px-4 py-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-base font-medium text-slate-900 dark:text-white hover:text-brand-600"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4">
              <Button className="w-full" onClick={() => {
                setIsMobileMenuOpen(false);
                handleBookCall();
              }}>
                Book Strategy Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}