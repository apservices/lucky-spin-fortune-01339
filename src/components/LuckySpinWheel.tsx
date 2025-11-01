import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface LuckySpinWheelProps {
  onSpin: (multiplier: number) => void;
  onClose: () => void;
}

export const LuckySpinWheel: React.FC<LuckySpinWheelProps> = ({ onSpin, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const segments = [
    { multiplier: 2, probability: 0.70, color: 'from-yellow-500 to-yellow-600', label: 'x2' },
    { multiplier: 3, probability: 0.20, color: 'from-orange-500 to-orange-600', label: 'x3' },
    { multiplier: 5, probability: 0.09, color: 'from-red-500 to-red-600', label: 'x5' },
    { multiplier: 10, probability: 0.01, color: 'from-purple-500 to-purple-600', label: 'x10' },
  ];

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Calculate result based on probability
    const rand = Math.random();
    let cumulative = 0;
    let selectedMultiplier = 2;

    for (const segment of segments) {
      cumulative += segment.probability;
      if (rand <= cumulative) {
        selectedMultiplier = segment.multiplier;
        break;
      }
    }

    // Calculate rotation (multiple full spins + final position)
    const segmentAngle = 360 / segments.length;
    const segmentIndex = segments.findIndex(s => s.multiplier === selectedMultiplier);
    const finalAngle = segmentIndex * segmentAngle;
    const totalRotation = 360 * 5 + finalAngle; // 5 full rotations + final position

    setRotation(rotation + totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(selectedMultiplier);
      
      setTimeout(() => {
        onSpin(selectedMultiplier);
      }, 2000);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="relative max-w-md w-full bg-gradient-to-br from-pgbet-dark via-card to-pgbet-dark border-4 border-pgbet-gold p-6">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          disabled={isSpinning}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-pgbet-gold mb-2">🎰 LUCKY SPIN 🎰</h2>
            <p className="text-sm text-muted-foreground">Gire a roda da sorte!</p>
          </div>

          {/* Wheel */}
          <div className="relative w-64 h-64 mx-auto">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-pgbet-red drop-shadow-lg" />
            </div>

            {/* Wheel container */}
            <div 
              className={cn(
                "w-full h-full rounded-full border-8 border-pgbet-gold shadow-2xl overflow-hidden",
                "transition-transform duration-[4000ms] ease-out"
              )}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {segments.map((segment, index) => {
                const angle = (360 / segments.length) * index;
                return (
                  <div
                    key={index}
                    className={cn(
                      "absolute w-full h-full origin-center",
                      `bg-gradient-to-br ${segment.color}`
                    )}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((360/segments.length) * Math.PI / 180)}% ${50 - 50 * Math.cos((360/segments.length) * Math.PI / 180)}%)`
                    }}
                  >
                    <div 
                      className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-bold text-2xl drop-shadow-lg"
                      style={{ transform: `rotate(${-(angle + 45)}deg)` }}
                    >
                      {segment.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center tiger */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-pgbet-gold rounded-full flex items-center justify-center border-4 border-white shadow-lg z-20">
              <span className={cn("text-4xl", isSpinning && "animate-spin")}>🐅</span>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="animate-scale-in">
              <div className="text-5xl font-bold text-pgbet-gold animate-bounce">
                ×{result}
              </div>
              <p className="text-lg text-white mt-2">Multiplicador aplicado!</p>
            </div>
          )}

          {/* Spin button */}
          {!isSpinning && !result && (
            <Button
              onClick={spinWheel}
              className="w-full h-14 text-xl bg-pgbet-gradient-gold text-pgbet-dark font-bold hover:scale-105 transition-transform"
            >
              🎰 GIRAR RODA 🎰
            </Button>
          )}

          {isSpinning && (
            <div className="text-pgbet-gold font-bold animate-pulse">
              🐅 Girando... 🐅
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
