import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Volume2, VolumeX, Info } from 'lucide-react';

interface FortuneTigerGameProps {
  coins: number;
  onCoinsChange: (coins: number) => void;
  onSpinComplete: (result: any) => void;
  onBack: () => void;
  spinHistory: any[];
}

// Símbolos do Fortune Tiger (3x3 grid)
const SYMBOLS = {
  TIGER: { emoji: '🐯', name: 'Tigre Wild', multiplier: 10, color: 'text-pgbet-gold' },
  SCATTER: { emoji: '🪙', name: 'Moeda Scatter', multiplier: 5, color: 'text-pgbet-amber' },
  GOLD: { emoji: '💰', name: 'Ouro', multiplier: 3, color: 'text-pgbet-gold' },
  LANTERN: { emoji: '🏮', name: 'Lanterna', multiplier: 2.5, color: 'text-pgbet-red' },
  COIN: { emoji: '🧧', name: 'Envelope', multiplier: 2, color: 'text-pgbet-crimson' },
  LUCKY: { emoji: '🍀', name: 'Trevo', multiplier: 1.5, color: 'text-pgbet-emerald' },
  DRAGON: { emoji: '🐉', name: 'Dragão', multiplier: 2.8, color: 'text-pgbet-red' },
};

const SYMBOL_KEYS = Object.keys(SYMBOLS) as Array<keyof typeof SYMBOLS>;

// Linhas de pagamento (3x3): 3 horizontais + 2 diagonais
const PAYLINES = [
  [0, 1, 2], // Top horizontal
  [3, 4, 5], // Middle horizontal
  [6, 7, 8], // Bottom horizontal
  [0, 4, 8], // Diagonal \
  [2, 4, 6], // Diagonal /
];

export const FortuneTigerGame: React.FC<FortuneTigerGameProps> = ({
  coins,
  onCoinsChange,
  onSpinComplete,
  onBack,
  spinHistory
}) => {
  // Game state
  const [reels, setReels] = useState<Array<keyof typeof SYMBOLS>>(
    Array(9).fill('LUCKY')
  );
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [autoSpinCount, setAutoSpinCount] = useState(0);
  const [winAmount, setWinAmount] = useState(0);
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [freeSpins, setFreeSpins] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const BET_OPTIONS = [1, 5, 10, 50, 100];

  // Calculate RTP-based spin result (96.81% RTP)
  const calculateSpin = (): {
    reels: Array<keyof typeof SYMBOLS>;
    won: boolean;
    winAmount: number;
    winningLines: number[];
    triggeredFreeSpins: boolean;
  } => {
    const random = Math.random();
    let newReels: Array<keyof typeof SYMBOLS> = [];
    
    // RTP 96.81%: 40% small wins, 8% medium, 3% big, 1% jackpot
    if (random < 0.40) {
      // Small win (40%)
      const winSymbol = SYMBOL_KEYS[Math.floor(Math.random() * (SYMBOL_KEYS.length - 2)) + 2];
      const winLine = PAYLINES[Math.floor(Math.random() * PAYLINES.length)];
      
      newReels = Array(9).fill(null).map((_, i) => {
        if (winLine.includes(i)) {
          return winSymbol;
        }
        return SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
      });
      
      const multiplier = SYMBOLS[winSymbol].multiplier;
      return {
        reels: newReels,
        won: true,
        winAmount: Math.floor(bet * multiplier),
        winningLines: [PAYLINES.indexOf(winLine)],
        triggeredFreeSpins: false
      };
    } else if (random < 0.48) {
      // Medium win with GOLD (8%)
      const winLine = PAYLINES[Math.floor(Math.random() * PAYLINES.length)];
      newReels = Array(9).fill(null).map((_, i) => {
        if (winLine.includes(i)) return 'GOLD';
        return SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
      });
      
      return {
        reels: newReels,
        won: true,
        winAmount: Math.floor(bet * 3),
        winningLines: [PAYLINES.indexOf(winLine)],
        triggeredFreeSpins: false
      };
    } else if (random < 0.51) {
      // Big win with TIGER (3%)
      const winLine = PAYLINES[Math.floor(Math.random() * 3)]; // Favor horizontal
      newReels = Array(9).fill(null).map((_, i) => {
        if (winLine.includes(i)) return 'TIGER';
        return SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
      });
      
      return {
        reels: newReels,
        won: true,
        winAmount: Math.floor(bet * 10),
        winningLines: [PAYLINES.indexOf(winLine)],
        triggeredFreeSpins: false
      };
    } else if (random < 0.52) {
      // Mega win - multiple lines (1%)
      newReels = [
        'TIGER', 'TIGER', 'TIGER',
        'GOLD', 'GOLD', 'GOLD',
        'SCATTER', 'SCATTER', 'SCATTER'
      ];
      
      return {
        reels: newReels,
        won: true,
        winAmount: Math.floor(bet * 25),
        winningLines: [0, 1, 2],
        triggeredFreeSpins: true
      };
    } else {
      // Loss (48.19% - makes total 100%)
      newReels = Array(9).fill(null).map(() => 
        SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)]
      );
      
      // Ensure no winning lines
      const hasWin = PAYLINES.some(line => {
        const [a, b, c] = line;
        return newReels[a] === newReels[b] && newReels[b] === newReels[c];
      });
      
      if (hasWin) {
        // Break the pattern
        newReels[4] = SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
      }
      
      return {
        reels: newReels,
        won: false,
        winAmount: 0,
        winningLines: [],
        triggeredFreeSpins: false
      };
    }
  };

  // Play sounds (Web Audio API simulation)
  const playSound = (type: 'spin' | 'win' | 'bigwin' | 'freespins') => {
    if (!soundEnabled) return;
    
    // Visual feedback only (real sound would need audio files)
    if (type === 'win') {
      toast('🔔 Ding!', { duration: 500 });
    } else if (type === 'bigwin') {
      toast('🎉 BIG WIN!', { duration: 1000 });
    } else if (type === 'freespins') {
      toast('🐯 FREE SPINS!', { duration: 1500 });
    }
  };

  // Main spin function
  const handleSpin = async () => {
    if (spinning) return;
    
    if (freeSpins === 0 && coins < bet) {
      toast.error('Moedas insuficientes! Vá para a Loja 🏪');
      return;
    }

    setSpinning(true);
    setWinAmount(0);
    setWinningLines([]);
    setShowWinAnimation(false);

    // Deduct bet (if not free spin)
    if (freeSpins === 0) {
      onCoinsChange(coins - bet);
    } else {
      setFreeSpins(freeSpins - 1);
      toast.info(`🎰 Free Spin! Restam ${freeSpins - 1}`, { duration: 1000 });
    }

    playSound('spin');

    // Animate spinning (show random symbols) - velocidade viciante
    const spinDuration = 2000;
    let tickSpeed = 80; // Começa rápido
    const interval = setInterval(() => {
      setReels(Array(9).fill(null).map(() => 
        SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)]
      ));
      tickSpeed += 10; // Desacelera progressivamente para criar tensão
    }, tickSpeed);

    // Calculate final result
    setTimeout(() => {
      clearInterval(interval);
      
      const result = calculateSpin();
      setReels(result.reels);
      setWinningLines(result.winningLines);
      
      if (result.won) {
        setWinAmount(result.winAmount);
        setShowWinAnimation(true);
        onCoinsChange(coins - bet + result.winAmount);
        
        if (result.winAmount >= bet * 5) {
          playSound('bigwin');
          toast.success(`🐯 BIG WIN! +${result.winAmount} moedas! 🎉`, {
            duration: 3000,
            style: {
              background: 'hsl(var(--pgbet-gold))',
              color: 'hsl(var(--pgbet-dark))',
              fontSize: '18px',
              fontWeight: 'bold'
            }
          });
        } else {
          playSound('win');
          toast.success(`🎊 Vitória! +${result.winAmount} moedas`, { duration: 2000 });
        }
        
        if (result.triggeredFreeSpins) {
          setFreeSpins(10);
          playSound('freespins');
          toast('🐯 10 FREE SPINS ATIVADOS! 🎰', {
            duration: 4000,
            style: {
              background: 'hsl(var(--pgbet-red))',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold'
            }
          });
        }
      } else {
        // Tease messages para manter engajamento
        const teaseMessages = [
          '😮 Tão perto! Continue girando! 🐯',
          '💪 Quase lá! Próximo giro pode ser o grande! 🎰',
          '🔥 Tigre está aquecendo! Gire de novo! 💰',
          '⚡ Quase vitória! Não desista agora! 🪙'
        ];
        toast(teaseMessages[Math.floor(Math.random() * teaseMessages.length)], { 
          duration: 1800,
          style: {
            background: 'hsl(var(--pgbet-crimson))',
            color: 'white'
          }
        });
      }

      onSpinComplete({
        bet,
        won: result.won,
        winAmount: result.winAmount,
        symbols: result.reels,
        timestamp: Date.now()
      });

      setSpinning(false);

      // Auto-spin logic
      if (autoSpinCount > 0) {
        setAutoSpinCount(autoSpinCount - 1);
        setTimeout(() => handleSpin(), 1000);
      }
    }, spinDuration);
  };

  // Auto spin
  const handleAutoSpin = (count: number) => {
    setAutoSpinCount(count);
    handleSpin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pgbet-dark via-pgbet-crimson/10 to-pgbet-dark relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl animate-floating-coins-premium"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          >
            {['🪙', '🐯', '💰', '🧧', '🏮'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="bg-pgbet-dark/80 border-pgbet-gold text-pgbet-gold hover:bg-pgbet-gold hover:text-pgbet-dark"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="outline"
              size="icon"
              className="bg-pgbet-dark/80 border-pgbet-gold"
            >
              {soundEnabled ? <Volume2 className="text-pgbet-gold" /> : <VolumeX className="text-muted-foreground" />}
            </Button>
            
            <Button
              onClick={() => setShowInfo(!showInfo)}
              variant="outline"
              size="icon"
              className="bg-pgbet-dark/80 border-pgbet-gold"
            >
              <Info className="text-pgbet-gold" />
            </Button>
          </div>
        </div>

        {/* Game title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <div className="text-6xl md:text-7xl animate-mascot-celebration filter drop-shadow-2xl">🐯</div>
            <h1 className="text-4xl md:text-5xl font-black bg-pgbet-gradient-gold bg-clip-text text-transparent animate-pulse">
              FORTUNE TIGER
            </h1>
          </div>
          <p className="text-sm md:text-base text-pgbet-gold font-bold animate-symbol-glow-dance">
            🎰 RTP 96,81% • 3x3 Grid • 5 Linhas de Pagamento 🐯
          </p>
          {freeSpins > 0 && (
            <Badge className="bg-pgbet-red text-white text-lg font-bold animate-button-pulse-premium px-6 py-2 shadow-lg">
              🎰 {freeSpins} FREE SPINS ATIVOS! 🐯
            </Badge>
          )}
        </div>

        {/* Info panel */}
        {showInfo && (
          <Card className="bg-card/95 border-2 border-pgbet-gold p-4">
            <h3 className="text-xl font-bold text-pgbet-gold mb-3">📋 Como Jogar</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Grid:</strong> 3x3 com 5 linhas de pagamento (3 horizontais + 2 diagonais)</p>
              <p><strong>Wild:</strong> 🐯 Tigre substitui todos (x10)</p>
              <p><strong>Scatter:</strong> 🪙 3 Moedas = 10 Free Spins</p>
              <p><strong>RTP:</strong> 96,81% (Volatilidade Média)</p>
              <p className="text-pgbet-gold font-bold">💡 Dica: Apostas maiores = prêmios maiores!</p>
            </div>
          </Card>
        )}

        {/* Balance */}
        <Card className="bg-gradient-to-r from-pgbet-gold/20 to-pgbet-red/20 border-2 border-pgbet-gold p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className="text-3xl font-black text-pgbet-gold">
                🪙 {coins.toLocaleString('pt-BR')}
              </p>
            </div>
            {winAmount > 0 && showWinAnimation && (
              <div className="text-right animate-jackpot-explosion">
                <p className="text-sm text-pgbet-emerald">Vitória!</p>
                <p className="text-3xl font-black text-pgbet-emerald">
                  +{winAmount.toLocaleString('pt-BR')} 🎉
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* 3x3 Slot Grid */}
        <Card className="bg-gradient-to-br from-pgbet-dark/90 to-card/90 border-4 border-pgbet-gold p-6">
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {reels.map((symbol, i) => {
              const symbolData = SYMBOLS[symbol];
              const isWinning = winningLines.some(lineIndex => PAYLINES[lineIndex].includes(i));
              
              return (
                <div
                  key={i}
                  className={`
                    aspect-square rounded-xl border-4 flex items-center justify-center text-6xl md:text-7xl
                    transition-all duration-300
                    ${spinning ? 'animate-realistic-spin bg-pgbet-dark/50 border-pgbet-gold/30' : 'bg-gradient-to-br from-card to-pgbet-dark/80'}
                    ${isWinning && !spinning ? 'border-pgbet-gold animate-symbol-glow-dance shadow-2xl scale-110' : 'border-pgbet-gold/50'}
                  `}
                >
                  <span className={symbolData.color}>{symbolData.emoji}</span>
                </div>
              );
            })}
          </div>

          {/* Paylines indicator */}
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>5 Linhas: 3 Horizontais + 2 Diagonais</p>
          </div>
        </Card>

        {/* Bet controls */}
        <Card className="bg-card/95 border-2 border-pgbet-gold p-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Aposta por Spin</p>
              <div className="flex flex-wrap gap-2">
                {BET_OPTIONS.map(option => (
                  <Button
                    key={option}
                    onClick={() => setBet(option)}
                    variant={bet === option ? 'default' : 'outline'}
                    className={bet === option ? 'bg-pgbet-gradient-gold text-pgbet-dark font-bold' : 'border-pgbet-gold text-pgbet-gold'}
                  >
                    {option} 🪙
                  </Button>
                ))}
                <Button
                  onClick={() => setBet(Math.min(coins, 500))}
                  variant="outline"
                  className="border-pgbet-red text-pgbet-red font-bold"
                >
                  MAX
                </Button>
              </div>
            </div>

            {/* Spin buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                onClick={handleSpin}
                disabled={spinning || (freeSpins === 0 && coins < bet)}
                className="col-span-2 h-16 text-2xl bg-pgbet-gradient-gold text-pgbet-dark font-black hover:scale-105 transition-transform disabled:opacity-50"
              >
                {spinning ? '🎰 GIRANDO...' : freeSpins > 0 ? '🎰 FREE SPIN' : `🎰 GIRAR (${bet})`}
              </Button>
              
              <Button
                onClick={() => handleAutoSpin(10)}
                disabled={spinning || autoSpinCount > 0 || coins < bet * 10}
                variant="outline"
                className="border-pgbet-purple text-pgbet-purple hover:bg-pgbet-purple hover:text-white"
              >
                AUTO 10x
              </Button>
              
              <Button
                onClick={() => handleAutoSpin(25)}
                disabled={spinning || autoSpinCount > 0 || coins < bet * 25}
                variant="outline"
                className="border-pgbet-emerald text-pgbet-emerald hover:bg-pgbet-emerald hover:text-white"
              >
                AUTO 25x
              </Button>
            </div>

            {autoSpinCount > 0 && (
              <div className="text-center">
                <Badge className="bg-pgbet-purple text-white font-bold animate-pulse">
                  🔄 Auto Spin: {autoSpinCount} restantes
                </Badge>
                <Button
                  onClick={() => setAutoSpinCount(0)}
                  variant="outline"
                  size="sm"
                  className="ml-2 border-pgbet-red text-pgbet-red"
                >
                  Parar
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Recent spins history */}
        {spinHistory.length > 0 && (
          <Card className="bg-card/95 border-2 border-pgbet-gold p-4">
            <h3 className="text-lg font-bold text-pgbet-gold mb-3">📊 Últimos Spins</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {spinHistory.slice(0, 10).map((spin, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-pgbet-dark/50 rounded p-2">
                  <span className="text-muted-foreground">
                    Aposta: {spin.bet} 🪙
                  </span>
                  <span className={spin.won ? 'text-pgbet-emerald font-bold' : 'text-muted-foreground'}>
                    {spin.won ? `+${spin.winAmount} 🎉` : 'Perdeu'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>🔞 +18 • Moedas virtuais • RTP 96,81% • Jogo justo</p>
        </div>
      </div>
    </div>
  );
};