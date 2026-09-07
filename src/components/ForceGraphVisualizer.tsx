import React, { useEffect, useRef, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface ForceGraphVisualizerProps {
  size: number;
  W: number[][];
  S: number[][];
  words: string[];
}

export function ForceGraphVisualizer({ size, W, S, words }: ForceGraphVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
  }, []);

  const graphData = useMemo(() => {
    const nodes = words.map((word, id) => ({ id, name: word }));
    const links = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const weight = W[r][c] + S[r][c];
        if (Math.abs(weight) > 0.1) {
          links.push({
            source: c, // Input
            target: r, // Output
            value: weight
          });
        }
      }
    }

    return { nodes, links };
  }, [W, S, words, size]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800">
      <ForceGraph2D
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="name"
        nodeColor={() => '#3b82f6'}
        nodeRelSize={6}
        linkColor={(link: any) => link.value > 0 ? `rgba(59, 130, 246, ${Math.min(link.value, 1)})` : `rgba(239, 68, 68, ${Math.min(Math.abs(link.value), 1)})`}
        linkWidth={(link: any) => Math.abs(link.value) * 3}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={(link: any) => Math.abs(link.value) * 2}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(label, node.x, node.y);
        }}
      />
    </div>
  );
}
