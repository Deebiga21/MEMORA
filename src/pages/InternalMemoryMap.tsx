import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Layers, Network, Grid3X3 } from 'lucide-react';
import { ForceGraphVisualizer } from '../components/ForceGraphVisualizer';
import { MemoryMapVisualizer } from '../components/MemoryMapVisualizer';

export const InternalMemoryMap: React.FC = () => {
  const { vocab, engine, dataset, historyLog } = useExperiment();
  const [viewMode, setViewMode] = useState<'NETWORK' | 'MATRIX'>('NETWORK');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Layers className="w-8 h-8" /> INTERNAL MEMORY STATE
          </h1>
          <p className="text-muted-foreground mt-2">"Visualize the abstract representations and association strengths."</p>
        </div>
        
        <div className="flex bg-background border border-border rounded-lg overflow-hidden">
          <button 
            onClick={() => setViewMode('NETWORK')}
            className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'NETWORK' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Network className="w-4 h-4" /> NETWORK VIEW
          </button>
          <button 
            onClick={() => setViewMode('MATRIX')}
            className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'MATRIX' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Grid3X3 className="w-4 h-4" /> MATRIX VIEW
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Visualizer */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl shadow-lg h-[600px] flex items-center justify-center relative overflow-hidden">
          {/* We wrap the existing visualizers which assume full space */}
          <div className="absolute inset-4 rounded border border-border/30 bg-background/50 pointer-events-auto">
            {viewMode === 'NETWORK' ? (
              <ForceGraphVisualizer size={vocab.size} W={engine.W} S={engine.S} words={dataset.words} />
            ) : (
              <MemoryMapVisualizer size={vocab.size} W={engine.W} S={engine.S} words={dataset.words} />
            )}
          </div>
          <div className="absolute top-6 left-6 pointer-events-none">
            <h3 className="font-bold text-lg text-foreground/50">{viewMode}</h3>
          </div>
        </div>

        {/* Node Details Panel */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <h3 className="font-bold border-b border-border pb-2 text-primary">Node Details</h3>
          
          <div className="text-sm text-muted-foreground italic mb-2">
            (The ForceGraph is interactive. Click nodes in Network View to see details if supported by the visualizer, otherwise select from below.)
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {dataset.words.map(w => (
              <button 
                key={w} 
                onClick={() => setSelectedNode(w)}
                className={`text-xs py-1 px-2 rounded border transition-colors ${selectedNode === w ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}
              >
                {w}
              </button>
            ))}
          </div>

          {selectedNode ? (
            <div className="bg-background border border-border rounded p-4 flex-1 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Concept</p>
                <p className="text-xl font-bold text-primary">{selectedNode}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Update Count</p>
                <p className="font-mono">{historyLog.filter(l => l.includes(selectedNode)).length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Last Modified</p>
                <p className="font-mono text-xs">{historyLog.find(l => l.includes(selectedNode)) || 'Never'}</p>
              </div>
            </div>
          ) : (
            <div className="bg-background border border-border rounded p-4 flex-1 flex items-center justify-center text-center text-muted-foreground text-sm">
              Select a node to view its memory associations.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
