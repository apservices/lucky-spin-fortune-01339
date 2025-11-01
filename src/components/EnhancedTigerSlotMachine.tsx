import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Symbol3D } from './Symbol3D';
import { ParticleSystem } from './ParticleSystem';
import { ParallaxBackground } from './ParallaxBackground';
import { ProgressionSystem } from './ProgressionSystem';
import { VirtualCoinStore } from './VirtualCoinStore';
import { LuckySpinWheel } from './LuckySpinWheel';
import { SpinHistory } from './SpinHistory';
import { DailyRewardModal } from './DailyRewardModal';
import { ComplianceModal } from './ComplianceModal';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Crown, 
  Settings,
  Menu,
  Home,
  Volume2,
  VolumeX,
  Trophy,
  Gift,
  Star,
  History,
  Info,
  Tv
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EnhancedTigerSlotMachineProps {
  coins: number;
  energy: number;
  level: number;
  experience: number;
  maxExperience: number;
  onCoinsChange: (coins: number) => void;
  onEnergyChange: (energy: number) => void;
  onExperienceChange?: (xp: number) => void;
  onBackToLobby?: () => void;
}

export const EnhancedTigerSlotMachine: React.FC<EnhancedTigerSlotMachineProps> = ({
  coins,
  energy,
  level,
  experience,
  maxExperience,
  onCoinsChange,
  onEnergyChange,
  onExperienceChange,
  onBackToLobby
}) => {
  // Game state
  const [isSpinning, setIsSpinning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [reels, setReels] = useState<string[][]>([
    ['🐅', '🪙', '🧧'],
    ['🏮', '🎆', '🍊'],
    ['📜', '🀄', '💎']
  ]);
  
  // Effects and animations
  const [isWinning, setIsWinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [particleActive, setParticleActive] = useState(false);
  const [particleType, setParticleType] = useState<'win' | 'jackpot' | 'bonus' | 'coins'>('win');
  
  // UI state
  const [showProgressionSystem, setShowProgressionSystem] = useState(false);
  const [showVirtualStore, setShowVirtualStore] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPaytable, setShowPaytable] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [redemptionPoints, setRedemptionPoints] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showLuckySpin, setShowLuckySpin] = useState(false);
  const [luckySpinAvailable, setLuckySpinAvailable] = useState(0);
  const [showCompliance, setShowCompliance] = useState(true);
  const [complianceAccepted, setComplianceAccepted] = useState(false);
  
  // Free spins feature
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [freeSpinMultiplier, setFreeSpinMultiplier] = useState(1);
  
  // History tracking
  const [spinHistory, setSpinHistory] = useState<Array<{
    id: number;
    bet: number;
    win: number;
    multiplier: number;
    timestamp: Date;
    type: 'normal' | 'big' | 'mega' | 'free';
  }>>([]);
  const [spinCount, setSpinCount] = useState(0);
  
  // Performance optimization
  const animationRef = useRef<number>();
  const spinTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Symbols and payouts (25 paylines Fortune Tiger)
  const symbols = ['🐅', '🪙', '🧧', '🏮', '🎆', '🍊', '📜', '🀄', '💎'];
  const payouts = {
    '🐅': { three: 2500, two: 50, one: 5 },    // Tiger - highest
    '💎': { three: 1000, two: 25, one: 2 },   // Diamond - wild
    '🪙': { three: 500, two: 15, one: 2 },    // Coin
    '🧧': { three: 200, two: 10, one: 1 },    // Red Envelope
    '🏮': { three: 150, two: 8, one: 1 },     // Lantern
    '🎆': { three: 100, two: 5, one: 1 },     // Fireworks
    '🍊': { three: 80, two: 4, one: 0 },      // Orange
    '📜': { three: 60, two: 3, one: 0 },      // Scroll
    '🀄': { three: 40, two: 2, one: 0 }       // Mahjong
  };

  // Calculate win with 25 paylines
  const checkWin = (reelResult: string[][]) => {
    const paylines = [
      // Horizontal lines
      [[0,0], [0,1], [0,2]], // Top row
      [[1,0], [1,1], [1,2]], // Middle row  
      [[2,0], [2,1], [2,2]], // Bottom row
      
      // Diagonal lines
      [[0,0], [1,1], [2,2]], // Top-left to bottom-right
      [[2,0], [1,1], [0,2]], // Bottom-left to top-right
      
      // Zigzag patterns (20 more paylines)
      [[0,0], [1,1], [0,2]], [[2,0], [1,1], [2,2]],
      [[0,0], [2,1], [0,2]], [[2,0], [0,1], [2,2]],
      [[1,0], [0,1], [1,2]], [[1,0], [2,1], [1,2]],
      [[0,0], [0,1], [1,2]], [[2,0], [2,1], [1,2]],
      [[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], // Vertical (bonus)
      [[0,2], [1,2], [2,2]], [[1,0], [1,1], [2,0]],
      [[0,1], [0,2], [1,0]], [[2,1], [2,2], [1,0]],
      [[0,0], [2,0], [1,1]], [[0,2], [2,2], [1,1]],
      [[1,0], [0,0], [2,1]], [[1,2], [0,2], [2,1]],
      [[0,1], [2,0], [1,2]], [[2,1], [0,0], [1,2]],
      [[1,1], [0,0], [2,0]], [[1,1], [0,2], [2,2]]
    ];

    let totalWin = 0;
    let winLines = [];
    let hasWildWin = false;

    paylines.forEach((line, index) => {
      const lineSymbols = line.map(([row, col]) => reelResult[row][col]);
      const firstSymbol = lineSymbols[0];
      
      // Check for three of a kind or wild combinations
      if (lineSymbols.every(s => s === firstSymbol)) {
        const payout = payouts[firstSymbol as keyof typeof payouts]?.three || 0;
        if (payout > 0) {
          totalWin += payout * betAmount;
          winLines.push(index);
          if (firstSymbol === '💎') hasWildWin = true;
        }
      }
      // Check for two of a kind
      else if (lineSymbols.slice(0, 2).every(s => s === firstSymbol)) {
        const payout = payouts[firstSymbol as keyof typeof payouts]?.two || 0;
        if (payout > 0) {
          totalWin += payout * betAmount;
          winLines.push(index);
        }
      }
    });

    return { totalWin, winLines, hasWildWin };
  };

  // RTP 96.5% volatility system
  const generateReelsWithRTP = () => {
    const rand = Math.random();
    const isFreeSpin = freeSpinsRemaining > 0;
    const multiplier = isFreeSpin ? freeSpinMultiplier : 1;
    
    // Volatility distribution (RTP 96.5%)
    // 40% small wins (x1-x5), 15% medium (x10-x50), 5% big (x100+), 0.1% mega (x1000+)
    let targetWinType: 'mega' | 'big' | 'medium' | 'small' | 'loss' = 'loss';
    
    if (rand < 0.001) targetWinType = 'mega';        // 0.1% MEGA JACKPOT (x1000+)
    else if (rand < 0.051) targetWinType = 'big';    // 5% BIG WIN (x100+)
    else if (rand < 0.201) targetWinType = 'medium'; // 15% medium win (x10-x50)
    else if (rand < 0.601) targetWinType = 'small';  // 40% small win (x1-x5)
    // Remaining 39.9% = loss
    
    let newReels: string[][];
    
    if (targetWinType === 'mega') {
      // MEGA JACKPOT: 3 Tigers
      newReels = [
        ['🐅', '🐅', '🐅'],
        ['🐅', '🐅', '🐅'],
        ['🐅', '🐅', '🐅']
      ];
    } else if (targetWinType === 'big') {
      // BIG WIN: High value symbols
      const bigSymbols = ['🐅', '💎', '🪙'];
      const chosenSymbol = bigSymbols[Math.floor(Math.random() * bigSymbols.length)];
      newReels = Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () =>
          Math.random() < 0.6 ? chosenSymbol : symbols[Math.floor(Math.random() * symbols.length)]
        )
      );
    } else if (targetWinType === 'medium') {
      // Medium win: Mix of good symbols
      newReels = Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => {
          const r = Math.random();
          if (r < 0.3) return '🪙';
          if (r < 0.5) return '🧧';
          return symbols[Math.floor(Math.random() * symbols.length)];
        })
      );
    } else if (targetWinType === 'small') {
      // Small win: Random with some matches
      newReels = Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)])
      );
      // Ensure at least one match
      const row = Math.floor(Math.random() * 3);
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      newReels[row][0] = symbol;
      newReels[row][1] = symbol;
    } else {
      // Loss: truly random
      newReels = Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)])
      );
    }
    
    return { newReels, targetWinType };
  };

  const spin = async () => {
    if (!complianceAccepted) return;
    if (isSpinning || (energy === 0 && freeSpinsRemaining === 0)) return;
    
    if (coins < betAmount && freeSpinsRemaining === 0) {
      toast.error('Saldo insuficiente!');
      return;
    }

    setIsSpinning(true);
    setIsWinning(false);
    setParticleActive(false);
    
    const currentBet = betAmount;
    const isFreeSpin = freeSpinsRemaining > 0;
    
    // Deduct bet (not on free spins)
    if (!isFreeSpin) {
      onCoinsChange(coins - currentBet);
      onEnergyChange(energy - 1);
    } else {
      setFreeSpinsRemaining(prev => prev - 1);
    }
    
    // Increment spin count for Lucky Spin unlock
    setSpinCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 10 && luckySpinAvailable === 0) {
        setLuckySpinAvailable(1);
        toast.info('🎰 Lucky Spin desbloqueado! Clique no botão dourado!', { duration: 5000 });
      }
      return newCount % 10;
    });
    
    // Generate reels with RTP 96.5%
    const { newReels, targetWinType } = generateReelsWithRTP();

    // Spin animation duration (with tease on almost-wins)
    const hasAlmostWin = targetWinType === 'loss' && Math.random() < 0.3;
    const spinDuration = turboMode ? 800 : hasAlmostWin ? 3000 : 2000;
    
    if (hasAlmostWin && soundEnabled) {
      toast.info('🎵 Quase...', { duration: 1500 });
    }
    
    // Animate reels spinning
    spinTimeoutRef.current = setTimeout(() => {
      setReels(newReels);
      setIsSpinning(false);
      
      // Check for scatter (Free Spins)
      const scatterCount = newReels.flat().filter(s => s === '🧧').length;
      if (scatterCount >= 3 && freeSpinsRemaining === 0) {
        setFreeSpinsRemaining(10);
        setFreeSpinMultiplier(3);
        toast.success(
          '🎉 FREE SPINS! 10 giros grátis com multiplicador x3!',
          { duration: 5000 }
        );
      }
      
      // Check for wins
      const winResult = checkWin(newReels);
      const finalMultiplier = isFreeSpin ? freeSpinMultiplier : 1;
      const finalWin = winResult.totalWin * finalMultiplier;
      
      // Add to history
      const spinRecord = {
        id: Date.now(),
        bet: currentBet,
        win: finalWin,
        multiplier: finalMultiplier,
        timestamp: new Date(),
        type: finalWin >= currentBet * 1000 ? 'mega' : 
              finalWin >= currentBet * 100 ? 'big' : 
              finalWin > 0 ? 'normal' : 'normal' as 'normal' | 'big' | 'mega' | 'free'
      };
      setSpinHistory(prev => [...prev, spinRecord].slice(-50));
      
      if (finalWin > 0) {
        setIsWinning(true);
        setWinAmount(finalWin);
        setParticleActive(true);
        
        // Determine particle type and message
        let message = '';
        if (finalWin >= currentBet * 1000) {
          setParticleType('jackpot');
          message = `🔥 MEGA JACKPOT! +${finalWin.toLocaleString('pt-BR')} 🔥`;
        } else if (finalWin >= currentBet * 100) {
          setParticleType('bonus');
          message = `🎊 BIG WIN! +${finalWin.toLocaleString('pt-BR')} 🎊`;
        } else if (finalWin >= currentBet * 10) {
          setParticleType('win');
          message = `✨ Boa! +${finalWin.toLocaleString('pt-BR')} ✨`;
        } else {
          setParticleType('coins');
          message = `✓ Vitória! +${finalWin.toLocaleString('pt-BR')}`;
        }
        
        // Award winnings
        onCoinsChange(coins + finalWin - (isFreeSpin ? 0 : currentBet));
        
        // Award XP
        const xpGained = Math.floor(finalWin / 10) + 10;
        if (onExperienceChange) onExperienceChange(xpGained);
        
        // Convert coins to redemption points (10,000 coins = 1 point)
        if (finalWin >= 10000) {
          const pointsEarned = Math.floor(finalWin / 10000);
          setRedemptionPoints(prev => prev + pointsEarned);
        }
        
        toast.success(message, { duration: finalWin >= currentBet * 100 ? 6000 : 4000 });
        
        // Stop particles after animation
        setTimeout(() => {
          setIsWinning(false);
          setParticleActive(false);
        }, finalWin >= currentBet * 100 ? 5000 : 3000);
      }
      
    }, spinDuration);
  };

  // Auto play functionality
  useEffect(() => {
    if (autoPlay && !isSpinning && energy > 0 && coins >= betAmount) {
      const autoSpinTimeout = setTimeout(() => {
        spin();
      }, turboMode ? 1000 : 2000);
      
      return () => clearTimeout(autoSpinTimeout);
    }
  }, [autoPlay, isSpinning, energy, coins, betAmount, turboMode]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleClaimProgressionReward = (reward: { xp: number; coins: number }) => {
    if (onExperienceChange) onExperienceChange(reward.xp);
    onCoinsChange(coins + reward.coins);
  };

  const handleUnlockTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    toast.success(`Tema ${themeId} ativado!`);
  };

  const handleEarnCoins = (amount: number, method: string) => {
    onCoinsChange(coins + amount);
    toast.success(`+${amount.toLocaleString()} moedas via ${method}!`);
  };

  const handleSpendRedemptionPoints = (amount: number, prize: any) => {
    setRedemptionPoints(prev => prev - amount);
  };

  const handleLuckySpinComplete = (multiplier: number) => {
    const winnings = coins * (multiplier - 1);
    onCoinsChange(coins + winnings);
    setLuckySpinAvailable(prev => prev - 1);
    setShowLuckySpin(false);
    setSpinCount(0);
    toast.success(
      `🎰 Lucky Spin! Multiplicador ×${multiplier} = +${winnings.toLocaleString('pt-BR')} moedas!`,
      { duration: 5000 }
    );
  };

  const handleDailyRewardClaim = (coinsReward: number, hasLuckySpin: boolean) => {
    onCoinsChange(coins + coinsReward);
    if (hasLuckySpin) {
      setLuckySpinAvailable(prev => prev + 1);
    }
  };

  const handleWatchAd = () => {
    toast.info('📺 Assistindo anúncio...', { duration: 2000 });
    setTimeout(() => {
      onCoinsChange(coins + 1000);
      toast.success('🎁 +1000 moedas! Obrigado por assistir!', { duration: 3000 });
    }, 2000);
  };

  const handleComplianceAccept = () => {
    setComplianceAccepted(true);
    setShowCompliance(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Parallax Background */}
      <ParallaxBackground />
      
      {/* Particle System */}
      <ParticleSystem 
        active={particleActive}
        type={particleType}
        intensity={winAmount > 1000 ? 100 : 50}
        centerX={window.innerWidth / 2}
        centerY={window.innerHeight / 2}
      />

      {/* Top HUD - 15% */}
      <div className="relative z-30 p-4 bg-gradient-to-b from-pgbet-dark/90 to-transparent">
        <div className="flex items-center justify-between">
          {/* Left controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToLobby}
              className="bg-card/80 hover:bg-card border-pgbet-gold/30"
            >
              <Home className="w-4 h-4 mr-2" />
              Lobby
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-card/80 hover:bg-card border-pgbet-gold/30"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>

          {/* Center stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pgbet-gold">R$ {coins.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Saldo</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-pgbet-emerald">{energy}/10</div>
              <div className="text-xs text-muted-foreground">Energia</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-pgbet-purple">Nv.{level}</div>
              <div className="text-xs text-muted-foreground">Nível</div>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVirtualStore(!showVirtualStore)}
              className="bg-card/80 hover:bg-card border-pgbet-purple/30"
            >
              <Gift className="w-4 h-4 mr-2" />
              Loja
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProgressionSystem(!showProgressionSystem)}
              className="bg-card/80 hover:bg-card border-pgbet-emerald/30"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Progresso
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="bg-card/80 hover:bg-card border-pgbet-gold/30"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* XP Progress bar */}
        <div className="mt-3">
          <Progress 
            value={(experience / maxExperience) * 100} 
            className="h-2 bg-pgbet-dark/50"
          />
        </div>
      </div>

      {/* Main slot area - 60% */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-4">
        <Card className="p-8 bg-gradient-to-br from-card/90 to-pgbet-dark/80 border-4 border-pgbet-gold/50 backdrop-blur-md shadow-2xl max-w-md w-full">
          {/* Machine header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-pgbet-gradient-gold bg-clip-text text-transparent mb-2">
              FORTUNE TIGER
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <Badge className="bg-pgbet-gradient-gold text-pgbet-dark">PG SOFT</Badge>
              <Badge className="bg-pgbet-gradient-red text-white">RTP 96.81%</Badge>
            </div>
          </div>

          {/* Reels container */}
          <div className="relative mb-6">
            <div 
              className={cn(
                "grid grid-cols-3 gap-2 p-4 rounded-lg",
                "bg-gradient-to-br from-pgbet-dark/80 to-card/60",
                "border-2 border-pgbet-gold/30",
                isWinning && "animate-pulse shadow-[0_0_40px_hsl(var(--pgbet-gold))]"
              )}
            >
              {reels.map((reel, reelIndex) =>
                reel.map((symbol, symbolIndex) => (
                  <div
                    key={`${reelIndex}-${symbolIndex}`}
                    className="bg-card/80 rounded-lg border-2 border-pgbet-gold/20 p-2 flex items-center justify-center"
                  >
                    <Symbol3D
                      symbol={symbol}
                      isSpinning={isSpinning}
                      isWinning={isWinning}
                      size="md"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Win amount display */}
            {isWinning && winAmount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-4xl font-bold text-pgbet-gold animate-pulse bg-pgbet-dark/90 px-6 py-3 rounded-lg border-2 border-pgbet-gold">
                  +R$ {winAmount.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Bet controls - New simplified system */}
          <div className="mb-4 space-y-3">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Aposta por Linha (5 linhas fixas)</div>
              <div className="flex items-center justify-center space-x-2">
                {[1, 5, 10, 50].map((value) => (
                  <Button
                    key={value}
                    variant={betAmount === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBetAmount(value)}
                    className={cn(
                      "flex-1 font-bold",
                      betAmount === value && "bg-pgbet-gradient-gold text-pgbet-dark"
                    )}
                  >
                    {value}
                  </Button>
                ))}
                <Button
                  variant={betAmount === coins ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBetAmount(Math.min(coins, 100))}
                  className={cn(
                    "flex-1 font-bold",
                    betAmount === coins && "bg-pgbet-gradient-red text-white"
                  )}
                >
                  MAX
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="bg-card/50 rounded p-2">
                <div className="text-xs text-muted-foreground">Aposta Total</div>
                <div className="text-pgbet-gold font-bold">{betAmount.toLocaleString('pt-BR')}</div>
              </div>
              <div className="bg-card/50 rounded p-2">
                <div className="text-xs text-muted-foreground">Ganho Máx (x10)</div>
                <div className="text-pgbet-emerald font-bold">{(betAmount * 10).toLocaleString('pt-BR')}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {/* Free Spins indicator */}
            {freeSpinsRemaining > 0 && (
              <div className="bg-pgbet-gradient-purple text-white rounded-lg p-3 mb-3 text-center animate-pulse">
                <div className="text-sm font-bold">🎉 FREE SPINS ATIVAS 🎉</div>
                <div className="text-2xl font-bold">{freeSpinsRemaining} giros restantes</div>
                <div className="text-xs">Multiplicador x{freeSpinMultiplier}</div>
              </div>
            )}

            <Button
              onClick={spin}
              disabled={isSpinning || (energy === 0 && freeSpinsRemaining === 0) || (coins < betAmount && freeSpinsRemaining === 0)}
              className={cn(
                "w-full h-14 text-xl font-bold transition-all duration-300",
                isSpinning
                  ? "bg-muted animate-pulse cursor-not-allowed"
                  : "bg-pgbet-gradient-gold hover:scale-105 text-pgbet-dark animate-button-pulse-premium"
              )}
            >
              {isSpinning ? (
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-6 h-6 animate-spin" />
                  <span>GIRANDO...</span>
                </div>
              ) : freeSpinsRemaining > 0 ? (
                <div className="flex items-center space-x-2">
                  <Gift className="w-6 h-6" />
                  <span>FREE SPIN</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Play className="w-6 h-6" />
                  <span>GIRAR</span>
                </div>
              )}
            </Button>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={autoPlay ? "default" : "outline"}
                onClick={() => setAutoPlay(!autoPlay)}
                className={cn("text-xs", autoPlay && "bg-pgbet-gradient-emerald text-white")}
              >
                {autoPlay ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                Auto
              </Button>
              
              <Button
                variant={turboMode ? "default" : "outline"}
                onClick={() => setTurboMode(!turboMode)}
                className={cn("text-xs", turboMode && "bg-pgbet-gradient-purple text-white")}
              >
                <Zap className="w-3 h-3 mr-1" />
                Turbo
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs"
              >
                <History className="w-3 h-3 mr-1" />
                Histórico
              </Button>
            </div>

            {/* Lucky Spin Button */}
            {luckySpinAvailable > 0 && (
              <Button
                onClick={() => setShowLuckySpin(true)}
                className="w-full h-12 bg-pgbet-gradient-gold text-pgbet-dark font-bold animate-bounce border-4 border-pgbet-red"
              >
                <Star className="w-5 h-5 mr-2 animate-spin" />
                LUCKY SPIN DISPONÍVEL! ({luckySpinAvailable})
              </Button>
            )}

            {/* Watch Ad Button */}
            <Button
              variant="outline"
              onClick={handleWatchAd}
              className="w-full text-sm border-pgbet-purple/50"
            >
              <Tv className="w-4 h-4 mr-2" />
              Assistir Anúncio → +1000 moedas
            </Button>
          </div>
        </Card>
      </div>

      {/* Spin History Sidebar */}
      {showHistory && (
        <div className="fixed top-0 right-0 h-full w-80 z-40 p-4">
          <SpinHistory history={spinHistory} />
        </div>
      )}

      {/* Bottom controls - 25% */}
      <div className="relative z-30 p-4 bg-gradient-to-t from-pgbet-dark/90 to-transparent">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPaytable(!showPaytable)}
            className="bg-card/80 hover:bg-card border-pgbet-gold/30"
          >
            <Info className="w-4 h-4 mr-2" />
            Tabela
          </Button>
          
          <div className="flex space-x-2 flex-wrap">
            <Badge className="bg-pgbet-gradient-gold text-pgbet-dark text-xs font-bold">
              ⚙️ RTP: 96.5%
            </Badge>
            <Badge className="bg-pgbet-gradient-emerald text-white text-xs">
              <Star className="w-3 h-3 mr-1" />
              {redemptionPoints} pts
            </Badge>
          </div>

          <Button
            variant="outline"  
            size="sm"
            className="bg-card/80 hover:bg-card border-pgbet-gold/30"
          >
            <Gift className="w-4 h-4 mr-2" />
            Recompensa
          </Button>
        </div>
      </div>

      {/* Modals/Overlays */}
      {showProgressionSystem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">Sistema de Progressão</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowProgressionSystem(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <ProgressionSystem
                level={level}
                experience={experience}
                maxExperience={maxExperience}
                coins={coins}
                onClaimReward={handleClaimProgressionReward}
                onUnlockTheme={handleUnlockTheme}
              />
            </div>
          </div>
        </div>
      )}

      {showVirtualStore && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold">Loja de Moedas Virtuais</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowVirtualStore(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <VirtualCoinStore
                coins={coins}
                redemptionPoints={redemptionPoints}
                onEarnCoins={handleEarnCoins}
                onSpendRedemptionPoints={handleSpendRedemptionPoints}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lucky Spin Wheel Modal */}
      {showLuckySpin && (
        <LuckySpinWheel
          onSpin={handleLuckySpinComplete}
          onClose={() => setShowLuckySpin(false)}
        />
      )}

      {/* Daily Reward Modal */}
      <DailyRewardModal onClaim={handleDailyRewardClaim} />

      {/* Compliance Modal */}
      {showCompliance && (
        <ComplianceModal onAccept={handleComplianceAccept} />
      )}
    </div>
  );
};
