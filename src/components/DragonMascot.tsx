import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Star, Zap, Gift, Trophy, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface DragonMascotProps {
  isSpinning: boolean;
  lastWin: number;
  energy: number;
  mood: 'happy' | 'excited' | 'sleepy' | 'celebrating';
}

export const DragonMascot: React.FC<DragonMascotProps> = ({
  isSpinning,
  lastWin,
  energy,
  mood
}) => {
  const [currentMood, setCurrentMood] = useState<'happy' | 'excited' | 'sleepy' | 'celebrating'>(mood);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('');
  const [isInteracting, setIsInteracting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, emoji: string}>>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentMood(mood);
    
    // Trigger animation when mood changes
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1500);
    
    // Create celebration particles for big wins
    if (mood === 'celebrating' && lastWin > 0) {
      createCelebrationParticles();
    }
    
    // Set dynamic messages based on mood and context
    const messages = {
      celebrating: [
        '🎉 Incrível! Continue assim!',
        '🎆 Que sorte espetacular!',
        '✨ Você é um verdadeiro campeão!',
        '🏆 Excelente jogada!'
      ],
      excited: [
        '⚡ Sinto uma energia poderosa!',
        '🔥 O próximo giro será especial!',
        '🌟 As estrelas estão alinhadas!',
        '💫 A fortuna está chegando!'
      ],
      sleepy: [
        '😴 Que tal uma pausa para energia?',
        '💤 Descanso traz mais sorte!',
        '⏰ Aguarde a energia se renovar',
        '🌙 Um momento de paciência...'
      ],
      happy: [
        '🐉 Bem-vindo ao reino da fortuna!',
        '💎 Pronto para grandes aventuras?',
        '🎯 Vamos buscar tesouros juntos!',
        '🌈 A sorte está ao seu lado!'
      ]
    };
    
    const moodMessages = messages[mood] || messages.happy;
    setMessage(moodMessages[Math.floor(Math.random() * moodMessages.length)]);
  }, [mood, lastWin]);

  const getMascotEmoji = () => {
    if (isInteracting) {
      return '🐲❤️';
    }
    
    switch (currentMood) {
      case 'celebrating':
        return lastWin > 1000 ? '🐲🎆' : '🐲✨';
      case 'excited':
        return energy > 5 ? '🐉⚡' : '🐉🔥';
      case 'sleepy':
        return '🐲💤';
      default:
        return '🐉💫';
    }
  };

  const getMoodColor = () => {
    if (isInteracting) {
      return 'from-pink-500/40 to-red-500/40 border-pink-500/60 shadow-lg shadow-pink-500/30';
    }
    
    switch (currentMood) {
      case 'celebrating':
        return lastWin > 1000 
          ? 'from-yellow-400/40 to-orange-500/40 border-yellow-400/60 shadow-glow-gold' 
          : 'from-fortune-gold/30 to-fortune-ember/30 border-fortune-gold/50';
      case 'excited':
        return 'from-blue-500/30 to-purple-500/30 border-blue-500/50 shadow-lg shadow-blue-500/20';
      case 'sleepy':
        return 'from-gray-600/30 to-gray-700/20 border-gray-500/50';
      default:
        return 'from-emerald-500/20 to-cyan-500/20 border-emerald-500/30';
    }
  };

  const getAnimationClass = () => {
    if (isSpinning) return 'animate-bounce';
    if (isInteracting) return 'animate-mascot-celebration';
    if (isAnimating && currentMood === 'celebrating') return 'animate-jackpot-explosion';
    if (isAnimating) return 'animate-pulse';
    if (currentMood === 'celebrating') return 'animate-pgbet-glow';
    return 'hover:scale-105 transition-transform duration-300';
  };

  const createCelebrationParticles = () => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      emoji: ['⭐', '✨', '💎', '🎉', '🔥'][Math.floor(Math.random() * 5)]
    }));
    setParticles(newParticles);
    
    setTimeout(() => setParticles([]), 3000);
  };

  const handleMascotClick = () => {
    setIsInteracting(true);
    
    const encouragements = [
      '🐉 Eu acredito em você!',
      '✨ Sua sorte está apenas começando!',
      '🎯 Foque no prêmio maior!',
      '💫 O destino favorece os corajosos!',
      '🔮 Vejo grandes vitórias em seu futuro!'
    ];
    
    toast.success(encouragements[Math.floor(Math.random() * encouragements.length)], {
      duration: 3000,
      style: {
        background: 'linear-gradient(135deg, hsl(280 100% 60%), hsl(320 100% 50%))',
        color: 'white',
        border: '2px solid hsl(300 100% 70%)',
        fontWeight: 'bold',
      }
    });
    
    createCelebrationParticles();
    
    setTimeout(() => setIsInteracting(false), 2000);
  };

  return (
    <div className="relative">
      {/* Celebration Particles */}
      {particles.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute text-lg animate-confetti-burst"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            >
              {particle.emoji}
            </div>
          ))}
        </div>
      )}

      <Card 
        ref={cardRef}
        className={`p-4 bg-gradient-to-br ${getMoodColor()} backdrop-blur-sm transition-all duration-500 ${getAnimationClass()} cursor-pointer relative overflow-hidden`}
        onClick={handleMascotClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Interactive glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-lg pointer-events-none"></div>
        
        <div className="flex items-center space-x-4 relative z-10">
          {/* Enhanced Dragon Avatar */}
          <div className="relative">
            <div className={`text-4xl transition-all duration-500 ${
              isAnimating ? 'scale-125' : isInteracting ? 'scale-110 rotate-12' : 'scale-100'
            }`}>
              {getMascotEmoji()}
            </div>
            
            {/* Dynamic mood particles */}
            {currentMood === 'celebrating' && (
              <div className="absolute -top-2 -right-2">
                {lastWin > 1000 ? (
                  <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />
                ) : (
                  <Sparkles className="w-4 h-4 text-fortune-gold animate-spin" />
                )}
              </div>
            )}
            {currentMood === 'excited' && (
              <div className="absolute -top-2 -right-2">
                <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>
            )}
            {currentMood === 'happy' && (
              <div className="absolute -top-2 -right-2">
                <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
              </div>
            )}
            {currentMood === 'sleepy' && (
              <div className="absolute -top-2 -right-2">
                <div className="text-xs animate-pulse">💤</div>
              </div>
            )}
            
            {/* Win celebration crown */}
            {lastWin > 500 && currentMood === 'celebrating' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Crown className="w-6 h-6 text-yellow-400 animate-bounce" />
              </div>
            )}
          </div>
          
          {/* Enhanced Message Bubble */}
          <div className="flex-1">
            <div className={`bg-card/90 rounded-lg p-3 border relative transition-all duration-300 ${
              currentMood === 'celebrating' 
                ? 'border-yellow-400/60 bg-gradient-to-r from-yellow-50/10 to-orange-50/10' 
                : 'border-border/50'
            }`}>
              <p className={`text-sm font-medium transition-colors duration-300 ${
                currentMood === 'celebrating' ? 'text-yellow-200' : 'text-foreground'
              }`}>
                {message}
              </p>
              
              {/* Enhanced speech bubble tail */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                <div className={`w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent ${
                  currentMood === 'celebrating' ? 'border-r-yellow-400/60' : 'border-r-card/90'
                }`}></div>
              </div>
              
              {/* Tooltip for interaction */}
              {showTooltip && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap animate-fade-in">
                  Clique para interagir! 
                </div>
              )}
            </div>
            
            {/* Enhanced Mood indicator */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  currentMood === 'celebrating' ? 'bg-yellow-400/20 text-yellow-300' :
                  currentMood === 'excited' ? 'bg-blue-400/20 text-blue-300' :
                  currentMood === 'sleepy' ? 'bg-gray-400/20 text-gray-300' :
                  'bg-emerald-400/20 text-emerald-300'
                }`}>
                  {currentMood === 'celebrating' && <Trophy className="w-3 h-3" />}
                  {currentMood === 'excited' && <Zap className="w-3 h-3" />}
                  {currentMood === 'sleepy' && <div className="text-xs">💤</div>}
                  {currentMood === 'happy' && <Heart className="w-3 h-3" />}
                  <span className="capitalize font-medium">{currentMood}</span>
                </div>
              </div>
              
              {lastWin > 0 && (
                <div className={`text-xs font-bold ${
                  lastWin > 1000 ? 'text-yellow-300' : 'text-fortune-gold'
                }`}>
                  🏆 +{lastWin.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Premium Energy status */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className={`w-4 h-4 transition-colors duration-300 ${
                energy > 7 ? 'text-green-400' : 
                energy > 3 ? 'text-yellow-400' : 
                energy > 0 ? 'text-orange-400' : 'text-red-400'
              }`} />
              <span className="text-xs font-medium text-foreground">Energia do Dragão</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">{energy}/10</span>
          </div>
          
          <div className="flex-1 bg-muted/50 rounded-full h-3 relative overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                energy > 0 ? 'animate-energy-pulse' : 'bg-red-400/50'
              }`}
              style={{ 
                width: `${(energy / 10) * 100}%`,
                background: energy > 0 ? 'linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--primary)))' : undefined
              }}
            />
            {/* Energy sparkles */}
            {energy > 7 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Quick energy tip */}
          {energy === 0 && (
            <div className="text-xs text-muted-foreground italic text-center">
              💡 Aguarde 1 min ou assista um anúncio para recarregar
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};