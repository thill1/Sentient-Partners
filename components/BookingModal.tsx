import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { BOOKING_URL } from '../constants';

export const BookingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(BOOKING_URL);

  useEffect(() => {
    const handleOpen = (event: CustomEvent) => {
      // If the event brings a specific URL (from AI), use it. Otherwise use default.
      if (event.detail && event.detail.url) {
        setCurrentUrl(event.detail.url);
      } else {
        setCurrentUrl(BOOKING_URL);
      }
      setIsOpen(true);
    };

    // Use proper typing for CustomEvent if possible, or cast as any for TS
    window.addEventListener('open-booking-modal', handleOpen as EventListener);
    return () => window.removeEventListener('open-booking-modal', handleOpen as EventListener);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={() => setIsOpen(false)} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up ring-1 ring-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-dark-card shrink-0">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
             <h3 className="font-bold text-lg text-slate-900 dark:text-white">Schedule Discovery Call</h3>
           </div>
           <button 
             onClick={() => setIsOpen(false)} 
             className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-slate-400"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Iframe */}
        <div className="flex-1 w-full h-full bg-white">
          <iframe
            src={currentUrl}
            className="w-full h-full"
            frameBorder="0"
            title="Cal.com Booking"
            allow="camera; microphone; autoplay; fullscreen"
          />
        </div>
      </div>
    </div>
  );
};