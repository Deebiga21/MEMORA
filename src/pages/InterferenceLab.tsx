import React, { useState, useEffect } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { ShieldAlert, Zap, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const InterferenceLab: React.FC = () => {
  const { dataset, updateTestTime, resetState, oldMemoryRetention, newMemoryAcquisition, interferenceRate, conflictingUpdateCount } = useExperiment();
  
  const [conflictWord, setConflictWord] = useState('');
  
  // Track history for the chart
  const [chartData, setChartData] = useState<{update: number, retention: number, acquisition: number}[]>([]);

  // When reset occurs, clear chart
  useEffect(() => {
    if (conflictingUpdateCount === 0) {
      setChartData([{ update: 0, retention: 100, acquisition: 0 }]);
    } else {
      setChartData(prev => [
        ...prev, 
        { update: conflictingUpdateCount, retention: oldMemoryRetention, acquisition: newMemoryAcquisition }
      ]);
    }
  }, [conflictingUpdateCount, oldMemoryRetention, newMemoryAcquisition]);

  const handleAddConflict = (word: string) => {
    if (word) {
      updateTestTime(dataset.query, word.toUpperCase());
      setConflictWord('');
    }
  };

  const applyPreset = (count: number) => {
    resetState();
    const conflicts = ["PET", "WILD", "DOMESTIC", "PREDATOR", "MAMMAL", "FELINE", "BEAST", "CREATURE", "HUNTER", "COMPANION"];
    setTimeout(() => {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          updateTestTime(dataset.query, conflicts[i % conflicts.length]);
        }, i * 150); // slight delay for visual effect
      }
    }, 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-destructive flex items-center gap-3">
          <ShieldAlert className="w-8 h-8" /> INTERFERENCE LAB
        </h1>
        <p className="text-muted-foreground mt-2">"How much conflicting information can memory handle?"</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Controls */}
        <div className="col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Base Memory</h3>
            <div className="bg-background border border-border p-3 rounded font-mono text-center text-lg mb-6">
              {dataset.base[0]?.x} → {dataset.base[0]?.y}
            </div>

            <h3 className="text-lg font-bold mb-4">Introduce Conflict</h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={conflictWord}
                onChange={e => setConflictWord(e.target.value)}
                placeholder="e.g. PET"
                className="flex-1 bg-background border border-border rounded px-3 py-2"
                onKeyDown={e => e.key === 'Enter' && handleAddConflict(conflictWord)}
              />
              <button 
                onClick={() => handleAddConflict(conflictWord)}
                className="bg-destructive hover:bg-destructive/80 text-white px-4 py-2 rounded font-bold transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4" /> ADD
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {['PET', 'WILD', 'DOMESTIC', 'PREDATOR'].map(word => (
                <button 
                  key={word}
                  onClick={() => handleAddConflict(word)}
                  className="bg-muted hover:bg-muted/80 text-xs px-2 py-1 rounded border border-border transition-colors"
                >
                  +{word}
                </button>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-bold text-muted-foreground mb-3 uppercase">Presets</h4>
              <div className="flex flex-col gap-2">
                <button onClick={() => applyPreset(2)} className="bg-background border border-border hover:border-yellow-500/50 py-2 rounded text-sm transition-colors">LOW INTERFERENCE</button>
                <button onClick={() => applyPreset(5)} className="bg-background border border-border hover:border-orange-500/50 py-2 rounded text-sm transition-colors">MEDIUM INTERFERENCE</button>
                <button onClick={() => applyPreset(10)} className="bg-background border border-border hover:border-red-500/50 py-2 rounded text-sm transition-colors">HIGH INTERFERENCE</button>
              </div>
            </div>
            
            <button onClick={resetState} className="w-full mt-6 flex items-center justify-center gap-2 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <RefreshCw className="w-4 h-4" /> Clear Conflicts
            </button>
          </div>
        </div>

        {/* Right: Visualization & Metrics */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 shadow-lg text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Old Memory Retention</p>
              <p className={`text-3xl font-black ${oldMemoryRetention > 70 ? 'text-green-500' : oldMemoryRetention > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                {oldMemoryRetention.toFixed(0)}%
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-lg text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">New Acquisition</p>
              <p className="text-3xl font-black text-blue-500">
                {newMemoryAcquisition.toFixed(0)}%
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-lg text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Interference Rate</p>
              <p className="text-3xl font-black text-destructive">
                {interferenceRate.toFixed(0)}%
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-lg h-80">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Conflict Impact Visualization</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="update" 
                  stroke="#888" 
                  label={{ value: 'Conflicting Updates', position: 'insideBottom', offset: -10, fill: '#888' }} 
                />
                <YAxis stroke="#888" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--card-foreground))'}}
                  itemStyle={{fontWeight: 'bold'}}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" name="Old Retention" dataKey="retention" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" name="New Acquisition" dataKey="acquisition" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </div>
  );
};
