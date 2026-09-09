import React, { useRef, useEffect } from 'react';

interface NeuralBackgroundProps {
  mode: 'HERO' | 'PLAYGROUND' | 'FAST_WEIGHT' | 'INTERFERENCE' | 'RETENTION' | 'DEFAULT';
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  baseAlpha: number;
  color: string;
  isGiant: boolean;

  constructor(width: number, height: number, color: string, isGiant: boolean = false) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    
    // Giants move very slowly
    const speedMult = isGiant ? 0.05 : 0.3;
    this.vx = (Math.random() - 0.5) * speedMult;
    this.vy = (Math.random() - 0.5) * speedMult;
    this.baseVx = this.vx;
    this.baseVy = this.vy;
    
    this.isGiant = isGiant;
    this.radius = isGiant ? Math.random() * 15 + 25 : Math.random() * 2 + 1; // Giant neurons
    this.baseAlpha = isGiant ? 0.9 : Math.random() * 0.4 + 0.1;
    this.color = color;
  }

  update(width: number, height: number, mode: string, mouseX: number, mouseY: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 200 && !this.isGiant) {
      const force = (200 - dist) / 200;
      this.vx -= (dx / dist) * force * 0.02;
      this.vy -= (dy / dist) * force * 0.02;
    }

    if (mode === 'FAST_WEIGHT' && !this.isGiant) {
      this.x += this.vx * 2.0;
      this.y += this.vy * 2.0;
    } else if (mode === 'INTERFERENCE' && !this.isGiant) {
      this.x += this.vx * 1.5 + (Math.random() - 0.5) * 0.5;
      this.y += this.vy * 1.5 + (Math.random() - 0.5) * 0.5;
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }

    this.vx += (this.baseVx - this.vx) * 0.02;
    this.vy += (this.baseVy - this.vy) * 0.02;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
}

export const NeuralBackground: React.FC<NeuralBackgroundProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    let mouseX = -1000;
    let mouseY = -1000;

    const colors = ['#818cf8', '#c084fc', '#a855f7', '#9333ea', '#22d3ee', '#38bdf8']; 

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      particles = [];
      // Create Giants (the big organic neurons)
      for (let i = 0; i < 6; i++) {
        // mostly cyan and bright purple
        const color = i % 2 === 0 ? '#22d3ee' : '#c084fc'; 
        particles.push(new Particle(width, height, color, true));
      }
      // Create Normals
      const particleCount = Math.min(Math.floor((width * height) / 7000), 120);
      for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(width, height, color, false));
      }
    };

    const draw = () => {
      // Deep space clear
      ctx.fillStyle = 'rgba(5, 2, 12, 0.3)'; // Dark cosmic background
      ctx.fillRect(0, 0, width, height);

      let connectionDistance = 180;
      if (mode === 'PLAYGROUND') connectionDistance = 220;
      if (mode === 'FAST_WEIGHT') connectionDistance = 200;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(width, height, mode, mouseX, mouseY);

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = p.isGiant || p2.isGiant ? connectionDistance * 2.0 : connectionDistance;

          if (dist < maxDist) {
            let alpha = (1 - dist / maxDist) * 0.5;
            
            let strokeStyle = `rgba(168, 85, 247, ${alpha})`; // purple baseline
            if (p.isGiant && p2.isGiant) {
              strokeStyle = `rgba(34, 211, 238, ${alpha * 1.5})`; // thick cyan between giants
            } else if (p.isGiant || p2.isGiant) {
              strokeStyle = `rgba(192, 132, 252, ${alpha * 1.2})`; // light purple to small nodes
            }

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            
            // Organic, web-like curves
            if (p.isGiant || p2.isGiant) {
               const cpX = (p.x + p2.x) / 2 + (p.y - p2.y) * 0.15;
               const cpY = (p.y + p2.y) / 2 + (p2.x - p.x) * 0.15;
               ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
            } else {
               ctx.lineTo(p2.x, p2.y);
            }

            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = (p.isGiant && p2.isGiant) ? 3.0 : (p.isGiant || p2.isGiant ? 1.5 : 0.6);
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.baseAlpha;
        
        if (p.isGiant) {
            // Massive bloom for giants
            ctx.shadowBlur = 50;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Bright Inner core
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 1.0;
            ctx.fill();
        } else {
            ctx.fill();
            if (mode === 'FAST_WEIGHT') {
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    init();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 z-0 bg-[#05010a] overflow-hidden pointer-events-none">
      {/* Deep Space CSS Nebula Layer */}
      <div className="absolute inset-0 mix-blend-screen opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/40 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/30 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[30%] left-[20%] w-[50%] h-[50%] bg-indigo-900/30 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
      </div>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};
