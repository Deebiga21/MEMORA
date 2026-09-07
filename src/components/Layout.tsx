import React from 'react';
import { Sidebar, type PageId } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  onReset: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activePage, setActivePage, onReset }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-primary/30">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onReset={onReset} />
      <main className="flex-1 ml-64 p-8 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};
