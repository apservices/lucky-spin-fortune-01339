import React, { useState, useEffect } from 'react';
import { LobbyScreen } from '@/components/casino/LobbyScreen';
import { FortuneTigerGame } from '@/components/casino/FortuneTigerGame';
import { ZodiacFortuneGame } from '@/components/casino/ZodiacFortuneGame';
import { DragonGoldGame } from '@/components/casino/DragonGoldGame';
import { PirateGame } from '@/components/casino/PirateGame';
import { NeonNightGame } from '@/components/casino/NeonNightGame';
import { ChallengesScreen } from '@/components/casino/ChallengesScreen';
import { StoreScreen } from '@/components/casino/StoreScreen';
import { BottomNav } from '@/components/casino/BottomNav';
import { toast } from 'sonner';

export type GameType = 'lobby' | 'fortune-tiger' | 'zodiac' | 'dragon' | 'pirate' | 'neon' | 'challenges' | 'store';

const Index = () => {
  // Global state
  const [hasAcceptedAge, setHasAcceptedAge] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<GameType>('lobby');
  const [coins, setCoins] = useState(10000);
  const [spinHistory, setSpinHistory] = useState<any[]>([]);
  
  // Daily challenges
  const [dailyProgress, setDailyProgress] = useState({
    tigerSpins: 0,
    totalWins: 0,
    adsWatched: 0
  });

  // Store watch ad counter (max 5 per day)
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);

  useEffect(() => {
    // Check if user has accepted before (localStorage)
    const accepted = localStorage.getItem('fortuneCasinoAgeAccepted');
    if (accepted === 'true') {
      setHasAcceptedAge(true);
    }
  }, []);

  const handleAgeAccept = () => {
    setHasAcceptedAge(true);
    localStorage.setItem('fortuneCasinoAgeAccepted', 'true');
    toast.success('🐅 Bem-vindo ao Fortune Casino!', {
      duration: 3000,
      style: {
        background: 'hsl(var(--pgbet-gold))',
        color: 'hsl(var(--pgbet-dark))',
      }
    });
  };

  const handleNavigate = (screen: GameType) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleSpinComplete = (result: any) => {
    setSpinHistory(prev => [result, ...prev].slice(0, 50));
    
    // Update daily progress
    if (currentScreen === 'fortune-tiger') {
      setDailyProgress(prev => ({
        ...prev,
        tigerSpins: prev.tigerSpins + 1,
        totalWins: result.won ? prev.totalWins + 1 : prev.totalWins
      }));
    }
  };

  const handleWatchAd = () => {
    if (adsWatchedToday >= 5) {
      toast.error('Limite diário de anúncios atingido! (5/dia)');
      return;
    }

    toast.info('📺 Assistindo anúncio...', { duration: 2000 });
    
    setTimeout(() => {
      setCoins(prev => prev + 1000);
      setAdsWatchedToday(prev => prev + 1);
      setDailyProgress(prev => ({ ...prev, adsWatched: prev.adsWatched + 1 }));
      toast.success(`🎥 +1000 moedas! Restam ${4 - adsWatchedToday} anúncios hoje`);
    }, 2000);
  };

  // Age verification screen
  if (!hasAcceptedAge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pgbet-dark via-pgbet-crimson/20 to-pgbet-dark relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Chinese temple background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating coins and emojis */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl opacity-20 animate-floating-coins-premium"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            >
              {['🐯', '🪙', '🧧', '💰', '⭐', '🎰'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
          
          {/* Fireworks effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-pgbet-gold/5 to-transparent animate-pulse" />
        </div>

        <div className="relative z-10 max-w-md w-full bg-gradient-to-b from-card/95 via-card/90 to-card/95 backdrop-blur-xl border-4 border-pgbet-gold rounded-3xl p-8 shadow-2xl">
          <div className="text-center space-y-6">
            {/* Animated tiger mascot */}
            <div className="relative">
              <div className="text-8xl animate-mascot-celebration filter drop-shadow-2xl">🐯</div>
              <div className="absolute -top-2 -right-2 text-4xl animate-bounce">✨</div>
              <div className="absolute -bottom-2 -left-2 text-4xl animate-bounce delay-200">💫</div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-black bg-pgbet-gradient-gold bg-clip-text text-transparent animate-pulse">
                FORTUNE TIGER
              </h1>
              <p className="text-xl font-bold text-pgbet-gold">
                🎰 JOGO DO TIGRINHO RECREATIVO
              </p>
            </div>
            
            {/* Compliance warning - prominent */}
            <div className="bg-gradient-to-r from-pgbet-red/30 via-pgbet-red/20 to-pgbet-red/30 border-3 border-pgbet-red rounded-xl p-4 shadow-lg">
              <p className="text-2xl font-black text-pgbet-red mb-3 animate-pulse">
                ⚠️ AVISO +18 ANOS
              </p>
              <div className="space-y-2 text-sm text-white/90 font-semibold">
                <p>🎮 JOGO RECREATIVO COM MOEDAS VIRTUAIS</p>
                <p className="text-base text-pgbet-gold font-black">
                  ❌ NÃO HÁ DINHEIRO REAL ENVOLVIDO
                </p>
                <p className="text-xs text-white/70 mt-2">
                  RTP: 96,81% • Volatilidade Média • Jogo Justo
                </p>
              </div>
            </div>

            {/* Benefits list */}
            <div className="space-y-2 text-left text-sm bg-card/50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-pgbet-gold text-xl">✓</span>
                <span>Apenas diversão - 100% virtual</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-pgbet-gold text-xl">✓</span>
                <span>Moedas sem valor monetário</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-pgbet-gold text-xl">✓</span>
                <span>Sistema justo e transparente</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-pgbet-red text-xl">✗</span>
                <span className="text-pgbet-red font-bold">Proibido para menores de 18</span>
              </div>
            </div>

            {/* Enter button */}
            <button
              onClick={handleAgeAccept}
              className="w-full h-16 text-2xl bg-pgbet-gradient-gold hover:scale-105 active:scale-95 transition-all duration-200 font-black text-pgbet-dark rounded-2xl shadow-2xl border-4 border-pgbet-gold/50 animate-button-pulse-premium relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                🐯 TENHO +18 - ENTRAR 🎰
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </button>

            <p className="text-xs text-muted-foreground">
              Ao clicar, você confirma ter mais de 18 anos<br />
              e concorda com o uso recreativo do jogo
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main app with navigation
  return (
    <div className="min-h-screen bg-pgbet-dark pb-20">
      {/* Current screen */}
      {currentScreen === 'lobby' && (
        <LobbyScreen
          coins={coins}
          onNavigateToGame={handleNavigate}
        />
      )}
      
      {currentScreen === 'fortune-tiger' && (
        <FortuneTigerGame
          coins={coins}
          onCoinsChange={setCoins}
          onSpinComplete={handleSpinComplete}
          onBack={() => handleNavigate('lobby')}
          spinHistory={spinHistory}
        />
      )}

      {currentScreen === 'zodiac' && (
        <ZodiacFortuneGame
          coins={coins}
          onCoinsChange={setCoins}
          onSpinComplete={handleSpinComplete}
          onBack={() => handleNavigate('lobby')}
        />
      )}

      {currentScreen === 'dragon' && (
        <DragonGoldGame
          coins={coins}
          onCoinsChange={setCoins}
          onSpinComplete={handleSpinComplete}
          onBack={() => handleNavigate('lobby')}
        />
      )}

      {currentScreen === 'pirate' && (
        <PirateGame
          coins={coins}
          onCoinsChange={setCoins}
          onSpinComplete={handleSpinComplete}
          onBack={() => handleNavigate('lobby')}
        />
      )}

      {currentScreen === 'neon' && (
        <NeonNightGame
          coins={coins}
          onCoinsChange={setCoins}
          onSpinComplete={handleSpinComplete}
          onBack={() => handleNavigate('lobby')}
        />
      )}

      {currentScreen === 'challenges' && (
        <ChallengesScreen
          coins={coins}
          onCoinsChange={setCoins}
          dailyProgress={dailyProgress}
          onBack={() => handleNavigate('lobby')}
        />
      )}

      {currentScreen === 'store' && (
        <StoreScreen
          coins={coins}
          onCoinsChange={setCoins}
          adsWatchedToday={adsWatchedToday}
          onWatchAd={handleWatchAd}
          onBack={() => handleNavigate('lobby')}
        />
      )}

      {/* Fixed bottom navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default Index;
