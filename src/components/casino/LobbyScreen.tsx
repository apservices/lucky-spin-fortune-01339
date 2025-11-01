import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameType } from '@/pages/Index';

interface LobbyScreenProps {
  coins: number;
  onNavigateToGame: (game: GameType) => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ coins, onNavigateToGame }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pgbet-dark via-card to-pgbet-dark relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-5xl opacity-10 animate-floating-coins-premium"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}
          >
            {['🐅', '🪙', '🧧', '🏮', '🎆', '🐉'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 pt-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="text-6xl animate-mascot-celebration">🐅</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-pgbet-gradient-gold bg-clip-text text-transparent">
              FORTUNE CASINO
            </h1>
          </div>
          
          <p className="text-xl text-pgbet-gold font-bold">
            JOGOS RECREATIVOS +18
          </p>

          {/* Compliance warning */}
          <div className="bg-pgbet-red/20 border-2 border-pgbet-red rounded-lg p-3 backdrop-blur-sm max-w-2xl mx-auto">
            <p className="text-sm font-bold text-white">
              ⚠️ +18 ANOS | MOEDAS VIRTUAIS | JOGO RECREATIVO - SEM DINHEIRO REAL
            </p>
          </div>

          {/* Coin balance */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl">🪙</span>
            <span className="text-3xl font-bold text-pgbet-gold">
              {coins.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* MAIN GAME - Fortune Tiger (DESTAQUE MÁXIMO) */}
        <Card 
          onClick={() => onNavigateToGame('fortune-tiger')}
          className="relative overflow-hidden bg-gradient-to-br from-pgbet-gold/30 to-pgbet-red/30 border-4 border-pgbet-gold hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-2xl animate-button-pulse-premium"
        >
          <div className="p-6 md:p-10 text-center space-y-6">
            {/* Badge destaque */}
            <Badge className="absolute top-4 right-4 bg-pgbet-red text-white text-sm font-black animate-pulse px-4 py-2">
              ⭐ O TIGRINHO MAIS QUERIDO DO BR
            </Badge>
            
            {/* Tigre animado com efeitos */}
            <div className="relative inline-block">
              <div className="text-9xl md:text-[12rem] animate-mascot-celebration filter drop-shadow-2xl">🐯</div>
              <div className="absolute -top-4 -right-4 text-5xl animate-bounce">✨</div>
              <div className="absolute -bottom-4 -left-4 text-5xl animate-bounce" style={{ animationDelay: '0.3s' }}>💫</div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-5xl md:text-6xl font-black bg-pgbet-gradient-gold bg-clip-text text-transparent">
                FORTUNE TIGER
              </h2>
              
              <p className="text-2xl md:text-3xl text-pgbet-gold font-black animate-pulse">
                🎰 O TIGRINHO MAIS QUERIDO DO BR
              </p>

              <p className="text-lg text-white/80 font-semibold max-w-2xl mx-auto">
                Grid 3x3 • 5 Linhas de Pagamento • Wild x10 • Free Spins • RTP 96,81%
              </p>
            </div>

            <button className="w-full max-w-lg mx-auto h-20 text-3xl bg-pgbet-gradient-gold hover:scale-105 active:scale-95 transition-all font-black text-pgbet-dark rounded-2xl shadow-2xl border-4 border-pgbet-red relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-3">
                🐯 JOGAR AGORA 🎰
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <Badge className="bg-pgbet-emerald text-white font-bold px-4 py-2">✓ RTP 96,81%</Badge>
              <Badge className="bg-pgbet-purple text-white font-bold px-4 py-2">✓ Volatilidade Média</Badge>
              <Badge className="bg-pgbet-red text-white font-bold px-4 py-2">✓ Wild x10</Badge>
              <Badge className="bg-pgbet-amber text-pgbet-dark font-bold px-4 py-2">✓ Free Spins</Badge>
            </div>
          </div>
        </Card>

        {/* Other Games - Horizontal Scroll */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-pgbet-gold text-center">
            + JOGOS DISPONÍVEIS
          </h3>
          
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex space-x-4 min-w-max px-2">
              {/* Zodiac Fortune */}
              <Card 
                onClick={() => onNavigateToGame('zodiac')}
                className="w-72 flex-shrink-0 bg-gradient-to-br from-pgbet-purple/20 to-pgbet-dark/60 border-2 border-pgbet-purple hover:scale-105 transition-all cursor-pointer relative"
              >
                <Badge className="absolute top-2 right-2 bg-pgbet-gold text-pgbet-dark text-xs animate-button-pulse-premium">
                  NOVO
                </Badge>
                <div className="p-6 text-center space-y-3">
                  <div className="text-6xl">♈</div>
                  <h3 className="text-xl font-bold text-pgbet-purple">ZODIAC FORTUNE</h3>
                  <p className="text-sm text-muted-foreground">Signos BR • Símbolo x3</p>
                  <button className="w-full h-12 bg-pgbet-gradient-purple hover:scale-105 transition-transform font-bold text-white rounded-lg">
                    JOGAR
                  </button>
                  <p className="text-xs text-pgbet-gold">RTP 96,5%</p>
                </div>
              </Card>

              {/* Dragon Gold */}
              <Card 
                onClick={() => onNavigateToGame('dragon')}
                className="w-72 flex-shrink-0 bg-gradient-to-br from-pgbet-red/20 to-pgbet-dark/60 border-2 border-pgbet-red hover:scale-105 transition-all cursor-pointer relative"
              >
                <Badge className="absolute top-2 right-2 bg-pgbet-gold text-pgbet-dark text-xs animate-button-pulse-premium">
                  NOVO
                </Badge>
                <div className="p-6 text-center space-y-3">
                  <div className="text-6xl">🐉</div>
                  <h3 className="text-xl font-bold text-pgbet-red">DRAGON GOLD</h3>
                  <p className="text-sm text-muted-foreground">Dragão Vermelho • Wild Expansivo</p>
                  <button className="w-full h-12 bg-pgbet-gradient-red hover:scale-105 transition-transform font-bold text-white rounded-lg">
                    JOGAR
                  </button>
                  <p className="text-xs text-pgbet-gold">RTP 96,81%</p>
                </div>
              </Card>

              {/* Pirate Treasure */}
              <Card 
                onClick={() => onNavigateToGame('pirate')}
                className="w-72 flex-shrink-0 bg-gradient-to-br from-pgbet-amber/20 to-pgbet-dark/60 border-2 border-pgbet-amber hover:scale-105 transition-all cursor-pointer relative"
              >
                <Badge className="absolute top-2 right-2 bg-pgbet-gold text-pgbet-dark text-xs animate-button-pulse-premium">
                  NOVO
                </Badge>
                <div className="p-6 text-center space-y-3">
                  <div className="text-6xl">🏴‍☠️</div>
                  <h3 className="text-xl font-bold text-pgbet-amber">PIRATA DO TESOURO</h3>
                  <p className="text-sm text-muted-foreground">Navio + Baú • Mini-game</p>
                  <button className="w-full h-12 bg-pgbet-gradient-gold hover:scale-105 transition-transform font-bold text-pgbet-dark rounded-lg">
                    JOGAR
                  </button>
                  <p className="text-xs text-pgbet-gold">RTP 96,81%</p>
                </div>
              </Card>

              {/* Neon Night */}
              <Card 
                onClick={() => onNavigateToGame('neon')}
                className="w-72 flex-shrink-0 bg-gradient-to-br from-pgbet-emerald/20 to-pgbet-dark/60 border-2 border-pgbet-emerald hover:scale-105 transition-all cursor-pointer relative"
              >
                <Badge className="absolute top-2 right-2 bg-pgbet-gold text-pgbet-dark text-xs animate-button-pulse-premium">
                  NOVO
                </Badge>
                <div className="p-6 text-center space-y-3">
                  <div className="text-6xl">🎊</div>
                  <h3 className="text-xl font-bold text-pgbet-emerald">NEON NIGHT SLOTS</h3>
                  <p className="text-sm text-muted-foreground">Samba + Neon • Lucky Spin</p>
                  <button className="w-full h-12 bg-pgbet-gradient-emerald hover:scale-105 transition-transform font-bold text-white rounded-lg">
                    JOGAR
                  </button>
                  <p className="text-xs text-pgbet-gold">RTP 96,81%</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer compliance */}
        <div className="text-center text-xs text-muted-foreground pb-4 space-y-1">
          <p className="font-bold">🔞 JOGO RESPONSÁVEL • +18 ANOS</p>
          <p>Moedas virtuais sem valor real • RTP 96,81% • Volatilidade Média</p>
          <p className="text-pgbet-gold">Jogo justo e transparente • Apenas diversão</p>
        </div>
      </div>
    </div>
  );
};
