import React, { useState } from 'react';
import { Search, Map, BarChart3, ArrowRight, X, GitBranch, Database, Cog, FileText, CheckCircle } from 'lucide-react';

const BlueprintGrid = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
       style={{ 
         backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)', 
         backgroundSize: '30px 30px' 
       }}>
  </div>
);

const DiscoveryDiagram = () => (
  <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-fade-in relative z-10">
    <div className="text-center mb-10">
      <h4 className="text-xl font-bold text-slate-900 dark:text-white font-display">Workflow Audit Blueprint</h4>
      <p className="text-sm text-slate-500">Mapping your data flow to identify bottlenecks.</p>
    </div>
    
    <div className="relative flex items-center justify-center w-full max-w-lg gap-4 md:gap-8">
      <div className="flex flex-col items-center gap-2 relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-lg transition-transform hover:scale-110 duration-300">
          <Database className="w-8 h-8 text-slate-500" />
        </div>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Inputs</span>
      </div>

      <div className="h-1 w-12 md:w-24 bg-slate-200 dark:bg-slate-700 relative overflow-hidden rounded-full">
        <div className="absolute top-0 left-0 h-full w-1/2 bg-brand-500 animate-[marquee_2s_linear_infinite]"></div>
      </div>

      <div className="flex flex-col items-center gap-2 relative z-10">
        <div className="w-24 h-24 rounded-2xl bg-brand-600 flex items-center justify-center shadow-xl shadow-brand-500/30 ring-4 ring-brand-100 dark:ring-brand-900/30 transition-transform hover:scale-110 duration-300">
          <Cog className="w-12 h-12 text-white animate-spin-slow" />
        </div>
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">AI Analysis</span>
      </div>

      <div className="h-1 w-12 md:w-24 bg-slate-200 dark:bg-slate-700 relative overflow-hidden rounded-full">
        <div className="absolute top-0 left-0 h-full w-1/2 bg-brand-500 animate-[marquee_2s_linear_infinite] [animation-delay:0.5s]"></div>
      </div>

      <div className="flex flex-col items-center gap-2 relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border-2 border-brand-500 flex items-center justify-center shadow-lg transition-transform hover:scale-110 duration-300">
          <FileText className="w-8 h-8 text-brand-600" />
        </div>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Strategy</span>
      </div>
    </div>
    
    <div className="mt-10 bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 max-w-md w-full shadow-lg">
      <ul className="space-y-3">
        <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-3 text-brand-500" /> Identify manual data entry points</li>
        <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-3 text-brand-500" /> Map customer communication touchpoints</li>
        <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-3 text-brand-500" /> Calculate potential ROI of automation</li>
      </ul>
    </div>
  </div>
);

const RoadmapDiagram = () => (
  <div className="w-full h-full p-6 animate-fade-in flex flex-col justify-center relative z-10">
     <div className="text-center mb-10">
      <h4 className="text-xl font-bold text-slate-900 dark:text-white font-display">Execution Timeline</h4>
      <p className="text-sm text-slate-500">A clear 90-day path to full automation.</p>
    </div>

    <div className="space-y-8 max-w-lg mx-auto w-full">
      <div className="group">
        <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide text-slate-500 group-hover:text-brand-600 transition-colors">
          <span>Month 1: Foundation</span>
          <span>4 Weeks</span>
        </div>
        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
          <div className="h-full bg-gradient-to-r from-brand-400 to-brand-500 w-full rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] animate-[slideUp_1s_ease-out]"></div>
        </div>
        <p className="text-xs mt-2 text-slate-400 font-medium">CRM Setup, Data Migration, Voice Agent Training</p>
      </div>

      <div className="group">
        <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide text-slate-500 group-hover:text-indigo-600 transition-colors">
          <span>Month 2: Integration</span>
          <span>4 Weeks</span>
        </div>
        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 flex shadow-inner">
           <div className="h-full bg-transparent w-[10%]"></div>
           <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 w-[90%] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-[slideUp_1.2s_ease-out]"></div>
        </div>
        <p className="text-xs mt-2 text-slate-400 font-medium">SMS Flows, Website Chatbot, Soft Launch</p>
      </div>

      <div className="group">
        <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide text-slate-500 group-hover:text-purple-600 transition-colors">
          <span>Month 3: Scale</span>
          <span>Ongoing</span>
        </div>
        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 flex shadow-inner">
           <div className="h-full bg-transparent w-[30%]"></div>
           <div className="h-full bg-gradient-to-r from-purple-400 to-purple-500 w-[70%] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-[slideUp_1.4s_ease-out]"></div>
        </div>
        <p className="text-xs mt-2 text-slate-400 font-medium">A/B Testing, Optimization, Ad Scaling</p>
      </div>
    </div>
  </div>
);

const GrowthDiagram = () => (
  <div className="w-full h-full p-4 animate-fade-in flex flex-col items-center justify-center relative z-10">
    <div className="text-center mb-6">
      <h4 className="text-xl font-bold text-slate-900 dark:text-white font-display">Revenue Impact</h4>
      <p className="text-sm text-slate-500">Continuous optimization for maximum conversion.</p>
    </div>

    <div className="relative w-full max-w-lg h-64 border-l-2 border-b-2 border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-tr-3xl">
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none opacity-10">
        {[...Array(6)].map((_, i) => <div key={`v-${i}`} className="border-r border-slate-500 h-full"></div>)}
        {[...Array(4)].map((_, i) => <div key={`h-${i}`} className="border-b border-slate-500 w-full"></div>)}
      </div>
      
      <svg className="absolute inset-0 w-full h-full overflow-visible p-4" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="manualGradient" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3"/>
             <stop offset="100%" stopColor="#94a3b8" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        <path d="M0 20 C 30 20, 50 60, 100 90" fill="url(#manualGradient)" stroke="none" />
        <path d="M0 20 C 30 20, 50 60, 100 90" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,5" />

        <path d="M0 90 C 40 80, 50 40, 100 10" fill="url(#growthGradient)" stroke="none" />
        <path d="M0 90 C 40 80, 50 40, 100 10" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" className="drop-shadow-lg" />
        
        <circle cx="100" cy="10" r="3" className="fill-brand-600 animate-pulse" />
      </svg>
      
      <div className="absolute -left-10 top-4 text-xs font-bold text-slate-400">High</div>
      <div className="absolute -left-10 bottom-4 text-xs font-bold text-slate-400">Low</div>
      <div className="absolute -bottom-6 left-4 text-xs font-bold text-slate-400">Launch</div>
      <div className="absolute -bottom-6 right-4 text-xs font-bold text-slate-400">Month 3</div>
    </div>
    
    <div className="flex gap-8 mt-8 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-lg border border-slate-100 dark:border-white/5">
      <div className="flex items-center text-xs font-bold text-slate-600 dark:text-slate-300">
        <div className="w-3 h-3 bg-brand-500 rounded-full mr-2 shadow-[0_0_8px_#0ea5e9]"></div>
        Automated Leads
      </div>
      <div className="flex items-center text-xs font-bold text-slate-400">
        <div className="w-3 h-3 bg-slate-400 rounded-full mr-2 border border-slate-300"></div>
        Manual Effort
      </div>
    </div>
  </div>
);

export const Process: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const steps = [
    { 
      id: 1,
      icon: Search,
      title: 'Discovery & Readiness', 
      desc: 'We audit your current workflows to identify high-impact automation opportunities. We tell you what to automate first and why.',
      label: 'View Blueprint'
    },
    { 
      id: 2,
      icon: Map, 
      title: 'Strategic Roadmap', 
      desc: 'We build a 30-90 day implementation plan. No guesswork. Just a clear path to integrating Voice, Chat, and CRM systems.',
      label: 'View Timeline'
    },
    { 
      id: 3,
      icon: BarChart3, 
      title: 'Optimization & Growth', 
      desc: 'We don’t just launch and leave. We split-test, monitor performance, and optimize your agents for maximum conversion.',
      label: 'View Projections'
    }
  ];

  return (
    <section id="process" className="py-24 bg-white dark:bg-dark-bg border-t border-slate-100 dark:border-dark-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-brand-600 dark:text-brand-500 font-semibold tracking-wide uppercase text-sm mb-3">Our Process</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            From Discovery to <span className="text-brand-600">Domination</span>
          </h3>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-200 via-brand-200 to-slate-200 dark:from-slate-800 dark:via-brand-900 dark:to-slate-800 z-0"></div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="group relative flex flex-col items-center text-center">
                
                <button 
                  onClick={() => setSelectedStep(step.id)}
                  className="w-24 h-24 bg-white dark:bg-dark-bg rounded-full flex items-center justify-center mb-8 border-4 border-slate-50 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-all duration-300 group-hover:border-brand-500 group-hover:scale-110 relative z-10 cursor-pointer outline-none focus:ring-4 focus:ring-brand-500/20"
                >
                  <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="absolute -bottom-2 px-3 py-1 bg-brand-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                    {step.label}
                  </div>
                </button>

                <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-dark-card transition-colors duration-300 w-full">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {step.desc}
                  </p>
                </div>

                {idx !== steps.length - 1 && (
                  <div className="md:hidden mt-12 mb-4 text-slate-300 dark:text-slate-700">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedStep && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedStep(null)}
          ></div>
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl min-h-[500px] rounded-3xl shadow-2xl overflow-hidden animate-slide-up ring-1 ring-white/10 flex flex-col">
            <button 
              onClick={() => setSelectedStep(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10 z-20"
            >
              <X size={20} />
            </button>
            
            <div className="flex-1 relative bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-dark-card dark:via-dark-bg dark:to-slate-900 overflow-hidden">
              <BlueprintGrid />
              
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              {selectedStep === 1 && <DiscoveryDiagram />}
              {selectedStep === 2 && <RoadmapDiagram />}
              {selectedStep === 3 && <GrowthDiagram />}
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 text-center relative z-10">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Sentient Partners Intelligence System
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};