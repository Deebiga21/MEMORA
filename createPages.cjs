const fs = require('fs');
const pages = [
  'Overview', 'MemoryPlayground', 'FastWeightLab', 'InterferenceLab', 
  'MemorySurgery', 'RetentionVsLearning', 'PredictFailure', 
  'InternalMemoryMap', 'BdhCqConnection', 'ExperimentReport', 
  'ExperimentHistory', 'LearningSummary'
];

pages.forEach(p => {
  const content = `import React from 'react';

export const ${p}: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight">${p}</h1>
      <p className="text-muted-foreground">Content for ${p} goes here.</p>
    </div>
  );
};
`;
  fs.writeFileSync(`src/pages/${p}.tsx`, content);
});

fs.writeFileSync('src/pages/index.ts', pages.map(p => `export * from './${p}';`).join('\n'));
