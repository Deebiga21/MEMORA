import React from 'react';
import { Beaker, Settings, RefreshCw, BarChart2, Activity, Zap, BrainCircuit, LineChart, FileText, Clock, Layers, ShieldAlert, ArrowRight } from 'lucide-react';

export const PAGES = [
  { id: 'overview', label: 'Overview', icon: <BrainCircuit className="w-4 h-4" /> },
  { id: 'playground', label: 'Memory Playground', icon: <Beaker className="w-4 h-4" /> },
  { id: 'fast_weights', label: 'Fast Weight Lab', icon: <Zap className="w-4 h-4" /> },
  { id: 'interference', label: 'Interference Lab', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 'surgery', label: 'Memory Surgery', icon: <Activity className="w-4 h-4" /> },
  { id: 'retention', label: 'Retention vs Learning', icon: <LineChart className="w-4 h-4" /> },
  { id: 'predict', label: 'Predict Failure', icon: <ArrowRight className="w-4 h-4" /> },
  { id: 'memory_map', label: 'Internal Memory Map', icon: <Layers className="w-4 h-4" /> },
  { id: 'bdh_cq', label: 'BDH-CQ Connection', icon: <Settings className="w-4 h-4" /> },
  { id: 'report', label: 'Experiment Report', icon: <FileText className="w-4 h-4" /> },
  { id: 'history', label: 'Experiment History', icon: <Clock className="w-4 h-4" /> },
  { id: 'summary', label: 'Learning Summary', icon: <BarChart2 className="w-4 h-4" /> },
] as const;

export type PageId = typeof PAGES[number]['id'];

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onReset }) => {
  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <BrainCircuit className="w-6 h-6" />
          MEMORA-X
        </h1>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">AI Memory Lab</p>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {PAGES.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id as PageId)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activePage === page.id 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {page.icon}
            {page.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 rounded-lg p-3 border border-border/50 mb-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Experiment Active
          </div>
        </div>
        <button 
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 rounded-md text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Experiment
        </button>
      </div>
    </div>
  );
};
