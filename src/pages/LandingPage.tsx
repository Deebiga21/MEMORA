import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Play, Database, Zap, AlertTriangle, Activity } from 'lucide-react';
import memoraLogo from '../assets/memora-logo.png';
import { NeuralBackground } from '../components/NeuralBackground';

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  const [bgMode, setBgMode] = useState<'HERO' | 'PLAYGROUND' | 'FAST_WEIGHT' | 'INTERFERENCE' | 'RETENTION'>('HERO');
  
  // Refs for scroll tracking
  const heroRef = useRef<HTMLDivElement>(null);
  const playgroundRef = useRef<HTMLDivElement>(null);
  const fastWeightRef = useRef<HTMLDivElement>(null);
  const interferenceRef = useRef<HTMLDivElement>(null);
  const retentionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const wh = window.innerHeight;
      const offset = wh * 0.4; // trigger point

      const getTop = (ref: React.RefObject<HTMLDivElement | null>) => 
        ref.current ? ref.current.getBoundingClientRect().top : Infinity;

      const pTop = getTop(playgroundRef);
      const fTop = getTop(fastWeightRef);
      const iTop = getTop(interferenceRef);
      const rTop = getTop(retentionRef);

      if (rTop < offset) {
        setBgMode('RETENTION');
      } else if (iTop < offset) {
        setBgMode('INTERFERENCE');
      } else if (fTop < offset) {
        setBgMode('FAST_WEIGHT');
      } else if (pTop < offset) {
        setBgMode('PLAYGROUND');
      } else {
        setBgMode('HERO');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/30 relative">
      <NeuralBackground mode={bgMode} />
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 w-full flex justify-between items-center px-8 py-6 z-50 bg-gradient-to-b from-[#050a18] to-transparent">
        <div className="flex items-center gap-2">
          <img src={memoraLogo} alt="MEMORA" className="h-8 object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <button 
            onClick={onLaunch}
            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-5 py-2 rounded-full transition-all font-semibold shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)]"
          >
            ENTER LAB
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-8 z-10 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050a18]/40 to-[#050a18]/80 pointer-events-none" />
        
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8 relative z-20">
            <div className="absolute -inset-10 bg-black/40 blur-3xl rounded-full -z-10" />
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-none text-white drop-shadow-lg">
              MEMORA-X
              <span className="block text-4xl md:text-5xl mt-4 font-normal text-primary tracking-tight">AI Memory Lab</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100/80 max-w-xl leading-relaxed font-light">
              "Experiment with how AI learns, updates, remembers and forgets."
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={onLaunch}
                className="bg-primary hover:bg-primary/90 text-[#050a18] px-8 py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 tracking-widest shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_50px_rgba(56,189,248,0.6)] hover:scale-105"
              >
                START EXPERIMENT <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="bg-secondary/50 hover:bg-secondary border border-border/50 text-white px-8 py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 tracking-widest backdrop-blur-sm hover:border-primary/50"
              >
                EXPLORE MEMORY
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-end relative z-20">
            {/* Floating Memory Visualization */}
            <div className="bg-black/50 backdrop-blur-xl border border-primary/20 p-8 rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.1)] font-mono text-sm tracking-widest text-primary/80 w-80 transform transition-transform hover:scale-105 hover:border-primary/50">
              <div className="flex items-center gap-4 mb-6 opacity-80 animate-pulse">
                <span className="text-white font-bold">CAT</span>
                <span className="text-primary/50">─────→</span>
                <span>ANIMAL</span>
              </div>
              <div className="flex items-center gap-4 mb-6 opacity-60 ml-4 animate-[fade-in_2s_ease-out_forwards]">
                <span className="text-primary/30">╲</span>
              </div>
              <div className="flex items-center gap-4 mb-6 opacity-90 animate-[slide-in-right_1s_ease-out_forwards]">
                <span className="text-primary/50"> ├────→</span>
                <span className="text-cyan-400 font-bold">PET</span>
              </div>
              <div className="flex items-center gap-4 mb-6 opacity-60 ml-4 animate-[fade-in_3s_ease-out_forwards]">
                <span className="text-primary/30">╲</span>
              </div>
              <div className="flex items-center gap-4 opacity-70 animate-[slide-in-right_2s_ease-out_forwards]">
                <span className="text-primary/50">  └────→</span>
                <span className="text-yellow-400 font-bold drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">WILD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Sections */}
      <div className="relative z-10 pb-40 space-y-64">
        
        <section ref={playgroundRef} className="min-h-[60vh] flex items-center justify-center px-8">
          <div className="w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-border p-12 rounded-3xl text-center shadow-2xl transition-transform hover:scale-[1.02]">
            <Database className="w-12 h-12 text-blue-400 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-bold mb-4 text-white">Memory Playground</h2>
            <p className="text-xl text-blue-100/70 max-w-2xl mx-auto">
              Watch nodes begin forming associations. Learn relationships between concepts using a fundamental recurrent neural architecture.
            </p>
          </div>
        </section>

        <section ref={fastWeightRef} className="min-h-[60vh] flex items-center justify-center px-8">
          <div className="w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-primary/30 p-12 rounded-3xl text-center shadow-[0_0_50px_rgba(34,211,238,0.1)] transition-transform hover:scale-[1.02]">
            <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4 text-white">Fast Weight Lab</h2>
            <p className="text-xl text-cyan-100/70 max-w-2xl mx-auto">
              Connections become brighter and more dynamic. Adapt memory during inference without retraining the base model parameters.
            </p>
          </div>
        </section>

        <section ref={interferenceRef} className="min-h-[60vh] flex items-center justify-center px-8">
          <div className="w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-yellow-500/30 p-12 rounded-3xl text-center shadow-[0_0_50px_rgba(250,204,21,0.1)] transition-transform hover:scale-[1.02]">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4 text-white">Interference Lab</h2>
            <p className="text-xl text-yellow-100/70 max-w-2xl mx-auto">
              Conflicting connections appear. See what happens when memories collide and catastrophic forgetting occurs.
            </p>
          </div>
        </section>

        <section ref={retentionRef} className="min-h-[60vh] flex items-center justify-center px-8">
          <div className="w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-indigo-500/30 p-12 rounded-3xl text-center shadow-[0_0_50px_rgba(129,140,248,0.1)] transition-transform hover:scale-[1.02]">
            <Activity className="w-12 h-12 text-indigo-400 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4 text-white">Retention vs Learning</h2>
            <p className="text-xl text-indigo-100/70 max-w-2xl mx-auto">
              Connections strengthen and weaken based on experiment state. Measure the stability-plasticity dilemma mathematically.
            </p>
            <button 
              onClick={onLaunch}
              className="mt-12 bg-primary/20 hover:bg-primary border border-primary text-white px-8 py-4 rounded-full text-sm font-bold transition-all inline-flex items-center justify-center gap-2 tracking-widest shadow-[0_0_30px_rgba(56,189,248,0.4)]"
            >
              START EXPERIMENT <Play className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
