import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import { ArrowRight, PlayCircle } from 'lucide-react';

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: {x: number, y: number, vx: number, vy: number}[] = [];
    // Adjust particle count based on screen size for performance
    const particleCount = Math.min(width * 0.15, 120); 

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3, // Slower, more elegant movement
        vy: (Math.random() - 0.5) * 0.3
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Check for Dark Mode to adjust colors
      const isDark = document.documentElement.classList.contains('dark');
      
      const particleColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(14, 165, 233, 0.4)'; // Brand Blue in light mode
      const lineColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(14, 165, 233, 0.1)';

      ctx.fillStyle = particleColor;
      ctx.strokeStyle = lineColor;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
       {/* Background Color Base */}
       <div className="absolute inset-0 bg-white dark:bg-dark-bg transition-colors duration-500"></div>
       
       {/* Canvas */}
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-100" />
       
       {/* Gradient Overlay for depth */}
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-dark-bg z-10"></div>
    </div>
  );
};

export const Hero: React.FC = () => {
  const openChat = () => {
    window.dispatchEvent(new CustomEvent('open-sentient-chat'));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
      
      <ParticleBackground />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up opacity-0 [animation-delay:200ms]">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-brand-50 dark:bg-white/5 text-brand-700 dark:text-brand-300 mb-8 border border-brand-100 dark:border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 bg-brand-500 rounded-full mr-2 animate-pulse"></span>
            The Future of Client Acquisition
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-8 animate-slide-up opacity-0 [animation-delay:400ms] leading-tight">
          We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">Sentient Systems</span><br />
          That Never Sleep
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 mb-10 animate-slide-up opacity-0 [animation-delay:600ms] leading-relaxed">
          Transform your business with AI voice agents, intelligent chatbots, and automated revenue systems. No tech expertise required.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up opacity-0 [animation-delay:800ms]">
          <Button size="lg" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            View Plans & Pricing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" onClick={openChat}>
            <PlayCircle className="mr-2 h-5 w-5" />
            Try Interactive Demo
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 dark:text-slate-600 z-20">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};