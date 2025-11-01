import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  symbol: string;
  layer: number;
  rotation: number;
  rotationSpeed: number;
}

export const ParallaxBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Create floating elements
    const newElements: FloatingElement[] = [];
    const symbols = ['🪙', '🧧', '🏮', '🎆', '💎', '⭐', '✨', '🌟'];
    
    for (let i = 0; i < 30; i++) {
      newElements.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 40 + 20,
        speed: Math.random() * 0.5 + 0.1,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        layer: Math.floor(Math.random() * 3) + 1, // 1, 2, or 3
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      });
    }
    
    setElements(newElements);
  }, []);

  useEffect(() => {
    const animate = () => {
      setElements(prev => 
        prev.map(element => ({
          ...element,
          y: element.y - element.speed,
          rotation: element.rotation + element.rotationSpeed,
          // Reset position when it goes off screen
          ...(element.y < -100 ? {
            y: window.innerHeight + 100,
            x: Math.random() * window.innerWidth
          } : {})
        }))
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-pgbet-dark via-card to-background opacity-95" />
      
      {/* Animated mesh background */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-pgbet-gold/20 via-transparent to-pgbet-red/20 animate-pulse"
          style={{ 
            background: `
              radial-gradient(circle at 20% 20%, hsl(var(--pgbet-gold) / 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, hsl(var(--pgbet-red) / 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, hsl(var(--pgbet-emerald) / 0.2) 0%, transparent 50%)
            `
          }}
        />
      </div>

      {/* Layer 1 - Background elements (slowest) */}
      {elements.filter(el => el.layer === 1).map(element => (
        <div
          key={`layer1-${element.id}`}
          className="absolute opacity-20 animate-floating-coins-premium"
          style={{
            left: element.x,
            top: element.y,
            fontSize: element.size * 0.6,
            transform: `rotate(${element.rotation}deg)`,
            animationDelay: `${element.id * 0.2}s`,
            filter: 'blur(2px)'
          }}
        >
          {element.symbol}
        </div>
      ))}

      {/* Layer 2 - Middle elements */}
      {elements.filter(el => el.layer === 2).map(element => (
        <div
          key={`layer2-${element.id}`}
          className="absolute opacity-30 animate-floating-coins-premium"
          style={{
            left: element.x,
            top: element.y,
            fontSize: element.size * 0.8,
            transform: `rotate(${element.rotation}deg)`,
            animationDelay: `${element.id * 0.15}s`,
            filter: 'blur(1px)'
          }}
        >
          {element.symbol}
        </div>
      ))}

      {/* Layer 3 - Foreground elements (fastest) */}
      {elements.filter(el => el.layer === 3).map(element => (
        <div
          key={`layer3-${element.id}`}
          className="absolute opacity-40 animate-floating-coins-premium"
          style={{
            left: element.x,
            top: element.y,
            fontSize: element.size,
            transform: `rotate(${element.rotation}deg)`,
            animationDelay: `${element.id * 0.1}s`,
            textShadow: '0 0 10px currentColor'
          }}
        >
          {element.symbol}
        </div>
      ))}

      {/* Floating light orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`orb-${i}`}
            className={cn(
              "absolute rounded-full opacity-40",
              "animate-floating-coins-premium",
              i % 2 === 0 ? "bg-pgbet-gold/30" : "bg-pgbet-red/30"
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              filter: 'blur(20px)',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Top gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-pgbet-dark/80 to-transparent" />
      
      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-pgbet-dark/80 to-transparent" />
    </div>
  );
};