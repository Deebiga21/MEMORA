import React from 'react';
import { ArrowRight } from 'lucide-react';
import memoraLogo from '../assets/memora-logo.png';
import heroGraphic from '../assets/hero-graphic.png';
import LineWaves from '../components/LineWaves';

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col items-center pt-6 px-8 relative overflow-x-hidden">
      <div className="absolute inset-0 z-0 opacity-60">
        <LineWaves enableMouseInteraction={true} />
      </div>
      
      {/* Navbar */}
      <nav className="w-full max-w-7xl flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <img src={memoraLogo} alt="MEMORA" className="h-10 object-contain" />
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Platform</a>
          <a href="#" className="hover:text-foreground transition-colors">Resources</a>
          <a href="#" className="hover:text-foreground transition-colors">Customers</a>
          <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Login</a>
          <button 
            onClick={onLaunch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-colors font-semibold"
          >
            Launch Lab
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center mt-24 z-10 w-full max-w-4xl text-center">
        <h1 className="text-6xl md:text-7xl font-serif font-medium leading-tight mb-6">
          AI memory you can control.<br/>Forgetting you can prevent.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          The educational AI memory platform that helps researchers own every inference interaction, from test-time updates to mitigating catastrophic interference.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 bg-card p-1.5 rounded-xl border border-border shadow-sm max-w-md w-full mx-auto">
          <input 
            id="email-input"
            type="email" 
            placeholder="What's your work email?" 
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const email = e.currentTarget.value;
                if (email) fetch('http://localhost:8000/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
                onLaunch();
              }
            }}
          />
          <button 
            onClick={() => {
              const emailInput = document.getElementById('email-input') as HTMLInputElement;
              if (emailInput && emailInput.value) {
                fetch('http://localhost:8000/api/subscribe', { 
                  method: 'POST', 
                  headers: { 'Content-Type': 'application/json' }, 
                  body: JSON.stringify({ email: emailInput.value }) 
                });
              }
              onLaunch();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            Launch Lab <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Graphic Container */}
        <div className="w-full max-w-5xl mt-20 relative">
          <div className="w-full aspect-[16/7] rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-100 to-orange-50 border border-border/50 relative shadow-2xl flex items-center justify-center">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
             
             {/* Network Graphic */}
             <img src={heroGraphic} alt="Network Graph" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply scale-105 animate-float" />


          </div>
        </div>

        {/* Logo Bar */}
        <div className="w-full border-t border-border mt-16 pt-8 pb-12 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale">
          <span className="font-bold text-lg tracking-widest">TURO</span>
          <span className="font-bold text-lg tracking-widest lowercase">superloop</span>
          <span className="font-bold text-lg tracking-widest">StubHub</span>
          <span className="font-bold text-lg tracking-widest">Sanlam</span>
          <span className="font-bold text-lg tracking-widest font-serif">TRILOGY</span>
        </div>

      </main>

    </div>
  );
};
