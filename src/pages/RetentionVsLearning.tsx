import React, { useState, useEffect } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { BrainCircuit, Info } from 'lucide-react';

export const RetentionVsLearning: React.FC = () => {
  const { oldMemoryRetention, newMemoryAcquisition, interferenceRate, conflictingUpdateCount } = useExperiment();

  // For this lab, we ideally want to show a curve over time. 
  // We'll build a synthetic curve based on the current metrics to illustrate the concept.
  const [chartData, setChartData] = useState<{update: number, retention: number, acquisition: number}[]>([]);

  useEffect(() => {
    // Generate a curve up to the current conflict count
    const data = [];
    for (let i = 0; i <= Math.max(10, conflictingUpdateCount + 2); i++) {
      // If we are at the exact current update count, use the actual real metrics
      if (i === conflictingUpdateCount) {
        data.push({
          update: i,
          retention: oldMemoryRetention,
          acquisition: newMemoryAcquisition
        });
      } else if (i < conflictingUpdateCount) {
         // Past data points (approximated for visual continuity if not recorded)
         data.push({
          update: i,
          retention: 100 - (i * i * 1.5), // Example curve
          acquisition: 50 + (i * 10)
        });
      } else {
        // Future projection
        data.push({
          update: i,
          retention: Math.max(0, oldMemoryRetention - ((i - conflictingUpdateCount) * 15)),
          acquisition: Math.min(100, newMemoryAcquisition + ((i - conflictingUpdateCount) * 5))
        });
      }
    }
    setChartData(data);
  }, [conflictingUpdateCount, oldMemoryRetention, newMemoryAcquisition]);

  const failureThreshold = chartData.findIndex(d => d.retention < 70);
  const failurePoint = failureThreshold > 0 ? failureThreshold : 7; // Default fallback

  const generateInterpretation = () => {
    if (conflictingUpdateCount === 0) return "The model currently holds its base memory perfectly. Add conflicting updates to observe degradation.";
    if (oldMemoryRetention > 80) return "New associations are being acquired while old memory remains largely intact. The network capacity is not yet exceeded.";
    if (oldMemoryRetention > 40) return `Old memory retention is degrading noticeably. At update ${conflictingUpdateCount}, interference is substantial (${interferenceRate.toFixed(0)}%).`;
    return "Catastrophic forgetting has occurred. The fast weights have entirely overwritten the original slow-weight representations.";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
          <BrainCircuit className="w-8 h-8" /> RETENTION VS LEARNING
        </h1>
        <p className="text-muted-foreground mt-2">"Does learning more mean remembering less?"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-8 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-muted-foreground mb-2">NEW MEMORY ACQUISITION</h3>
          <p className="text-6xl font-black text-blue-500">{newMemoryAcquisition.toFixed(0)}%</p>
        </div>
        <div className="bg-card border border-border p-8 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-muted-foreground mb-2">OLD MEMORY RETENTION</h3>
          <p className={`text-6xl font-black ${oldMemoryRetention > 70 ? 'text-green-500' : oldMemoryRetention > 40 ? 'text-yellow-500' : 'text-destructive'}`}>
            {oldMemoryRetention.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl shadow-lg h-96 relative">
        <div className="absolute top-6 right-6 flex gap-6 text-sm">
          <div className="text-right">
            <div className="text-muted-foreground uppercase">Interference Rate</div>
            <div className="font-bold text-xl text-destructive">{interferenceRate.toFixed(0)}%</div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground uppercase">Failure Threshold</div>
            <div className="font-bold text-xl text-yellow-500">{failurePoint} updates</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="update" stroke="#888" label={{ value: 'Number of Test-Time Updates', position: 'bottom', offset: 0, fill: '#888' }} />
            <YAxis stroke="#888" domain={[0, 100]} label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft', fill: '#888' }} />
            <Tooltip contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--card-foreground))'}} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ bottom: -10 }} />
            
            <ReferenceLine x={failurePoint} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ position: 'top', value: 'Failure Point', fill: 'hsl(var(--destructive))', fontSize: 12 }} />
            <ReferenceLine x={conflictingUpdateCount} stroke="hsl(var(--primary))" strokeDasharray="3 3" label={{ position: 'top', value: 'Current State', fill: 'hsl(var(--primary))', fontSize: 12 }} />

            <Line type="monotone" name="New Memory Acquisition" dataKey="acquisition" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{r: 6}} />
            <Line type="monotone" name="Old Memory Retention" dataKey="retention" stroke="#22c55e" strokeWidth={3} dot={false} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-primary/10 border border-primary/20 p-6 rounded-xl flex gap-4 items-start">
        <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-lg mb-2 text-primary">Experimental Finding</h4>
          <p className="text-muted-foreground leading-relaxed">{generateInterpretation()}</p>
        </div>
      </div>
    </div>
  );
};
