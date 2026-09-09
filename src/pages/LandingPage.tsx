import React, { useEffect, useState, useRef } from 'react';
import { Play, Database, Zap, AlertTriangle, Activity } from 'lucide-react';
import memoraLogo from '../assets/memora-logo.png';
import heroBg from '../assets/hero-bg.jpg';
import { NeuralBackground } from '../components/NeuralBackground';

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  const [bgMode, setBgMode] = useState<'HERO' | 'PLAYGROUND' | 'FAST_WEIGHT' | 'INTERFERENCE' | 'RETENTION'>('HERO');
  
  const heroRef = useRef<HTMLDivElement>(null);
  const playgroundRef = useRef<HTMLDivElement>(null);
  const fastWeightRef = useRef<HTMLDivElement>(null);
  const interferenceRef = useRef<HTMLDivElement>(null);
  const retentionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const wh = window.innerHeight;
      const offset = wh * 0.4;

      const getTop = (ref: React.RefObject<HTMLDivElement | null>) => 
        ref.current ? ref.current.getBoundingClientRect().top : Infinity;

      const pTop = getTop(playgroundRef);
      const fTop = getTop(fastWeightRef);
      const iTop = getTop(interferenceRef);
      const rTop = getTop(retentionRef);

      if (rTop < offset) setBgMode('RETENTION');
      else if (iTop < offset) setBgMode('INTERFERENCE');
      else if (fTop < offset) setBgMode('FAST_WEIGHT');
      else if (pTop < offset) setBgMode('PLAYGROUND');
      else setBgMode('HERO');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/30 relative">
      
      {/* High-Fidelity Spaceship Nebula Image Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-in-out"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          // Add a subtle zoom breathing effect based on mode
          transform: bgMode === 'HERO' ? 'scale(1.02)' : 'scale(1.05)'
        }}
      />
      
      {/* Dark gradient overlay for text readability when scrolling down */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#05000a]/50 to-[#05000a]/90" />

      {/* Animated Overlay (Synaptic Firing / Energy Particles) */}
      <NeuralBackground mode={bgMode} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 w-full flex justify-between items-center px-8 md:px-12 py-6 z-50">
        <div className="flex items-center gap-2">
          <img src={memoraLogo} alt="MEMORA" className="h-6 object-contain opacity-50 brightness-75 hover:opacity-100 hover:brightness-100 transition-all duration-300" />
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <button 
            onClick={onLaunch}
            className="bg-transparent border border-white/20 text-white/80 hover:bg-white/10 px-6 py-1.5 rounded-full transition-all font-mono text-xs tracking-widest backdrop-blur-md"
          >
            ENTER LAB
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-end px-8 md:px-12 lg:px-24 z-20">
        
        {/* Glassmorphic Main Card */}
        <div className="w-full max-w-2xl backdrop-blur-2xl bg-white/5 border border-white/20 p-10 md:p-12 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative mt-10 lg:mt-0">
          
          <div className="relative z-10 flex flex-col space-y-6">
            <div className="flex flex-col items-center lg:items-end">
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-white drop-shadow-2xl leading-none">
                MEMORA-X
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-cyan-50/90 tracking-tight drop-shadow-lg mt-2">
                AI Memory Lab
              </h2>
            </div>
            
            <p className="text-base md:text-lg text-[#a1a1aa] leading-relaxed font-light mt-8 mb-8 text-center px-4">
              "Experiment with how AI learns, updates, remembers and forgets."
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <button 
                onClick={onLaunch}
                className="bg-[#27272a] hover:bg-[#3f3f46] border border-white/10 text-white px-8 py-3.5 rounded-[16px] text-xs font-bold transition-all flex items-center justify-center gap-2 tracking-widest shadow-lg hover:scale-105"
              >
                START EXPERIMENT
              </button>
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="bg-[#18181b] hover:bg-[#27272a] border border-white/5 text-white/80 px-8 py-3.5 rounded-[16px] text-xs font-bold transition-all flex items-center justify-center gap-2 tracking-widest"
              >
                EXPLORE MEMORY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Sections */}
      <div className="relative z-20 pb-40 space-y-64">
        
        <section ref={playgroundRef} className="min-h-[60vh] flex items-center justify-center px-8">
          <div className="w-full max-w-4xl bg-[#05000a]/80 backdrop-blur-xl border border-white/10 p-12 rounded-[2rem] text-center shadow-2xl transition-transform hover:scale-[1.02]">
            <Database className="w-12 h-12 text-cyan-400 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-bold mb-4 text-white">Memory Playground</h2>
            <p className="text-xl text-purple-100/70 max-w-2xl mx-auto">
              Watch nodes begin forming associations. Learn relationships between concepts using a fundamental recurrent neural architecture.
            </p>
          </div>
        </section>

        <section ref={fastWeightRef} className="min-h-[60vh] flex items-center justify-center px-8">
          <div className="w-full max-w-4xl bg-[#05000a]/80 backdrop-blur-xl border border-cyan-500/20 p-12 rounded-[2rem] text-center shadow-[0_0_50px_rgba(34,211,238,0.1)] transition-transform hover:scale-[1.02]">
            <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4 text-white">Fast Weight Lab</h2>
            <p className="text-xl text-cyan-100/70 max-w-2xl mx-auto">
              Connections become brighter and more dynamic. Adapt memory during inference without retraining the base model parameters.
            </p>
          </div>
        </section>

        <section ref={interferenceRef} className="min-h-[60vh] flex items-center justify-center px-8">
          <div className="w-full max-w-4xl bg-[#05000a]/80 backdrop-blur-xl border border-yellow-500/20 p-12 rounded-[2rem] text-center shadow-[0_0_50px_rgba(250,204,21,0.1)] transition-transform hover:scale-[1.02]">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4 text-white">Interference Lab</h2>
            <p className="text-xl text-yellow-100/70 max-w-2xl mx-auto">
              Conflicting connections appear. See what happens when memories collide and catastrophic forgetting occurs.
            </p>
          </div>
        </section>

        <section ref={retentionRef} className="min-h-[60vh] flex items-center justify-center px-8">
          <div className="w-full max-w-4xl bg-[#05000a]/80 backdrop-blur-xl border border-indigo-500/20 p-12 rounded-[2rem] text-center shadow-[0_0_50px_rgba(129,140,248,0.1)] transition-transform hover:scale-[1.02]">
            <Activity className="w-12 h-12 text-indigo-400 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4 text-white">Retention vs Learning</h2>
            <p className="text-xl text-indigo-100/70 max-w-2xl mx-auto">
              Connections strengthen and weaken based on experiment state. Measure the stability-plasticity dilemma mathematically.
            </p>
            <button 
              onClick={onLaunch}
              className="mt-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full text-sm font-bold transition-all inline-flex items-center justify-center gap-2 tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.2)]"
            >
              START EXPERIMENT <Play className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
