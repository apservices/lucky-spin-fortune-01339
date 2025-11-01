import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, X } from 'lucide-react';
import { toast } from 'sonner';

interface DailyRewardModalProps {
  onClaim: (coins: number, hasLuckySpin: boolean) => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClaim }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const checkDailyReward = () => {
      const lastClaim = localStorage.getItem('fortuneTigerLastDailyClaim');
      const streakDay = parseInt(localStorage.getItem('fortuneTigerStreakDay') || '1');
      
      if (!lastClaim) {
        setCanClaim(true);
        setCurrentDay(1);
        setIsVisible(true);
        return;
      }

      const lastClaimDate = new Date(lastClaim);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff >= 24) {
        // Check if streak continues (claimed within 48h)
        const newDay = hoursDiff < 48 ? Math.min(streakDay + 1, 7) : 1;
        setCurrentDay(newDay);
        setCanClaim(true);
        setIsVisible(true);
      } else {
        setCurrentDay(streakDay);
        setCanClaim(false);
      }
    };

    checkDailyReward();
  }, []);

  const handleClaim = () => {
    const rewards = [
      { day: 1, coins: 500, lucky: false },
      { day: 2, coins: 500, lucky: false },
      { day: 3, coins: 500, lucky: false },
      { day: 4, coins: 500, lucky: false },
      { day: 5, coins: 500, lucky: false },
      { day: 6, coins: 500, lucky: false },
      { day: 7, coins: 1000, lucky: true },
    ];

    const reward = rewards[currentDay - 1];
    
    localStorage.setItem('fortuneTigerLastDailyClaim', new Date().toISOString());
    localStorage.setItem('fortuneTigerStreakDay', currentDay.toString());
    
    onClaim(reward.coins, reward.lucky);
    setIsVisible(false);
    
    toast.success(
      reward.lucky 
        ? `🎁 Dia ${currentDay}: +${reward.coins} moedas + 1 Lucky Spin GRÁTIS!`
        : `🎁 Dia ${currentDay}: +${reward.coins} moedas!`,
      { duration: 4000 }
    );
  };

  if (!isVisible) return null;

  const rewards = [
    { day: 1, coins: 500, lucky: false },
    { day: 2, coins: 500, lucky: false },
    { day: 3, coins: 500, lucky: false },
    { day: 4, coins: 500, lucky: false },
    { day: 5, coins: 500, lucky: false },
    { day: 6, coins: 500, lucky: false },
    { day: 7, coins: 1000, lucky: true },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="relative max-w-md w-full bg-gradient-to-br from-pgbet-dark via-card to-pgbet-dark border-4 border-pgbet-gold p-6">
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center space-y-6">
          <div>
            <Gift className="w-16 h-16 text-pgbet-gold mx-auto mb-3 animate-bounce" />
            <h2 className="text-3xl font-bold text-pgbet-gold mb-2">RECOMPENSA DIÁRIA</h2>
            <p className="text-sm text-muted-foreground">Volte todos os dias para ganhar!</p>
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 gap-2">
            {rewards.map((reward) => (
              <div
                key={reward.day}
                className={`
                  relative p-3 rounded-lg border-2 text-center
                  ${reward.day === currentDay && canClaim
                    ? 'bg-pgbet-gradient-gold border-pgbet-gold animate-pulse'
                    : reward.day < currentDay
                    ? 'bg-pgbet-emerald/20 border-pgbet-emerald'
                    : 'bg-card/50 border-border/50'
                  }
                `}
              >
                <div className="text-xs font-bold mb-1">D{reward.day}</div>
                <div className="text-xs text-pgbet-gold font-bold">{reward.coins}</div>
                {reward.lucky && (
                  <Badge className="absolute -top-2 -right-1 bg-pgbet-red text-white text-[8px] px-1 py-0 h-4">
                    LUCKY
                  </Badge>
                )}
                {reward.day < currentDay && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl">✓</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current reward */}
          {canClaim && (
            <div className="bg-pgbet-gold/10 border-2 border-pgbet-gold rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Recompensa de Hoje:</p>
              <div className="text-3xl font-bold text-pgbet-gold">
                +{rewards[currentDay - 1].coins} 🪙
              </div>
              {rewards[currentDay - 1].lucky && (
                <div className="mt-2 text-sm font-bold text-pgbet-red animate-pulse">
                  + 1 LUCKY SPIN GRÁTIS! 🎰
                </div>
              )}
            </div>
          )}

          {/* Button */}
          {canClaim ? (
            <Button
              onClick={handleClaim}
              className="w-full h-14 text-xl bg-pgbet-gradient-gold text-pgbet-dark font-bold hover:scale-105 transition-transform"
            >
              🎁 RESGATAR RECOMPENSA
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              Volte amanhã para mais recompensas!
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Sequência atual: Dia {currentDay} de 7
          </p>
        </div>
      </Card>
    </div>
  );
};
