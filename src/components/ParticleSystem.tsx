import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'coin' | 'sparkle' | 'star' | 'diamond';
}

interface ParticleSystemProps {
  active: boolean;
  type: 'win' | 'jackpot' | 'bonus' | 'coins';
  intensity?: number;
  centerX?: number;
  centerY?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  active,
  type,
  intensity = 50,
  centerX = 400,
  centerY = 300
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  const colors = {
    win: ['#FFD700', '#FFA500', '#FF6B35', '#FF4500'],
    jackpot: ['#FFD700', '#FF1493', '#00FFFF', '#FF69B4', '#FFFF00'],
    bonus: ['#00FF00', '#32CD32', '#ADFF2F', '#7CFC00'],
    coins: ['#FFD700', '#FFA500', '#DAA520', '#B8860B']
  };

  const createParticle = (): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 8 + 2;
    const particleColors = colors[type];
    
    return {
      x: centerX + (Math.random() - 0.5) * 50,
      y: centerY + (Math.random() - 0.5) * 50,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - Math.random() * 3,
      life: 0,
      maxLife: Math.random() * 60 + 40,
      size: Math.random() * 8 + 4,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      type: ['coin', 'sparkle', 'star', 'diamond'][Math.floor(Math.random() * 4)] as Particle['type']
    };
  };

  const updateParticles = () => {
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2; // gravity
      particle.life += 1;
      
      return particle.life < particle.maxLife;
    });

    // Add new particles if active
    if (active && particlesRef.current.length < intensity) {
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push(createParticle());
      }
    }
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const alpha = 1 - (particle.life / particle.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.life * 0.1);
    
    switch (particle.type) {
      case 'coin':
        // Draw 3D coin
        ctx.beginPath();
        ctx.ellipse(0, 0, particle.size, particle.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
        
      case 'sparkle':
        // Draw sparkle
        ctx.beginPath();
        ctx.moveTo(-particle.size, 0);
        ctx.lineTo(particle.size, 0);
        ctx.moveTo(0, -particle.size);
        ctx.lineTo(0, particle.size);
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        break;
        
      case 'star':
        // Draw star
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5;
          const x = Math.cos(angle) * particle.size;
          const y = Math.sin(angle) * particle.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'diamond':
        // Draw diamond
        ctx.beginPath();
        ctx.moveTo(0, -particle.size);
        ctx.lineTo(particle.size * 0.7, 0);
        ctx.lineTo(0, particle.size);
        ctx.lineTo(-particle.size * 0.7, 0);
        ctx.closePath();
        ctx.fill();
        break;
    }
    
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateParticles();
    
    particlesRef.current.forEach(particle => {
      drawParticle(ctx, particle);
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (active) {
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current = [];
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, type, intensity, centerX, centerY]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ width: '100%', height: '100%' }}
    />
  );
};