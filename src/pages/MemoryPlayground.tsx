import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Database, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const MemoryPlayground: React.FC = () => {
  const { trainBase, queryModel, predictions } = useExperiment();
  
  const [teachConcept, setTeachConcept] = useState('');
  const [teachAssociation, setTeachAssociation] = useState('');
  const [queryConcept, setQueryConcept] = useState('');

  const handleTeach = () => {
    if (teachConcept && teachAssociation) {
      trainBase(teachConcept, teachAssociation);
      setTeachConcept('');
      setTeachAssociation('');
    }
  };

  const handleQuery = () => {
    if (queryConcept) {
      queryModel(queryConcept);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-primary">MEMORY PLAYGROUND</h1>
      <p className="text-muted-foreground text-lg">How does associative memory work?</p>
      <p className="text-sm">Teach the base model associations and observe how it retrieves them mathematically.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Database className="text-blue-400" />
            <h2 className="text-xl font-semibold">Teach the Model</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Concept</label>
              <input 
                type="text" 
                value={teachConcept}
                onChange={e => setTeachConcept(e.target.value.toUpperCase())}
                placeholder="e.g. CAT"
                className="w-full bg-background border border-border rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Association</label>
              <input 
                type="text" 
                value={teachAssociation}
                onChange={e => setTeachAssociation(e.target.value.toUpperCase())}
                placeholder="e.g. ANIMAL"
                className="w-full bg-background border border-border rounded-md px-3 py-2 mt-1 focus:outline-none focus:border-primary"
              />
            </div>
            <button 
              onClick={handleTeach}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 rounded-md transition-colors"
            >
              WRITE MEMORY
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <Search className="text-green-400" />
            <h2 className="text-xl font-semibold">Query Memory</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Input Concept</label>
              <input 
                type="text" 
                value={queryConcept}
                onChange={e => setQueryConcept(e.target.value.toUpperCase())}
                placeholder="e.g. CAT"
                className="w-full bg-background border border-border rounded-md px-3 py-2 mt-1 text-xl focus:outline-none focus:border-primary"
                onKeyDown={e => e.key === 'Enter' && handleQuery()}
              />
            </div>
            <button 
              onClick={handleQuery}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-md text-lg transition-colors shadow-[0_0_15px_rgba(var(--primary),0.3)]"
            >
              QUERY MEMORY
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl font-semibold">Retrieval Results</h2>
          </div>

          {predictions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground italic text-sm">
              Waiting for query...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-background p-3 rounded border border-border">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Top Prediction</div>
                  <div className="text-xl font-bold text-primary">{predictions[0].word}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Confidence</div>
                  <div className="text-xl font-bold">{(predictions[0].confidence * 100).toFixed(0)}%</div>
                </div>
              </div>

              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictions.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 'dataMax']} hide />
                    <YAxis dataKey="word" type="category" width={70} stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--card-foreground))'}} />
                    <Bar dataKey="confidence" radius={[0, 4, 4, 0]}>
                      {predictions.slice(0, 5).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-3 rounded text-sm text-muted-foreground">
                <strong className="text-foreground block mb-1">Why this prediction?</strong>
                The outer product of the input vector and the weight matrix produced the highest mathematical activation for <strong>{predictions[0].word}</strong>.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
