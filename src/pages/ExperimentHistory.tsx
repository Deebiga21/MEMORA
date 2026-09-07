import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { Clock, Trash2, GitCompare } from 'lucide-react';

export const ExperimentHistory: React.FC = () => {
  const { savedExperiments, deleteExperiment } = useExperiment();
  
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(prev => prev.filter(x => x !== id));
    } else {
      if (selectedForCompare.length < 2) {
        setSelectedForCompare(prev => [...prev, id]);
      } else {
        // replace the second one
        setSelectedForCompare([selectedForCompare[0], id]);
      }
    }
  };

  const getExp = (id: string) => savedExperiments.find(e => e.id === id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
          <Clock className="w-8 h-8" /> EXPERIMENT HISTORY
        </h1>
        <p className="text-muted-foreground mt-2">"Review and compare saved experiment snapshots."</p>
      </div>

      {savedExperiments.length === 0 ? (
        <div className="bg-card border border-border p-12 rounded-xl text-center text-muted-foreground">
          No experiments saved yet. Go to the Experiment Report page to save your current session.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="col-span-1 lg:col-span-2 space-y-4">
            {savedExperiments.map(exp => (
              <div key={exp.id} className={`bg-card border rounded-xl p-5 shadow flex items-center justify-between transition-colors ${selectedForCompare.includes(exp.id) ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'border-border'}`}>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">ID</p>
                    <p className="font-bold text-foreground">{exp.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Dataset</p>
                    <p className="font-medium text-sm">{exp.dataset}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Updates</p>
                    <p className="font-medium text-sm">{exp.conflictingUpdates}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Retention</p>
                    <p className={`font-bold ${exp.oldRetention > 70 ? 'text-green-500' : 'text-destructive'}`}>{exp.oldRetention.toFixed(0)}%</p>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button 
                    onClick={() => toggleCompare(exp.id)}
                    className={`p-2 rounded transition-colors ${selectedForCompare.includes(exp.id) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                    title="Select for comparison"
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteExperiment(exp.id)}
                    className="p-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="col-span-1">
            <div className="bg-card border border-border p-6 rounded-xl shadow-lg sticky top-8">
              <h3 className="font-bold border-b border-border pb-2 flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-primary" /> Comparison Mode
              </h3>
              
              {selectedForCompare.length < 2 ? (
                <div className="py-8 text-center text-sm text-muted-foreground italic">
                  Select two experiments to compare them.
                </div>
              ) : (
                <div className="mt-4 space-y-6">
                  {['oldRetention', 'newAcquisition', 'conflictingUpdates'].map(metric => {
                    const exp1 = getExp(selectedForCompare[0]);
                    const exp2 = getExp(selectedForCompare[1]);
                    if (!exp1 || !exp2) return null;
                    
                    const val1 = exp1[metric as keyof typeof exp1] as number;
                    const val2 = exp2[metric as keyof typeof exp2] as number;
                    const isBetter = metric === 'conflictingUpdates' ? val1 < val2 : val1 > val2;

                    const label = metric === 'oldRetention' ? 'Old Retention' : metric === 'newAcquisition' ? 'New Acquisition' : 'Conflicts';

                    return (
                      <div key={metric}>
                        <p className="text-xs text-muted-foreground uppercase mb-2">{label}</p>
                        <div className="flex items-center justify-between">
                          <div className={`font-bold ${isBetter ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {val1.toFixed(0)}{metric !== 'conflictingUpdates' ? '%' : ''}
                          </div>
                          <div className="text-xs text-border px-2">vs</div>
                          <div className={`font-bold ${!isBetter ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {val2.toFixed(0)}{metric !== 'conflictingUpdates' ? '%' : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
