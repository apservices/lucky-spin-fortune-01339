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
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl opacity-10 animate-floating-coins-premium"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            >
              {['🐅', '🪙', '🧧', '🎰', '⭐'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-md w-full bg-card/90 backdrop-blur-lg border-4 border-pgbet-red rounded-2xl p-8 shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-7xl animate-mascot-celebration">🐅</div>
            
            <h1 className="text-3xl font-bold bg-pgbet-gradient-gold bg-clip-text text-transparent">
              FORTUNE CASINO
            </h1>
            
            <div className="bg-pgbet-red/20 border-2 border-pgbet-red rounded-lg p-4">
              <p className="text-xl font-bold text-pgbet-red mb-2">
                ⚠️ AVISO +18
              </p>
              <p className="text-sm text-white">
                Este é um jogo recreativo com moedas virtuais.
                <br />
                <strong>NÃO HÁ DINHEIRO REAL ENVOLVIDO.</strong>
              </p>
            </div>

            <div className="space-y-3 text-left text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-pgbet-gold">✓</span>
                <span>Apenas diversão - sem apostas reais</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-pgbet-gold">✓</span>
                <span>Moedas virtuais sem valor monetário</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-pgbet-gold">✓</span>
                <span>RTP 96,5% - jogo justo e transparente</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-pgbet-red">✗</span>
                <span>Proibido para menores de 18 anos</span>
              </div>
            </div>

            <button
              onClick={handleAgeAccept}
              className="w-full h-14 text-xl bg-pgbet-gradient-gold hover:scale-105 transition-transform font-bold text-pgbet-dark rounded-xl shadow-lg border-2 border-pgbet-red"
            >
              TENHO +18 ANOS - ENTRAR
            </button>

            <p className="text-xs text-muted-foreground">
              Ao clicar, você confirma ter 18+ anos
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
