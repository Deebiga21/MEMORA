import React from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { FileText, Download, Copy } from 'lucide-react';

export const ExperimentReport: React.FC = () => {
  const { dataset, lambda, eta, oldMemoryRetention, newMemoryAcquisition, interferenceRate, conflictingUpdateCount, historyLog, saveExperiment } = useExperiment();

  const handleCopy = () => {
    navigator.clipboard.writeText(`MEMORA-X Report: ${dataset.name} | Retention: ${oldMemoryRetention.toFixed(0)}%`);
    alert('Report summary copied to clipboard.');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Dataset,${dataset.name}\n`
      + `Lambda,${lambda}\n`
      + `Eta,${eta}\n`
      + `Conflicting Updates,${conflictingUpdateCount}\n`
      + `Old Retention,${oldMemoryRetention.toFixed(2)}%\n`
      + `New Acquisition,${newMemoryAcquisition.toFixed(2)}%\n`
      + `Interference Rate,${interferenceRate.toFixed(2)}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "memora-x-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <FileText className="w-8 h-8" /> EXPERIMENT REPORT
          </h1>
          <p className="text-muted-foreground mt-2">"Summary of the current session parameters and results."</p>
        </div>
        <div className="flex gap-2">
          <button onClick={saveExperiment} className="bg-primary text-primary-foreground px-4 py-2 rounded flex items-center gap-2 hover:bg-primary/90 text-sm font-medium">
            Save to History
          </button>
          <button onClick={handleExportCSV} className="bg-secondary text-secondary-foreground px-4 py-2 rounded flex items-center gap-2 hover:bg-secondary/80 text-sm font-medium">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={handleCopy} className="bg-muted text-foreground px-4 py-2 rounded flex items-center gap-2 hover:bg-muted/80 text-sm font-medium">
            <Copy className="w-4 h-4" /> Copy
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-lg p-8">
        
        {/* Header info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground uppercase">Dataset</p>
            <p className="font-bold">{dataset.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">Date</p>
            <p className="font-bold">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">Lambda (λ)</p>
            <p className="font-bold text-blue-400">{lambda.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">Eta (η)</p>
            <p className="font-bold text-yellow-500">{eta.toFixed(2)}</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background border border-border p-6 rounded-lg text-center">
            <p className="text-sm text-muted-foreground uppercase mb-2">Old Memory Retention</p>
            <p className={`text-4xl font-black ${oldMemoryRetention > 70 ? 'text-green-500' : 'text-destructive'}`}>{oldMemoryRetention.toFixed(0)}%</p>
          </div>
          <div className="bg-background border border-border p-6 rounded-lg text-center">
            <p className="text-sm text-muted-foreground uppercase mb-2">New Acquisition</p>
            <p className="text-4xl font-black text-blue-500">{newMemoryAcquisition.toFixed(0)}%</p>
          </div>
          <div className="bg-background border border-border p-6 rounded-lg text-center">
            <p className="text-sm text-muted-foreground uppercase mb-2">Interference Rate</p>
            <p className="text-4xl font-black text-yellow-500">{interferenceRate.toFixed(0)}%</p>
          </div>
        </div>

        {/* Findings */}
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-primary mb-2">Experimental Finding</h3>
          <p className="text-muted-foreground">
            After {conflictingUpdateCount} test-time updates, the model achieved a new memory acquisition of {newMemoryAcquisition.toFixed(0)}%, 
            while retaining {oldMemoryRetention.toFixed(0)}% of its base training. 
            The interference rate was measured at {interferenceRate.toFixed(0)}%.
            {interferenceRate > 50 ? " Catastrophic forgetting has significantly degraded the base representations." : " The model successfully adapted to new information without destroying base knowledge."}
          </p>
        </div>

        {/* Partial Log */}
        <div>
          <h3 className="font-bold mb-4">Latest Action Log</h3>
          <div className="bg-background border border-border p-4 rounded text-xs font-mono text-muted-foreground space-y-1">
            {historyLog.slice(-5).map((log, i) => (
              <div key={i}>&gt; {log}</div>
            ))}
            {historyLog.length > 5 && <div className="text-primary/50">...and {historyLog.length - 5} more events.</div>}
          </div>
        </div>

      </div>
    </div>
  );
};
