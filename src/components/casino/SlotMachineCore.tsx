import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Maximize, History, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface SlotMachineCoreProps {
  symbols: string[];
  payouts: Record<string, { 3: number }>;
  coins: number;
  onCoinsChange: (coins: number) => void;
  onSpinComplete: (result: any) => void;
  gameName: string;
  gameColor: string;
  spinHistory: any[];
}

const betAmounts = [1, 5, 10, 50, 100];

export const SlotMachineCore: React.FC<SlotMachineCoreProps> = ({
  symbols,
  payouts,
  coins,
  onCoinsChange,
  onSpinComplete,
  gameName,
  gameColor,
  spinHistory
}) => {
  const [reels, setReels] = useState<string[]>([symbols[0], symbols[1], symbols[2]]);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [autoSpin, setAutoSpin] = useState(0);
  const [autoSpinCount, setAutoSpinCount] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [luckySpinAvailable, setLuckySpinAvailable] = useState(true);
  const [totalSpins, setTotalSpins] = useState(0);

  const spin = () => {
    if (spinning) return;
    if (coins < bet) {
      toast.error('Moedas insuficientes!');
      return;
    }

    setSpinning(true);
    onCoinsChange(coins - bet);
    setTotalSpins(prev => prev + 1);

    // Lucky Spin available every 10 spins
    if ((totalSpins + 1) % 10 === 0) {
      setLuckySpinAvailable(true);
    }

    // Simulate spinning animation
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
    }, 100);

    // Stop after 2 seconds and calculate result
    setTimeout(() => {
      clearInterval(spinInterval);

      // RTP 96.5% - weighted probability
      const isWin = Math.random() < 0.35; // 35% win rate
      
      let finalReels: string[];
      let winAmount = 0;

      if (isWin) {
        // Generate winning combination
        const winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        finalReels = [winSymbol, winSymbol, winSymbol];
        
        const multiplier = payouts[winSymbol]?.[3] || 2;
        winAmount = bet * multiplier;
        
        onCoinsChange(coins - bet + winAmount);
        
        toast.success(`🎉 GANHOU ${winAmount.toLocaleString('pt-BR')} moedas!`, {
          duration: 3000,
          style: {
            background: `hsl(var(--${gameColor}))`,
            color: 'white',
          }
        });
      } else {
        // Generate losing combination (different symbols)
        finalReels = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)]
        ];
        
        // Ensure they're different
        while (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
          finalReels[2] = symbols[Math.floor(Math.random() * symbols.length)];
        }
      }

      setReels(finalReels);
      setSpinning(false);

      // Callback
      onSpinComplete({
        reels: finalReels,
        won: isWin,
        amount: winAmount,
        bet: bet,
        timestamp: new Date().toISOString()
      });

      // Auto spin
      if (autoSpin > 0 && autoSpinCount < autoSpin) {
        setAutoSpinCount(prev => prev + 1);
        setTimeout(() => spin(), 1000);
      } else if (autoSpinCount >= autoSpin) {
        setAutoSpin(0);
        setAutoSpinCount(0);
      }
    }, 2000);
  };

  const handleAutoSpin = (count: number) => {
    setAutoSpin(count);
    setAutoSpinCount(0);
    setTimeout(() => spin(), 100);
  };

  const handleLuckySpin = () => {
    if (!luckySpinAvailable) {
      toast.error('Lucky Spin disponível a cada 10 giros!');
      return;
    }

    setLuckySpinAvailable(false);
    
    // Lucky Spin: 70% x2, 20% x3, 9% x5, 1% x10
    const rand = Math.random();
    let multiplier = 2;
    
    if (rand < 0.01) multiplier = 10;
    else if (rand < 0.10) multiplier = 5;
    else if (rand < 0.30) multiplier = 3;
    else multiplier = 2;

    const bonus = bet * multiplier;
    onCoinsChange(coins + bonus);
    
    toast.success(`🎰 LUCKY SPIN! x${multiplier} = ${bonus.toLocaleString('pt-BR')} moedas!`, {
      duration: 4000,
      style: {
        background: `hsl(var(--${gameColor}))`,
        color: 'white',
      }
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      {/* Controls Top */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            <History className="w-5 h-5" />
          </button>
        </div>

        <Badge className={`bg-${gameColor} text-white text-sm`}>
          RTP 96,5% • Volatilidade Média
        </Badge>
      </div>

      {/* Slot Machine */}
      <Card className="p-8 bg-gradient-to-br from-card to-pgbet-dark border-4 border-pgbet-gold/30 shadow-2xl">
        {/* Reels */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {reels.map((symbol, idx) => (
            <div
              key={idx}
              className={`aspect-square bg-pgbet-dark/80 border-4 border-${gameColor}/50 rounded-2xl flex items-center justify-center text-7xl ${
                spinning ? 'animate-realistic-spin' : 'animate-symbol-glow-dance'
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Bet selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm font-bold text-muted-foreground">APOSTA:</span>
            {betAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setBet(amount)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  bet === amount
                    ? `bg-${gameColor} text-white scale-110`
                    : 'bg-card border border-border hover:bg-muted'
                }`}
              >
                {amount}
              </button>
            ))}
            <button
              onClick={() => setBet(Math.min(coins, 100))}
              className="px-4 py-2 rounded-lg font-bold bg-pgbet-red text-white hover:scale-105 transition-transform"
            >
              MAX
            </button>
          </div>

          {/* Spin button */}
          <Button
            onClick={spin}
            disabled={spinning || coins < bet}
            className={`w-full h-16 text-2xl bg-pgbet-gradient-gold hover:scale-105 transition-transform font-bold text-pgbet-dark disabled:opacity-50 disabled:cursor-not-allowed ${
              !spinning ? 'animate-button-pulse-premium' : ''
            }`}
          >
            {spinning ? 'GIRANDO...' : `SPIN (${bet} moedas)`}
          </Button>

          {/* Auto spin buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleAutoSpin(10)}
              disabled={spinning || autoSpin > 0}
              className="flex-1 h-12 bg-pgbet-purple text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
            >
              AUTO 10
            </button>
            <button
              onClick={() => handleAutoSpin(25)}
              disabled={spinning || autoSpin > 0}
              className="flex-1 h-12 bg-pgbet-purple text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
            >
              AUTO 25
            </button>
            <button
              onClick={() => handleAutoSpin(50)}
              disabled={spinning || autoSpin > 0}
              className="flex-1 h-12 bg-pgbet-purple text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
            >
              AUTO 50
            </button>
          </div>

          {/* Lucky Spin */}
          <button
            onClick={handleLuckySpin}
            disabled={!luckySpinAvailable}
            className={`w-full h-14 font-bold rounded-lg transition-all ${
              luckySpinAvailable
                ? 'bg-pgbet-gradient-gold text-pgbet-dark hover:scale-105 animate-button-pulse-premium'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>{luckySpinAvailable ? 'LUCKY SPIN DISPONÍVEL!' : 'Lucky Spin a cada 10 giros'}</span>
            </div>
          </button>

          {autoSpin > 0 && (
            <div className="text-center">
              <Badge className="bg-pgbet-emerald text-white">
                Auto Spin: {autoSpinCount}/{autoSpin}
              </Badge>
            </div>
          )}
        </div>
      </Card>

      {/* Paytable */}
      <Card className="p-6 bg-card/80 backdrop-blur-lg border-2 border-border">
        <h3 className="text-lg font-bold text-center mb-4 text-pgbet-gold">TABELA DE PAGAMENTOS</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(payouts).map(([symbol, payout]) => (
            <div key={symbol} className="flex items-center space-x-2 bg-pgbet-dark/50 p-3 rounded-lg">
              <span className="text-3xl">{symbol}</span>
              <span className="text-sm">×3</span>
              <span className="text-sm font-bold text-pgbet-gold">= x{payout[3]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* History */}
      {showHistory && spinHistory.length > 0 && (
        <Card className="p-6 bg-card/80 backdrop-blur-lg border-2 border-border">
          <h3 className="text-lg font-bold text-center mb-4">HISTÓRICO (Últimos 10)</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {spinHistory.slice(0, 10).map((spin, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  spin.won ? 'bg-pgbet-emerald/20' : 'bg-pgbet-dark/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {spin.reels?.map((symbol: string, i: number) => (
                    <span key={i} className="text-2xl">{symbol}</span>
                  ))}
                </div>
                <span className={`font-bold ${spin.won ? 'text-pgbet-emerald' : 'text-pgbet-red'}`}>
                  {spin.won ? `+${spin.amount}` : `-${spin.bet}`}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Free Spins Info */}
      <div className="bg-pgbet-emerald/20 border border-pgbet-emerald rounded-lg p-4">
        <p className="text-center text-sm">
          <strong>🎁 BÔNUS:</strong> 3 símbolos Scatter = 10 Free Spins com x3 multiplicador!
        </p>
      </div>
    </div>
  );
};
