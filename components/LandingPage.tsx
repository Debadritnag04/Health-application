import React, { useState } from 'react';
import { ELEMENTS } from '../constants';

interface LandingPageProps {
  onEnter: () => void;
  t: any; // Translations
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, t }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 800); // Wait for transition animation
  };

  const text = t.landing;

  return (
    <div className={`relative min-h-screen bg-obsidian overflow-hidden flex flex-col items-center justify-center transition-opacity duration-1000 ${isExiting ? 'opacity-0 scale-105' : 'opacity-100'}`}>
      
      {/* Ambient Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center text-center">
        
        {/* HERO SECTION */}
        <div className="mb-24 animate-slide-up">
           <div className="inline-block mb-6 p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/5 shadow-2xl">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
               <span className="text-white font-bold text-2xl">Ah</span>
             </div>
           </div>
           <h1 className="text-5xl md:text-7xl font-display font-medium text-white mb-8 tracking-tight text-glow max-w-4xl mx-auto leading-tight">
             {text.headline}
           </h1>
           <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto mb-12">
             {text.subheadline}
           </p>
           
           <button
             onClick={() => {
                const el = document.getElementById('elements-section');
                el?.scrollIntoView({ behavior: 'smooth' });
             }}
             className="group relative px-8 py-4 bg-white text-obsidian rounded-full font-semibold text-lg tracking-wide hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
           >
             <span className="relative z-10">{text.enterBtn}</span>
           </button>
        </div>

        {/* ELEMENTS STORY SECTION */}
        <div id="elements-section" className="mb-32 w-full max-w-5xl opacity-0 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display text-white mb-4">{text.storyTitle}</h2>
            <p className="text-gray-400">{text.storyDesc}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.values(ELEMENTS).map((el, i) => {
              const Icon = el.icon;
              return (
                <div 
                  key={el.id} 
                  className="group relative p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-500 flex flex-col items-center text-center cursor-default"
                >
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 ${el.bg} ${el.color}`}>
                     <Icon className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2">{t.elements[el.id].name}</h3>
                   <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${el.gradientFrom.replace('/20','')} ${el.gradientTo.replace('/20','')} mb-3 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RESPONSIBLE AI SECTION */}
        <div className="mb-24 w-full max-w-4xl opacity-0 animate-slide-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
           <h2 className="text-2xl font-display text-gray-500 uppercase tracking-widest mb-12 text-center">{text.responsibleTitle}</h2>
           
           <div className="grid md:grid-cols-2 gap-6">
             {text.trustPoints.map((point: any, idx: number) => (
               <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                 <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                 <div className="text-left">
                   <h3 className="text-white font-bold text-lg mb-1">{point.title}</h3>
                   <p className="text-gray-400 text-sm">{point.desc}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* FINAL CTA */}
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <button
             onClick={handleEnter}
             className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-bold text-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300"
           >
             {text.dashboardBtn}
          </button>
          <p className="mt-4 text-gray-500 text-sm tracking-wide uppercase">{text.dashboardBtnSub}</p>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;