interface MemoryMapVisualizerProps {
  size?: number;
  W: number[][];
  S: number[][];
  words: string[];
}

export function MemoryMapVisualizer({ W, S, words }: MemoryMapVisualizerProps) {
  // Simple heatmap visualization for a small vocabulary
  // We'll render a grid where rows=input word, cols=output word
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs text-center border-collapse">
        <thead>
          <tr>
            <th className="p-2 border border-neutral-800 text-neutral-500 font-normal">In \ Out</th>
            {words.map(w => (
              <th key={w} className="p-2 border border-neutral-800 font-medium text-neutral-400">{w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {words.map((w_in, i) => (
            <tr key={w_in}>
              <td className="p-2 border border-neutral-800 font-medium text-neutral-400">{w_in}</td>
              {words.map((w_out, j) => {
                const baseWeight = W[j][i]; // W is [output][input] in our outer product logic
                const fastWeight = S[j][i];
                const totalWeight = baseWeight + fastWeight;
                
                // Color intensity
                const intensity = Math.min(Math.abs(totalWeight) * 100, 100);
                const color = totalWeight > 0 ? `rgba(59, 130, 246, ${intensity}%)` : totalWeight < 0 ? `rgba(239, 68, 68, ${intensity}%)` : 'transparent';
                
                return (
                  <td key={w_out} className="p-2 border border-neutral-800 relative group h-12 w-12">
                    <div 
                      className="absolute inset-0 m-1 rounded opacity-50 transition-all duration-300"
                      style={{ backgroundColor: color }}
                    />
                    <span className="relative z-10 font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                      {(totalWeight).toFixed(1)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 mt-4 text-xs justify-center text-neutral-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500/50 rounded" /> Positive Association</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500/50 rounded" /> Negative Association</div>
      </div>
    </div>
  );
}
