import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Activity, Edit3, Trash2, Shield, Zap, Search } from 'lucide-react';

export const MemorySurgery: React.FC = () => {
  const { trainBase, eraseMemory, updateTestTime, queryModel, historyLog, predictions } = useExperiment();
  
  const [writeX, setWriteX] = useState('');
  const [writeY, setWriteY] = useState('');
  
  const [interfereX, setInterfereX] = useState('');
  const [interfereY, setInterfereY] = useState('');

  const [query, setQuery] = useState('');

  const handleAction = (type: 'write' | 'erase' | 'interfere' | 'query') => {
    switch (type) {
      case 'write':
        if (writeX && writeY) trainBase(writeX.toUpperCase(), writeY.toUpperCase());
        break;
      case 'erase':
        if (writeX && writeY) eraseMemory(writeX.toUpperCase(), writeY.toUpperCase());
        break;
      case 'interfere':
        if (interfereX && interfereY) updateTestTime(interfereX.toUpperCase(), interfereY.toUpperCase());
        break;
      case 'query':
        if (query) queryModel(query.toUpperCase());
        break;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
          <Activity className="w-8 h-8" /> MEMORY SURGERY
        </h1>
        <p className="text-muted-foreground mt-2">"Directly manipulate the model's memory and observe what changes."</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Operations */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* WRITE */}
          <div className="bg-card border border-border p-5 rounded-xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Edit3 className="w-24 h-24" />
            </div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Edit3 className="w-5 h-5 text-blue-400" /> WRITE</h3>
            <div className="space-y-3 relative z-10">
              <input type="text" placeholder="Concept (e.g. APPLE)" value={writeX} onChange={e=>setWriteX(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" />
              <input type="text" placeholder="Association (e.g. FRUIT)" value={writeY} onChange={e=>setWriteY(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" />
              <div className="flex gap-2">
                <button onClick={() => handleAction('write')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-sm font-bold transition-colors">ADD TO SLOW MEMORY</button>
                <button onClick={() => handleAction('erase')} className="bg-destructive hover:bg-destructive/80 text-white px-3 py-2 rounded text-sm transition-colors" title="Erase Memory"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* INTERFERE */}
          <div className="bg-card border border-border p-5 rounded-xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24" />
            </div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> INTERFERE</h3>
            <div className="space-y-3 relative z-10">
              <input type="text" placeholder="Concept (e.g. CAT)" value={interfereX} onChange={e=>setInterfereX(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" />
              <input type="text" placeholder="Conflict (e.g. WILD)" value={interfereY} onChange={e=>setInterfereY(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" />
              <button onClick={() => handleAction('interfere')} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2 rounded text-sm font-bold transition-colors">TEST-TIME UPDATE</button>
            </div>
          </div>

          {/* QUERY */}
          <div className="bg-card border border-border p-5 rounded-xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Search className="w-24 h-24" />
            </div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-green-400" /> QUERY</h3>
            <div className="space-y-3 relative z-10 flex">
              <input type="text" placeholder="Query..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleAction('query')} className="flex-1 bg-background border border-border rounded-l px-3 py-2 text-sm" />
              <button onClick={() => handleAction('query')} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-r font-bold transition-colors"><Search className="w-4 h-4" /></button>
            </div>
            {predictions.length > 0 && (
              <div className="mt-4 p-3 bg-background border border-border rounded relative z-10">
                <span className="text-xs text-muted-foreground uppercase">Top Result</span>
                <div className="font-bold text-lg text-primary">{predictions[0].word} <span className="text-sm font-normal text-muted-foreground">({predictions[0].confidence.toFixed(2)})</span></div>
              </div>
            )}
          </div>

          {/* FREEZE (Conceptual) */}
          <div className="bg-card border border-border p-5 rounded-xl shadow-lg relative overflow-hidden group opacity-70">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield className="w-24 h-24" />
            </div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-muted-foreground" /> FREEZE</h3>
            <div className="space-y-3 relative z-10">
              <p className="text-sm text-muted-foreground">Prevent further test-time updates from modifying the state.</p>
              <button disabled className="w-full bg-muted text-muted-foreground py-2 rounded text-sm font-bold cursor-not-allowed border border-border">FREEZE MEMORY</button>
            </div>
          </div>

        </div>

        {/* Action Log */}
        <div className="col-span-1 bg-card border border-border p-5 rounded-xl shadow-lg flex flex-col h-full max-h-[600px]">
          <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">Action Log</h3>
          <div className="flex-1 overflow-y-auto space-y-2 text-xs font-mono text-muted-foreground pr-2 custom-scrollbar">
            {historyLog.length === 0 && <span className="opacity-50">No actions yet.</span>}
            {[...historyLog].reverse().map((log, i) => {
              const num = historyLog.length - i;
              const isQuery = log.includes('Queried');
              const isUpdate = log.includes('Update');
              const isErase = log.includes('Erase');
              const isSystem = log.includes('SYSTEM');
              return (
                <div key={i} className="flex gap-3 py-1 border-b border-border/30 last:border-0">
                  <span className="text-primary/50 shrink-0">{num.toString().padStart(2, '0')}</span>
                  <span className={
                    isSystem ? "text-accent" :
                    isQuery ? "text-green-300" : 
                    isUpdate ? "text-yellow-300" : 
                    isErase ? "text-destructive" : "text-blue-300"
                  }>
                    {log}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
