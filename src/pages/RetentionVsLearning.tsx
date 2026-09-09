import React from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';

export const RetentionVsLearning: React.FC = () => {
  const { state } = useExperiment();
  if (!state) return null;

  const chartData = [
    { step: 0, old: 100, new: 0 },
    { step: state.experiment_steps, old: state.old_memory_accuracy, new: state.new_memory_accuracy }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-primary">STABILITY VS PLASTICITY</h1>
      <p className="text-muted-foreground text-lg">Does learning new information come at the cost of remembering old information?</p>

      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <div className="h-80 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="step" stroke="hsl(var(--muted-foreground))" tick={{fill: 'hsl(var(--muted-foreground))'}} />
              <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" tick={{fill: 'hsl(var(--muted-foreground))'}} />
              <Tooltip 
                contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px'}}
                itemStyle={{color: 'hsl(var(--foreground))'}}
              />
              <ReferenceLine y={70} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ position: 'top', value: 'Failure Threshold', fill: 'hsl(var(--destructive))' }} />
              <Line type="monotone" name="Old Retention" dataKey="old" stroke="#4ade80" strokeWidth={3} dot={{r: 6}} />
              <Line type="monotone" name="New Acquisition" dataKey="new" stroke="#60a5fa" strokeWidth={3} dot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-background border border-border rounded text-center">
            <div className="text-xs text-muted-foreground uppercase mb-1">Old Retention</div>
            <div className="text-2xl font-bold text-green-400">{state.old_memory_accuracy.toFixed(1)}%</div>
          </div>
          <div className="p-4 bg-background border border-border rounded text-center">
            <div className="text-xs text-muted-foreground uppercase mb-1">New Acquisition</div>
            <div className="text-2xl font-bold text-blue-400">{state.new_memory_accuracy.toFixed(1)}%</div>
          </div>
          <div className="p-4 bg-background border border-border rounded text-center">
            <div className="text-xs text-muted-foreground uppercase mb-1">Failure Threshold</div>
            <div className="text-2xl font-bold text-destructive">70%</div>
          </div>
          <div className="p-4 bg-background border border-border rounded text-center">
            <div className="text-xs text-muted-foreground uppercase mb-1">Total Updates</div>
            <div className="text-2xl font-bold text-primary">{state.experiment_steps}</div>
          </div>
        </div>

        <div className="p-4 bg-primary/10 border border-primary/30 rounded flex gap-4 items-start">
          <Activity className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-primary mb-1">Technical Interpretation</h3>
            <p className="text-sm text-foreground">
              {state.old_memory_accuracy < 70 ? 
                `With lambda at ${state.lambda_val.toFixed(2)}, the new associations overwrote the base representation, dropping old retention below the critical threshold of 70%.` :
                `The model acquired ${state.new_memory_accuracy.toFixed(1)}% of new associations while keeping old memory retention stable at ${state.old_memory_accuracy.toFixed(1)}%.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
