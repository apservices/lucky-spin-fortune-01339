import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Coins, Crown, Star, Sparkles, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface ZodiacFortuneSlotProps {
  coins: number;
  energy: number;
  onCoinsChange: (newCoins: number) => void;
  onEnergyChange: (newEnergy: number) => void;
}

type Symbol = {
  emoji: string;
  name: string;
  multiplier: number;
  rarity: 'common' | 'rare' | 'legendary';
  color: string;
};

const symbols: Symbol[] = [
  { emoji: '🐯', name: 'Tigre Dourado', multiplier: 15, rarity: 'legendary', color: 'text-yellow-400' },
  { emoji: '🦊', name: 'Raposa da Sorte', multiplier: 8, rarity: 'rare', color: 'text-orange-400' },
  { emoji: '🐸', name: 'Sapo da Prosperidade', multiplier: 6, rarity: 'rare', color: 'text-green-400' },
  { emoji: '🍊', name: 'Laranja da Fortuna', multiplier: 4, rarity: 'common', color: 'text-orange-300' },
  { emoji: '🧧', name: 'Envelope Vermelho', multiplier: 5, rarity: 'common', color: 'text-red-400' },
  { emoji: '📜', name: 'Pergaminho Místico', multiplier: 7, rarity: 'rare', color: 'text-amber-300' },
];

export const ZodiacFortuneSlot: React.FC<ZodiacFortuneSlotProps> = ({
  coins,
  energy,
  onCoinsChange,
  onEnergyChange
}) => {
  const [reels, setReels] = useState<Symbol[][]>([
    [symbols[0], symbols[1], symbols[2]],
    [symbols[3], symbols[4], symbols[5]],
    [symbols[1], symbols[2], symbols[0]]
  ]);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [bet, setBet] = useState(50);
  const [autoSpin, setAutoSpin] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const [showJackpot, setShowJackpot] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [winningSymbol, setWinningSymbol] = useState<Symbol | null>(null);
  const [winLine, setWinLine] = useState<string>('');
  
  // Refs for premium effects
  const slotRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Floating coins animation  
  const [floatingCoins, setFloatingCoins] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [confettiParticles, setConfettiParticles] = useState<Array<{id: number, x: number, y: number, color: string}>>([]);

  useEffect(() => {
    // Generate floating coins background
    const generateFloatingCoins = () => {
      const coins = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setFloatingCoins(coins);
    };
    
    generateFloatingCoins();
    const interval = setInterval(generateFloatingCoins, 10000);
    return () => clearInterval(interval);
  }, []);

  const getRandomSymbol = (): Symbol => {
    const weights = {
      common: 0.6,
      rare: 0.3,
      legendary: 0.1
    };
    
    const random = Math.random();
    let rarity: 'common' | 'rare' | 'legendary';
    
    if (random < weights.legendary) {
      rarity = 'legendary';
    } else if (random < weights.legendary + weights.rare) {
      rarity = 'rare';
    } else {
      rarity = 'common';
    }
    
    const filteredSymbols = symbols.filter(s => s.rarity === rarity);
    return filteredSymbols[Math.floor(Math.random() * filteredSymbols.length)];
  };

  const checkWin = (newReels: Symbol[][]) => {
    // Check middle row (line win)
    const middleRow = [newReels[0][1], newReels[1][1], newReels[2][1]];
    
    if (middleRow[0].name === middleRow[1].name && middleRow[1].name === middleRow[2].name) {
      const symbol = middleRow[0];
      const winAmount = bet * symbol.multiplier;
      return { win: true, amount: winAmount, symbol, line: 'middle' };
    }
    
    // Check other winning patterns (optional bonus)
    const topRow = [newReels[0][0], newReels[1][0], newReels[2][0]];
    const bottomRow = [newReels[0][2], newReels[1][2], newReels[2][2]];
    
    if (topRow[0].name === topRow[1].name && topRow[1].name === topRow[2].name) {
      const symbol = topRow[0];
      const winAmount = Math.floor(bet * symbol.multiplier * 0.5);
      return { win: true, amount: winAmount, symbol, line: 'top' };
    }
    
    if (bottomRow[0].name === bottomRow[1].name && bottomRow[1].name === bottomRow[2].name) {
      const symbol = bottomRow[0];
      const winAmount = Math.floor(bet * symbol.multiplier * 0.5);
      return { win: true, amount: winAmount, symbol, line: 'bottom' };
    }
    
    return { win: false, amount: 0, symbol: null, line: null };
  };

  const spin = async () => {
    if (energy < 1) {
      toast.error('⚡ Energia insuficiente! Aguarde ou assista um anúncio.');
      return;
    }
    
    if (coins < bet) {
      toast.error('💰 Moedas insuficientes para esta aposta!');
      return;
    }

    setIsSpinning(true);
    setShowWin(false);
    
    // Consume energy and bet
    onEnergyChange(energy - 1);
    onCoinsChange(coins - bet);

    // Animate reels spinning
    const spinDuration = turboMode ? 1000 : 2000;
    
    setTimeout(() => {
      const newReels = [
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
      ];
      
      setReels(newReels);
      
      const result = checkWin(newReels);
      
      if (result.win) {
        setLastWin(result.amount);
        setShowWin(true);
        setWinningSymbol(result.symbol);
        setWinLine(result.line || '');
        onCoinsChange(coins - bet + result.amount);
        
        // Trigger premium effects based on win amount
        if (result.amount >= bet * 10) {
          // Mega jackpot effects
          setShowJackpot(true);
          setShowConfetti(true);
          generateConfetti();
          
          // Add mobile vibration for jackpot
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
          }
          
          toast.success(
            `🎆 MEGA JACKPOT! ${result.symbol?.emoji} ${result.symbol?.name}! +${result.amount} moedas! 🎆`,
            {
              duration: 6000,
              style: {
                background: 'linear-gradient(135deg, hsl(45 100% 60%), hsl(0 85% 55%), hsl(45 100% 60%))',
                color: 'hsl(0 0% 0%)',
                border: '3px solid hsl(45 100% 70%)',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 0 30px hsl(45 100% 50% / 0.8)',
              }
            }
          );
          
          setTimeout(() => {
            setShowJackpot(false);
            setShowConfetti(false);
          }, 4000);
          
        } else if (result.amount >= bet * 5) {
          // Big win effects
          if (navigator.vibrate) {
            navigator.vibrate([150, 50, 150]);
          }
          
          toast.success(
            `🎉 GRANDE VITÓRIA! ${result.symbol?.emoji} ${result.symbol?.name} - Linha ${result.line?.toUpperCase()}! +${result.amount} moedas!`,
            {
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, hsl(45 100% 50%), hsl(0 85% 50%))',
                color: 'hsl(0 0% 0%)',
                border: '2px solid hsl(45 100% 70%)',
                fontWeight: 'bold',
                boxShadow: '0 0 20px hsl(45 100% 50% / 0.6)',
              }
            }
          );
        } else {
          // Normal win effects
          if (navigator.vibrate) {
            navigator.vibrate([100]);
          }
          
          toast.success(
            `🎰 Vitória! ${result.symbol?.emoji} ${result.symbol?.name}! +${result.amount} moedas!`,
            {
              duration: 3000,
              style: {
                background: 'linear-gradient(135deg, hsl(45 100% 50%), hsl(25 100% 55%))',
                color: 'hsl(0 0% 0%)',
                border: '2px solid hsl(45 100% 60%)',
                fontWeight: 'bold',
              }
            }
          );
        }
        
        // Hide win animation after delay
        setTimeout(() => {
          setShowWin(false);
          setWinningSymbol(null);
          setWinLine('');
        }, showJackpot ? 4000 : 3000);
      }
      
      setIsSpinning(false);
    }, spinDuration);
  };

  const adjustBet = (increment: boolean) => {
    if (increment && bet < 500) {
      setBet(prev => Math.min(prev + 25, 500));
    } else if (!increment && bet > 25) {
      setBet(prev => Math.max(prev - 25, 25));
    }
  };

  const generateConfetti = () => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['hsl(45 100% 50%)', 'hsl(0 85% 50%)', 'hsl(25 100% 55%)', 'hsl(142 86% 45%)'][Math.floor(Math.random() * 4)]
    }));
    setConfettiParticles(particles);
    
    setTimeout(() => setConfettiParticles([]), 2000);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Jackpot Explosion Overlay */}
      {showJackpot && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-red-500/30 to-yellow-400/30 animate-jackpot-explosion rounded-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl animate-mascot-celebration">🎆</div>
          </div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-2xl font-bold text-yellow-300 animate-bounce">
              MEGA JACKPOT!
            </div>
            <div className="text-xl text-red-300 animate-pulse">
              {winningSymbol?.emoji} {winningSymbol?.name}
            </div>
          </div>
        </div>
      )}

      {/* Confetti Particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          {confettiParticles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-3 h-3 animate-confetti-burst"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                backgroundColor: particle.color,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Premium Floating Coins Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingCoins.map(coin => (
          <div
            key={coin.id}
            className="absolute text-2xl opacity-30 animate-floating-coins-premium"
            style={{
              left: `${coin.x}%`,
              top: `${coin.y}%`,
              animationDelay: `${coin.id * 0.5}s`,
              filter: 'drop-shadow(0 0 10px hsl(45 100% 50% / 0.6))'
            }}
          >
            🪙
          </div>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-pgbet-dark via-black to-pgbet-dark border-2 border-pgbet-gold shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-pgbet-gradient-gold bg-clip-text text-transparent mb-2">
            🐯 Zodiac Fortune Slots 🐯
          </h2>
          <Badge className="bg-pgbet-red text-white animate-pulse">
            Edição Tigre da Fortuna
          </Badge>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-pgbet-gold/10 rounded-lg border border-pgbet-gold/30">
            <Coins className="w-6 h-6 text-pgbet-gold mx-auto mb-1" />
            <div className="text-xl font-bold text-pgbet-gold">{coins}</div>
            <div className="text-xs text-gray-400">Moedas</div>
          </div>
          
          <div className="text-center p-3 bg-pgbet-red/10 rounded-lg border border-pgbet-red/30">
            <Zap className="w-6 h-6 text-pgbet-red mx-auto mb-1" />
            <div className="text-xl font-bold text-pgbet-red">{energy}</div>
            <div className="text-xs text-gray-400">Energia</div>
          </div>
          
          <div className="text-center p-3 bg-pgbet-emerald/10 rounded-lg border border-pgbet-emerald/30">
            <Crown className="w-6 h-6 text-pgbet-emerald mx-auto mb-1" />
            <div className="text-xl font-bold text-pgbet-emerald">{bet}</div>
            <div className="text-xs text-gray-400">Aposta</div>
          </div>
        </div>

        {/* Premium Slot Machine - 3x3 Grid */}
        <div ref={slotRef} className="relative mb-6">
          {showWin && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-red-500/30 to-yellow-400/30 animate-pgbet-win-pulse rounded-lg z-10"></div>
          )}
          
          <div className="grid grid-cols-3 gap-3 p-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-xl border-4 border-pgbet-gold shadow-2xl relative overflow-hidden">
            {/* Enhanced 3D Perspective Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pgbet-gold/10 via-transparent to-pgbet-red/10 rounded-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5 rounded-lg"></div>
            
            {/* Sparkle effects for wins */}
            {showWin && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <Sparkles className="absolute top-4 left-4 w-6 h-6 text-yellow-400 animate-pgbet-sparkle" />
                <Sparkles className="absolute top-4 right-4 w-6 h-6 text-yellow-400 animate-pgbet-sparkle" style={{animationDelay: '0.3s'}} />
                <Sparkles className="absolute bottom-4 left-4 w-6 h-6 text-yellow-400 animate-pgbet-sparkle" style={{animationDelay: '0.6s'}} />
                <Sparkles className="absolute bottom-4 right-4 w-6 h-6 text-yellow-400 animate-pgbet-sparkle" style={{animationDelay: '0.9s'}} />
              </div>
            )}
            
            {reels.map((column, colIndex) => (
              <div key={colIndex} className="space-y-3 relative">
                {column.map((symbol, rowIndex) => (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    className={`
                      h-24 flex items-center justify-center text-5xl relative
                      bg-gradient-to-br from-gray-800 via-gray-900 to-black
                      border-3 border-gradient-to-r from-pgbet-gold/50 to-pgbet-red/50
                      rounded-xl shadow-lg transform-gpu
                      ${isSpinning 
                        ? (turboMode ? 'animate-realistic-spin-turbo' : 'animate-realistic-spin')
                        : 'hover:scale-105 transition-all duration-300'
                      }
                      ${showWin && rowIndex === 1 
                        ? 'ring-4 ring-pgbet-gold animate-symbol-glow-dance scale-110 shadow-2xl shadow-pgbet-gold/50' 
                        : ''
                      }
                      before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:to-transparent before:rounded-xl before:pointer-events-none
                      after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/40 after:to-transparent after:rounded-xl after:pointer-events-none
                    `}
                    style={{
                      transform: !isSpinning ? 'perspective(1000px) rotateX(2deg) rotateY(1deg)' : undefined,
                      boxShadow: showWin && rowIndex === 1 
                        ? '0 0 50px rgba(255, 215, 0, 0.9), inset 0 0 30px rgba(255, 215, 0, 0.4), 0 0 100px rgba(255, 69, 0, 0.3)' 
                        : '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    <span 
                      className={`${symbol.color} relative z-10 drop-shadow-lg transform transition-all duration-300 ${
                        showWin && rowIndex === 1 ? 'animate-symbol-glow-dance scale-125' : ''
                      }`}
                      style={{
                        filter: showWin && rowIndex === 1 
                          ? 'drop-shadow(0 0 20px currentColor) drop-shadow(0 0 40px currentColor)' 
                          : 'drop-shadow(0 0 15px currentColor)',
                        textShadow: showWin && rowIndex === 1 
                          ? '0 0 30px currentColor, 0 0 60px currentColor, 0 0 90px currentColor' 
                          : '0 0 20px currentColor, 0 0 40px currentColor'
                      }}
                    >
                      {symbol.emoji}
                    </span>
                    
                    {/* Enhanced mystical glow effect */}
                    <div className={`absolute inset-0 bg-gradient-radial from-current/25 to-transparent rounded-xl ${
                      showWin && rowIndex === 1 ? 'animate-ping opacity-75' : 'opacity-20'
                    }`} style={{background: `radial-gradient(circle, ${symbol.color.replace('text-', '')} 0%, transparent 70%)`}}></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Enhanced Win Line Indicator */}
          <div className={`absolute top-1/2 left-4 right-4 h-2 bg-gradient-to-r from-transparent via-pgbet-gold to-transparent transform -translate-y-1/2 rounded-full pointer-events-none ${
            showWin ? 'animate-win-line-sweep opacity-100' : 'opacity-50'
          }`}></div>
          
          {/* Win line label */}
          {showWin && winLine && (
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-pgbet-gold text-black px-2 py-1 rounded text-xs font-bold animate-bounce">
              LINHA {winLine.toUpperCase()}
            </div>
          )}
        </div>

        {/* Enhanced Win Display */}
        {showWin && lastWin > 0 && (
          <div className="text-center mb-4 p-4 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-lg animate-pgbet-win-pulse relative overflow-hidden">
            <div className="relative z-10">
              {lastWin >= bet * 10 ? (
                <div className="space-y-2">
                  <div className="text-black font-bold text-3xl animate-bounce">
                    🎆 MEGA JACKPOT! 🎆
                  </div>
                  <div className="text-black font-bold text-xl">
                    {winningSymbol?.emoji} {winningSymbol?.name}
                  </div>
                  <div className="text-black font-bold text-2xl">
                    +{lastWin.toLocaleString()} MOEDAS!
                  </div>
                </div>
              ) : lastWin >= bet * 5 ? (
                <div className="space-y-1">
                  <div className="text-black font-bold text-2xl animate-pulse">
                    🎉 GRANDE VITÓRIA! 🎉
                  </div>
                  <div className="text-black font-bold text-xl">
                    +{lastWin.toLocaleString()} moedas!
                  </div>
                </div>
              ) : (
                <div className="text-black font-bold text-xl">
                  🎰 Vitória! +{lastWin} moedas! 🎰
                </div>
              )}
            </div>
            
            {/* Sparkle overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full opacity-80 animate-ping"></div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-60 animate-ping" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-white rounded-full opacity-60 animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-white rounded-full opacity-80 animate-ping" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4">
          {/* Bet Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustBet(false)}
              disabled={bet <= 25}
              className="border-pgbet-gold text-pgbet-gold hover:bg-pgbet-gold/10"
            >
              -
            </Button>
            <span className="text-pgbet-gold font-bold min-w-[80px] text-center">
              Aposta: {bet}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustBet(true)}
              disabled={bet >= 500}
              className="border-pgbet-gold text-pgbet-gold hover:bg-pgbet-gold/10"
            >
              +
            </Button>
          </div>

          {/* Premium Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              ref={buttonRef}
              onClick={spin}
              disabled={isSpinning || energy < 1 || coins < bet}
              className={`h-14 bg-pgbet-gradient-gold text-black font-bold text-lg hover:scale-105 transform transition-all disabled:opacity-50 relative overflow-hidden ${
                !isSpinning && !showWin ? 'animate-button-pulse-premium' : ''
              }`}
              style={{
                boxShadow: '0 0 30px hsl(45 100% 50% / 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              {isSpinning ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin">🎰</div>
                  <span>GIRANDO...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 animate-bounce" />
                  <span>TESTAR SORTE</span>
                </div>
              )}
              
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setTurboMode(!turboMode)}
              className={`h-14 border-2 font-bold transition-all ${
                turboMode 
                  ? 'border-pgbet-red bg-pgbet-red/20 text-pgbet-red animate-pulse shadow-lg shadow-pgbet-red/30' 
                  : 'border-pgbet-purple text-pgbet-purple hover:bg-pgbet-purple/10 hover:scale-105'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Zap className={`w-5 h-5 ${turboMode ? 'animate-bounce' : ''}`} />
                <span>{turboMode ? 'TURBO ATIVO' : 'MODO TURBO'}</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Paytable Info */}
        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center text-pgbet-gold font-bold mb-2">💰 Tabela de Pagamentos</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {symbols.map(symbol => (
              <div key={symbol.name} className="flex items-center justify-between">
                <span className={`${symbol.color} mr-2`}>{symbol.emoji}</span>
                <span className="text-gray-300">{symbol.multiplier}x</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};