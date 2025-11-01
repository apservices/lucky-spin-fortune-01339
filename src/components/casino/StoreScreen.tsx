import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Tv, Share2, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface StoreScreenProps {
  coins: number;
  onCoinsChange: (coins: number) => void;
  adsWatchedToday: number;
  onWatchAd: () => void;
  onBack: () => void;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({
  coins,
  onCoinsChange,
  adsWatchedToday,
  onWatchAd,
  onBack
}) => {
  const handleShare = () => {
    onCoinsChange(coins + 500);
    toast.success('🎉 +500 moedas por compartilhar!');
  };

  const handleDailyBonus = () => {
    onCoinsChange(coins + 3000);
    toast.success('🎁 Bônus diário resgatado! +3000 moedas');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pgbet-dark via-card to-pgbet-dark p-4">
      <div className="max-w-4xl mx-auto space-y-6 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-pgbet-gold hover:text-pgbet-gold/80"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Voltar</span>
          </button>

          <h1 className="text-2xl font-bold text-pgbet-gold">🏪 LOJA</h1>

          <div className="flex items-center space-x-2">
            <span className="text-xl">🪙</span>
            <span className="text-xl font-bold text-pgbet-gold">
              {coins.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Store items */}
        <div className="space-y-4">
          {/* Watch Ad */}
          <Card className="p-6 bg-gradient-to-br from-pgbet-red/20 to-card border-2 border-pgbet-red/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Tv className="w-12 h-12 text-pgbet-red" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">Assistir Anúncio</h3>
                  <p className="text-sm text-muted-foreground">
                    Ganhe +1000 moedas por anúncio
                  </p>
                  <Badge className="mt-1 bg-pgbet-gold text-pgbet-dark">
                    {adsWatchedToday}/5 hoje
                  </Badge>
                </div>
              </div>
              <button
                onClick={onWatchAd}
                disabled={adsWatchedToday >= 5}
                className={`h-12 px-6 font-bold rounded-lg transition-transform ${
                  adsWatchedToday >= 5
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-pgbet-gradient-red text-white hover:scale-105'
                }`}
              >
                {adsWatchedToday >= 5 ? 'Limite Atingido' : 'ASSISTIR'}
              </button>
            </div>
          </Card>

          {/* Share */}
          <Card className="p-6 bg-gradient-to-br from-pgbet-emerald/20 to-card border-2 border-pgbet-emerald/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Share2 className="w-12 h-12 text-pgbet-emerald" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">Compartilhar</h3>
                  <p className="text-sm text-muted-foreground">
                    Compartilhe no WhatsApp e ganhe
                  </p>
                  <Badge className="mt-1 bg-pgbet-emerald text-white">
                    +500 moedas
                  </Badge>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="h-12 px-6 bg-pgbet-gradient-emerald text-white font-bold rounded-lg hover:scale-105 transition-transform"
              >
                COMPARTILHAR
              </button>
            </div>
          </Card>

          {/* Daily Bonus */}
          <Card className="p-6 bg-gradient-to-br from-pgbet-gold/20 to-card border-2 border-pgbet-gold/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Gift className="w-12 h-12 text-pgbet-gold animate-symbol-glow-dance" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">Bônus Diário</h3>
                  <p className="text-sm text-muted-foreground">
                    Faça login todo dia e ganhe
                  </p>
                  <Badge className="mt-1 bg-pgbet-gold text-pgbet-dark">
                    +3000 moedas
                  </Badge>
                </div>
              </div>
              <button
                onClick={handleDailyBonus}
                className="h-12 px-6 bg-pgbet-gradient-gold text-pgbet-dark font-bold rounded-lg hover:scale-105 transition-transform"
              >
                RESGATAR
              </button>
            </div>
          </Card>
        </div>

        {/* Info */}
        <div className="bg-pgbet-dark/50 border border-pgbet-gold/30 rounded-lg p-4">
          <p className="text-center text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Volte todo dia para resgatar bônus grátis!
          </p>
        </div>
      </div>
    </div>
  );
};
