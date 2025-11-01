import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Plus, 
  Minus, 
  Settings, 
  RotateCcw,
  Volume2,
  VolumeX,
  Menu,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface AuthenticFortuneTigerProps {
  coins: number;
  energy: number;
  onCoinsChange: (newCoins: number) => void;
  onEnergyChange: (newEnergy: number) => void;
}

// Authentic Fortune Tiger symbols based on PG Soft original
const fortuneSymbols = [
  { id: 'tiger', emoji: '🐅', name: 'Tiger', multiplier: 50, probability: 8 },
  { id: 'coin', emoji: '🪙', name: 'Gold Coin', multiplier: 25, probability: 12 },
  { id: 'ingot', emoji: '💰', name: 'Gold Ingot', multiplier: 20, probability: 15 },
  { id: 'envelope', emoji: '🧧', name: 'Red Envelope', multiplier: 15, probability: 18 },
  { id: 'lantern', emoji: '🏮', name: 'Lantern', multiplier: 10, probability: 22 },
  { id: 'fireworks', emoji: '🎆', name: 'Fireworks', multiplier: 5, probability: 25 }
];

export const AuthenticFortuneTiger: React.FC<AuthenticFortuneTigerProps> = ({ 
  coins, 
  energy, 
  onCoinsChange, 
  onEnergyChange 
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState<string[][]>([
    ['🪙', '🧧', '🏮'],
    ['🧧', '🪙', '🏮'],
    ['🏮', '🪙', '🧧']
  ]);
  
  // Game state matching original Fortune Tiger
  const [currentBet, setCurrentBet] = useState(0.40);
  const [autoPlay, setAutoPlay] = useState(false);
  const [turboSpin, setTurboSpin] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastWin, setLastWin] = useState(0);
  const [totalWin, setTotalWin] = useState(0);
  const [winLines, setWinLines] = useState<number[]>([]);
  const [showPaytable, setShowPaytable] = useState(false);
  
  const slotRef = useRef<HTMLDivElement>(null);

  // Authentic bet values from Fortune Tiger
  const betValues = [0.08, 0.18, 0.28, 0.40, 0.48, 0.88, 1.28, 1.68, 2.08, 2.48, 2.88];

  const getRandomSymbol = (): string => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const symbol of fortuneSymbols) {
      cumulative += symbol.probability;
      if (random <= cumulative) {
        return symbol.emoji;
      }
    }
    return fortuneSymbols[0].emoji;
  };

  const generateReel = (): string[] => {
    return [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
  };

  const checkWinLines = (newReels: string[][]): { totalWin: number; winningLines: number[] } => {
    let totalWin = 0;
    const winningLines: number[] = [];

    // Check all 27 possible winning combinations in 3x3 grid
    const lines = [
      // Horizontal lines
      [[0,0], [1,0], [2,0]], // Top row
      [[0,1], [1,1], [2,1]], // Middle row  
      [[0,2], [1,2], [2,2]], // Bottom row
      // Vertical lines
      [[0,0], [0,1], [0,2]], // Left column
      [[1,0], [1,1], [1,2]], // Middle column
      [[2,0], [2,1], [2,2]], // Right column
      // Diagonal lines
      [[0,0], [1,1], [2,2]], // Top-left to bottom-right
      [[0,2], [1,1], [2,0]], // Bottom-left to top-right
    ];

    lines.forEach((line, index) => {
      const symbols = line.map(([col, row]) => newReels[col][row]);
      
      // Check if all symbols match
      if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        const symbolData = fortuneSymbols.find(s => s.emoji === symbols[0]);
        if (symbolData) {
          const lineWin = currentBet * symbolData.multiplier;
          totalWin += lineWin;
          winningLines.push(index);
        }
      }
    });

    return { totalWin, winningLines };
  };

  const spinReels = async () => {
    if (isSpinning || energy < 1 || coins < currentBet) {
      if (energy < 1) {
        toast.error('⚡ Sem energia para girar!');
      } else if (coins < currentBet) {
        toast.error('💰 Saldo insuficiente!');
      }
      return;
    }

    setIsSpinning(true);
    setWinLines([]);
    setLastWin(0);
    
    // Deduct bet and energy
    onCoinsChange(coins - currentBet);
    onEnergyChange(energy - 1);

    // Spinning animation duration
    const spinDuration = turboSpin ? 800 : 2000;
    
    // Animate reels spinning
    const spinInterval = setInterval(() => {
      setReels([generateReel(), generateReel(), generateReel()]);
    }, turboSpin ? 30 : 80);

    setTimeout(() => {
      clearInterval(spinInterval);
      
      // Final result
      const finalReels = [generateReel(), generateReel(), generateReel()];
      setReels(finalReels);
      
      const winResult = checkWinLines(finalReels);
      
      if (winResult.totalWin > 0) {
        setLastWin(winResult.totalWin);
        setTotalWin(prev => prev + winResult.totalWin);
        setWinLines(winResult.winningLines);
        onCoinsChange(coins - currentBet + winResult.totalWin);
        
        // Win celebration
        if (winResult.totalWin >= currentBet * 20) {
          toast.success(
            `🐅 BIG WIN! R$${winResult.totalWin.toFixed(2)}!`,
            {
              duration: 4000,
              style: {
                background: 'linear-gradient(45deg, #ff6b00, #ff8f00)',
                color: 'white',
                fontWeight: 'bold'
              }
            }
          );
        } else {
          toast.success(`💰 WIN! R$${winResult.totalWin.toFixed(2)}`);
        }
      }
      
      setIsSpinning(false);
    }, spinDuration);
  };

  const adjustBet = (direction: 'up' | 'down') => {
    const currentIndex = betValues.indexOf(currentBet);
    if (direction === 'up' && currentIndex < betValues.length - 1) {
      setCurrentBet(betValues[currentIndex + 1]);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentBet(betValues[currentIndex - 1]);
    }
  };

  const maxBet = () => {
    setCurrentBet(betValues[betValues.length - 1]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-800 to-yellow-600 relative overflow-hidden">
      {/* Authentic Fortune Tiger Header */}
      <div className="relative z-10 bg-gradient-to-r from-red-800 to-orange-700 border-b-4 border-yellow-400 shadow-2xl">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center border-2 border-red-600 shadow-lg">
              <span className="text-2xl">🐅</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-100">Fortune Tiger</h1>
              <p className="text-xs text-yellow-300">PG Soft</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-yellow-100 hover:bg-yellow-500/20"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPaytable(!showPaytable)}
              className="text-yellow-100 hover:bg-yellow-500/20"
            >
              <Info className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-yellow-100 hover:bg-yellow-500/20"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex flex-col h-screen">
        {/* Top info bar */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-4 py-2 flex justify-between items-center text-sm font-semibold">
          <div className="text-red-900">Saldo: R${coins.toFixed(2)}</div>
          <div className="text-red-900">Energia: {energy}/10</div>
          <div className="text-red-900">Ganho: R${lastWin.toFixed(2)}</div>
        </div>

        {/* Main slot area */}
        <div className="flex-1 flex items-center justify-center p-4 relative">
          <div 
            ref={slotRef}
            className="relative"
          >
            {/* Slot machine frame - authentic Fortune Tiger style */}
            <div className="bg-gradient-to-br from-red-700 via-orange-600 to-yellow-500 p-8 rounded-3xl border-8 border-yellow-400 shadow-2xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 text-3xl animate-pulse">🏮</div>
              <div className="absolute top-4 right-4 text-3xl animate-pulse">🏮</div>
              <div className="absolute bottom-4 left-4 text-3xl animate-pulse">🎆</div>
              <div className="absolute bottom-4 right-4 text-3xl animate-pulse">🎆</div>
              
              {/* Win line indicators */}
              {winLines.length > 0 && (
                <div className="absolute inset-8 pointer-events-none">
                  {winLines.map(lineIndex => (
                    <div
                      key={lineIndex}
                      className="absolute w-full h-1 bg-yellow-300 animate-pulse rounded-full"
                      style={{
                        top: lineIndex < 3 ? `${20 + lineIndex * 30}%` : '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                  ))}
                </div>
              )}
              
              {/* 3x3 Reels Grid */}
              <div className="grid grid-cols-3 gap-3 relative z-10">
                {reels.map((reel, reelIndex) => (
                  <div key={reelIndex} className="space-y-3">
                    {reel.map((symbol, symbolIndex) => (
                      <div
                        key={`${reelIndex}-${symbolIndex}`}
                        className={`
                          w-20 h-20 flex items-center justify-center text-4xl rounded-xl border-4 transition-all duration-300
                          ${isSpinning 
                            ? 'animate-spin bg-gradient-to-br from-yellow-300/30 to-orange-400/30 border-yellow-400' 
                            : 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-600 hover:border-yellow-400'
                          }
                          ${winLines.length > 0 && !isSpinning
                            ? 'bg-gradient-to-br from-yellow-200 to-orange-200 border-yellow-300 animate-pulse shadow-lg' 
                            : ''
                          }
                        `}
                      >
                        <span className={`
                          drop-shadow-lg transition-all duration-300
                          ${isSpinning ? 'blur-sm' : ''}
                          ${winLines.length > 0 && !isSpinning ? 'animate-bounce text-5xl' : ''}
                        `}>
                          {symbol}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom control panel - authentic Fortune Tiger layout */}
        <div className="bg-gradient-to-r from-red-800 to-orange-700 border-t-4 border-yellow-400 p-4">
          {/* Bet controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xs text-yellow-200">APOSTA</div>
                <div className="text-lg font-bold text-yellow-100">R${currentBet.toFixed(2)}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => adjustBet('down')}
                  disabled={isSpinning}
                  variant="outline"
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-500 text-red-900 border-yellow-400"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => adjustBet('up')}
                  disabled={isSpinning}
                  variant="outline"
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-500 text-red-900 border-yellow-400"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  onClick={maxBet}
                  disabled={isSpinning}
                  variant="outline"
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-500 text-red-900 border-yellow-400 text-xs px-2"
                >
                  MAX
                </Button>
              </div>
            </div>

            {/* Spin button - Fortune Tiger style */}
            <button
              onClick={spinReels}
              disabled={isSpinning || energy < 1 || coins < currentBet}
              className={`
                w-20 h-20 rounded-full border-4 transition-all duration-300 transform font-bold text-sm
                ${isSpinning 
                  ? 'animate-spin border-orange-400 bg-gradient-to-br from-orange-500 to-red-600 scale-95' 
                  : energy > 0 && coins >= currentBet
                    ? 'hover:scale-110 border-yellow-400 bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg hover:shadow-xl text-red-900' 
                    : 'opacity-50 cursor-not-allowed border-gray-400 bg-gray-500'
                }
              `}
            >
              {isSpinning ? (
                <div className="text-yellow-100">SPIN</div>
              ) : (
                <div className="text-red-900">SPIN</div>
              )}
            </button>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setAutoPlay(!autoPlay)}
                disabled={isSpinning}
                variant={autoPlay ? "default" : "outline"}
                size="sm"
                className={autoPlay 
                  ? "bg-green-600 hover:bg-green-500 text-white" 
                  : "bg-yellow-600 hover:bg-yellow-500 text-red-900 border-yellow-400"
                }
              >
                AUTO
              </Button>
              <Button
                onClick={() => setTurboSpin(!turboSpin)}
                disabled={isSpinning}
                variant={turboSpin ? "default" : "outline"}
                size="sm"
                className={turboSpin 
                  ? "bg-blue-600 hover:bg-blue-500 text-white" 
                  : "bg-yellow-600 hover:bg-yellow-500 text-red-900 border-yellow-400"
                }
              >
                TURBO
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Paytable overlay */}
      {showPaytable && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full bg-gradient-to-br from-red-800 to-orange-700 border-4 border-yellow-400 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-100">Tabela de Pagamentos</h3>
              <Button 
                onClick={() => setShowPaytable(false)}
                variant="ghost"
                size="sm"
                className="text-yellow-100"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-2">
              {fortuneSymbols.map(symbol => (
                <div key={symbol.id} className="flex items-center justify-between p-2 bg-yellow-100/10 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{symbol.emoji}</span>
                    <span className="text-yellow-100 text-sm">{symbol.name}</span>
                  </div>
                  <span className="text-yellow-300 font-semibold">{symbol.multiplier}x</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};