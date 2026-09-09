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

  constructor(width: number, height: number, color: string) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.baseVx = this.vx;
    this.baseVy = this.vy;
    
    this.radius = Math.random() * 2 + 1;
    this.baseAlpha = Math.random() * 0.5 + 0.3;
    this.color = color;
  }

  update(width: number, height: number, mode: string, mouseX: number, mouseY: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 200) {
      const force = (200 - dist) / 200;
      this.vx -= (dx / dist) * force * 0.05;
      this.vy -= (dy / dist) * force * 0.05;
    }

    if (mode === 'FAST_WEIGHT') {
      this.x += this.vx * 2.5;
      this.y += this.vy * 2.5;
    } else if (mode === 'INTERFERENCE') {
      this.x += this.vx * 2.0 + (Math.random() - 0.5) * 1.0;
      this.y += this.vy * 2.0 + (Math.random() - 0.5) * 1.0;
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }

    this.vx += (this.baseVx - this.vx) * 0.01;
    this.vy += (this.baseVy - this.vy) * 0.01;

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

    const colors = ['#22d3ee', '#c084fc', '#a855f7', '#e879f9']; 

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 5000), 250);
      for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(width, height, color));
      }
    };

    const draw = () => {
      // Clear with slight trailing effect, fully transparent
      ctx.clearRect(0, 0, width, height);
      // Wait, clearRect removes the trail. Let's use a very faint fill for trails, but mostly transparent
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; 
      ctx.fillRect(0, 0, width, height);

      let connectionDistance = 120;
      if (mode === 'PLAYGROUND') connectionDistance = 160;
      if (mode === 'FAST_WEIGHT') connectionDistance = 140;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(width, height, mode, mouseX, mouseY);

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            let alpha = (1 - dist / connectionDistance) * 0.4;
            
            let strokeStyle = `rgba(34, 211, 238, ${alpha})`; // cyan default
            if (Math.random() > 0.5) strokeStyle = `rgba(192, 132, 252, ${alpha})`;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.baseAlpha;
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
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
    <div className="fixed inset-0 z-0 pointer-events-none mix-blend-screen">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
    </div>
  );
};
