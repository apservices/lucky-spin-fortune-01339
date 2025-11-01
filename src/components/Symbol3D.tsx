import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Symbol3DProps {
  symbol: string;
  isSpinning?: boolean;
  isWinning?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const symbols3D = {
  '🐅': {
    name: 'Tiger',
    gradient: 'from-orange-400 via-yellow-500 to-orange-600',
    shadow: 'drop-shadow-[0_8px_16px_rgba(255,165,0,0.6)]',
    glow: 'shadow-[0_0_30px_rgba(255,165,0,0.8)]'
  },
  '🪙': {
    name: 'Coin',
    gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
    shadow: 'drop-shadow-[0_6px_12px_rgba(255,215,0,0.7)]',
    glow: 'shadow-[0_0_25px_rgba(255,215,0,0.9)]'
  },
  '🧧': {
    name: 'RedEnvelope',
    gradient: 'from-red-500 via-red-600 to-red-700',
    shadow: 'drop-shadow-[0_6px_12px_rgba(220,38,38,0.6)]',
    glow: 'shadow-[0_0_25px_rgba(220,38,38,0.8)]'
  },
  '🏮': {
    name: 'Lantern',
    gradient: 'from-red-400 via-pink-500 to-red-600',
    shadow: 'drop-shadow-[0_8px_16px_rgba(236,72,153,0.6)]',
    glow: 'shadow-[0_0_30px_rgba(236,72,153,0.8)]'
  },
  '🎆': {
    name: 'Fireworks',
    gradient: 'from-purple-400 via-pink-500 to-yellow-400',
    shadow: 'drop-shadow-[0_10px_20px_rgba(168,85,247,0.7)]',
    glow: 'shadow-[0_0_35px_rgba(168,85,247,0.9)]'
  },
  '🍊': {
    name: 'Orange',
    gradient: 'from-orange-400 via-orange-500 to-orange-600',
    shadow: 'drop-shadow-[0_6px_12px_rgba(249,115,22,0.6)]',
    glow: 'shadow-[0_0_25px_rgba(249,115,22,0.8)]'
  },
  '📜': {
    name: 'Scroll',
    gradient: 'from-amber-300 via-yellow-400 to-amber-500',
    shadow: 'drop-shadow-[0_8px_16px_rgba(245,158,11,0.6)]',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.8)]'
  },
  '🀄': {
    name: 'Mahjong',
    gradient: 'from-green-400 via-emerald-500 to-green-600',
    shadow: 'drop-shadow-[0_8px_16px_rgba(34,197,94,0.6)]',
    glow: 'shadow-[0_0_30px_rgba(34,197,94,0.8)]'
  },
  '💎': {
    name: 'Diamond',
    gradient: 'from-cyan-300 via-blue-400 to-purple-500',
    shadow: 'drop-shadow-[0_10px_20px_rgba(59,130,246,0.8)]',
    glow: 'shadow-[0_0_40px_rgba(59,130,246,1)]'
  }
};

export const Symbol3D: React.FC<Symbol3DProps> = ({
  symbol,
  isSpinning = false,
  isWinning = false,
  size = 'md',
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const symbolData = symbols3D[symbol as keyof typeof symbols3D] || {
    name: 'Default',
    gradient: 'from-gray-400 to-gray-600',
    shadow: 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]',
    glow: 'shadow-[0_0_20px_rgba(255,255,255,0.5)]'
  };

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
    xl: 'text-9xl'
  };

  const containerSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center",
        "transform-gpu perspective-1000",
        containerSizes[size],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base symbol with 3D transform */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "transform-gpu transition-all duration-300",
          sizeClasses[size],
          symbolData.shadow,
          isSpinning && "animate-realistic-spin",
          isWinning && [
            "animate-symbol-glow-dance",
            symbolData.glow,
            "brightness-125 contrast-110"
          ],
          isHovered && !isSpinning && "scale-110 brightness-110",
          "filter backdrop-blur-sm"
        )}
        style={{
          transform: isSpinning 
            ? 'perspective(1000px) rotateY(0deg) rotateX(0deg)'
            : isHovered 
            ? 'perspective(1000px) rotateY(15deg) rotateX(10deg) scale(1.1)'
            : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
          textShadow: isWinning 
            ? `0 0 20px ${symbolData.gradient.includes('yellow') ? '#FFD700' : '#FF6B35'}, 0 0 40px ${symbolData.gradient.includes('yellow') ? '#FFD700' : '#FF6B35'}`
            : '0 4px 8px rgba(0,0,0,0.5)',
          filter: isWinning 
            ? 'brightness(1.5) contrast(1.2) saturate(1.3) drop-shadow(0 0 30px currentColor)'
            : 'brightness(1.1) contrast(1.1) saturate(1.1)'
        }}
      >
        {symbol}
      </div>

      {/* Winning effect overlay */}
      {isWinning && (
        <>
          {/* Pulsing glow effect */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              sizeClasses[size],
              "opacity-60 animate-pulse",
              "filter blur-sm"
            )}
            style={{
              color: symbolData.gradient.includes('yellow') ? '#FFD700' : '#FF6B35',
              textShadow: '0 0 40px currentColor'
            }}
          >
            {symbol}
          </div>
          
          {/* Sparkle effect */}
          <div className="absolute inset-0 animate-spin">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${angle}deg) translateY(-${size === 'xl' ? '80px' : size === 'lg' ? '60px' : size === 'md' ? '40px' : '30px'}) translateX(-50%)`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Spinning trail effect */}
      {isSpinning && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            sizeClasses[size],
            "opacity-30 blur-md animate-realistic-spin-turbo"
          )}
          style={{
            animationDelay: '0.1s',
            color: symbolData.gradient.includes('yellow') ? '#FFD700' : '#FF6B35'
          }}
        >
          {symbol}
        </div>
      )}
    </div>
  );
};