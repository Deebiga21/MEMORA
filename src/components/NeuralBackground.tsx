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
  targetX?: number;
  targetY?: number;

  constructor(width: number, height: number, color: string) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.baseVx = this.vx;
    this.baseVy = this.vy;
    this.radius = Math.random() * 1.5 + 0.5;
    this.baseAlpha = Math.random() * 0.5 + 0.1;
    this.color = color;
  }

  update(width: number, height: number, mode: string, mouseX: number, mouseY: number) {
    // Mouse interaction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 150) {
      const force = (150 - dist) / 150;
      this.vx -= (dx / dist) * force * 0.05;
      this.vy -= (dy / dist) * force * 0.05;
    }

    // Mode specific physics
    if (mode === 'FAST_WEIGHT') {
      this.x += this.vx * 2.5;
      this.y += this.vy * 2.5;
    } else if (mode === 'INTERFERENCE') {
      this.x += this.vx * 1.5 + (Math.random() - 0.5) * 1.0;
      this.y += this.vy * 1.5 + (Math.random() - 0.5) * 1.0;
    } else {
      // Normal / HERO / PLAYGROUND / RETENTION
      this.x += this.vx;
      this.y += this.vy;
    }

    // Friction to return to base velocity
    this.vx += (this.baseVx - this.vx) * 0.02;
    this.vy += (this.baseVy - this.vy) * 0.02;

    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
    
    // Wrap around to avoid clumps on edges
    if (this.x < -50) this.x = width + 50;
    if (this.x > width + 50) this.x = -50;
    if (this.y < -50) this.y = height + 50;
    if (this.y > height + 50) this.y = -50;
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

    const colors = ['#38bdf8', '#818cf8', '#22d3ee', '#c084fc', '#a855f7', '#9333ea']; // cyan, indigo, sky, purple, violet, fuchsia

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      const particleCount = Math.min(Math.floor((width * height) / 8000), 200); // Scale with screen
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(width, height, color));
      }
    };

    const draw = () => {
      // Dark violet/near-black fluid background
      ctx.fillStyle = 'rgba(15, 5, 30, 0.2)'; // Slight trail effect
      ctx.fillRect(0, 0, width, height);

      // Connection threshold based on mode
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

          // Mouse dist for local brightening
          const mDx = mouseX - ((p.x + p2.x) / 2);
          const mDy = mouseY - ((p.y + p2.y) / 2);
          const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
          const mouseGlow = mDist < 200 ? (200 - mDist) / 200 : 0;

          if (dist < connectionDistance) {
            let alpha = (1 - dist / connectionDistance) * 0.3;
            alpha += mouseGlow * 0.4; // Brighter near mouse

            let strokeStyle = `rgba(56, 189, 248, ${alpha})`; // Default blue

            if (mode === 'FAST_WEIGHT') {
              strokeStyle = `rgba(34, 211, 238, ${alpha * 1.5})`; // Cyan brighter
            } else if (mode === 'INTERFERENCE') {
              if (Math.random() > 0.95) {
                strokeStyle = `rgba(250, 204, 21, ${alpha * 2})`; // Yellow flashes
              } else if (Math.random() > 0.98) {
                strokeStyle = `rgba(248, 113, 113, ${alpha * 2})`; // Red flashes
              }
            } else if (mode === 'RETENTION') {
              const pulse = Math.sin(Date.now() / 500) * 0.5 + 0.5;
              strokeStyle = `rgba(129, 140, 248, ${alpha * (0.5 + pulse)})`; // Pulsing indigo
            }

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            // Bend towards mouse slightly if close
            if (mouseGlow > 0 && mode !== 'INTERFERENCE') {
               const cpX = (p.x + p2.x) / 2 + (mouseX - (p.x + p2.x) / 2) * 0.1;
               const cpY = (p.y + p2.y) / 2 + (mouseY - (p.y + p2.y) / 2) * 0.1;
               ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
            } else {
               ctx.lineTo(p2.x, p2.y);
            }
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = mouseGlow > 0 ? 1.5 : 0.8;
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (mode === 'FAST_WEIGHT' ? 1.5 : 1), 0, Math.PI * 2);
        const pMDx = mouseX - p.x;
        const pMDy = mouseY - p.y;
        const pMDist = Math.sqrt(pMDx * pMDx + pMDy * pMDy);
        const pGlow = pMDist < 150 ? 0.5 : 0;
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.baseAlpha + pGlow;
        if (mode === 'INTERFERENCE' && Math.random() > 0.95) {
            ctx.fillStyle = '#facc15';
        }
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // Add subtle bloom/glow natively
        if (pGlow > 0.2 || mode === 'FAST_WEIGHT') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
      }

      // Draw soft ripple at mouse
      if (mouseX > 0 && mouseY > 0) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 150, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
        gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#0a0418' }}
    />
  );
};
