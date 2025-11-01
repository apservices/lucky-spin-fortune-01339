import React from 'react';
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

        {/* MAIN GAME - Fortune Tiger (2x bigger) */}
        <Card 
          onClick={() => onNavigateToGame('fortune-tiger')}
          className="relative overflow-hidden bg-gradient-to-br from-pgbet-gold/20 to-pgbet-red/20 border-4 border-pgbet-gold hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl"
        >
          <div className="p-8 text-center space-y-4">
            <Badge className="absolute top-4 right-4 bg-pgbet-gradient-red text-white text-xs font-bold animate-button-pulse-premium">
              ⭐ MAIS JOGADO
            </Badge>
            
            <div className="text-8xl animate-symbol-glow-dance">🐅</div>
            
            <h2 className="text-4xl font-bold bg-pgbet-gradient-gold bg-clip-text text-transparent">
              FORTUNE TIGER
            </h2>
            
            <p className="text-lg text-pgbet-gold font-bold">
              ⭐ JOGO MAIS POPULAR DO BR
            </p>

            <button className="w-full max-w-md mx-auto h-16 text-2xl bg-pgbet-gradient-gold hover:scale-105 transition-transform font-bold text-pgbet-dark rounded-xl shadow-lg border-2 border-pgbet-red">
              JOGAR AGORA
            </button>

            <div className="flex items-center justify-center space-x-4 text-sm">
              <Badge className="bg-pgbet-emerald">RTP 96,5%</Badge>
              <Badge className="bg-pgbet-purple">Volatilidade Média</Badge>
              <Badge className="bg-pgbet-red">Tigre x10</Badge>
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
                  <p className="text-xs text-pgbet-gold">RTP 96,5%</p>
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
                  <p className="text-xs text-pgbet-gold">RTP 96,5%</p>
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
                  <p className="text-xs text-pgbet-gold">RTP 96,5%</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer compliance */}
        <div className="text-center text-xs text-muted-foreground pb-4">
          🔞 Jogo responsável • +18 anos • Moedas virtuais sem valor real • RTP 96,5%
        </div>
      </div>
    </div>
  );
};
