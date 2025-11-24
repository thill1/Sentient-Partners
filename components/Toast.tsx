import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const Toast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { message, type } = event.detail;
      const id = Date.now().toString();
      setToasts(prev => [...prev, { id, message, type }]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    };

    window.addEventListener('show-toast', handleToast as EventListener);
    return () => window.removeEventListener('show-toast', handleToast as EventListener);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 z-[70] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`pointer-events-auto flex items-center p-4 rounded-xl shadow-lg border backdrop-blur-md animate-slide-up max-w-sm w-full transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-50/90 dark:bg-green-900/40 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200' :
            toast.type === 'error' ? 'bg-red-50/90 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200' :
            'bg-slate-50/90 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className="mr-3 shrink-0">
            {toast.type === 'success' && <CheckCircle size={20} />}
            {toast.type === 'error' && <AlertCircle size={20} />}
            {toast.type === 'info' && <Info size={20} />}
          </div>
          <p className="text-sm font-medium mr-4">{toast.message}</p>
          <button 
            onClick={() => removeToast(toast.id)}
            className="ml-auto p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};