import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ComplianceModalProps {
  onAccept: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has already accepted (within 30 days)
    const lastAcceptance = localStorage.getItem('fortuneTigerCompliance');
    if (lastAcceptance) {
      const acceptanceDate = new Date(lastAcceptance);
      const now = new Date();
      const daysDiff = (now.getTime() - acceptanceDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff < 30) {
        setIsVisible(false);
        onAccept();
        return;
      }
    }
  }, [onAccept]);

  const handleAccept = () => {
    if (!accepted) return;

    const deviceId = localStorage.getItem('deviceId') || Math.random().toString(36).substring(7);
    localStorage.setItem('deviceId', deviceId);
    localStorage.setItem('fortuneTigerCompliance', new Date().toISOString());
    
    setIsVisible(false);
    onAccept();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-gradient-to-br from-pgbet-dark via-card to-pgbet-dark border-4 border-pgbet-red p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl md:text-7xl animate-bounce">🐅</div>
          <h1 className="text-3xl md:text-4xl font-bold text-pgbet-gold">
            FORTUNE TIGER
          </h1>
          <div className="bg-pgbet-red/20 border-2 border-pgbet-red rounded-lg p-4">
            <p className="text-lg md:text-xl font-bold text-white">
              🔞 JOGO RECREATIVO +18
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="space-y-4 text-sm md:text-base text-white/90">
          <div className="bg-card/50 rounded-lg p-4 space-y-2">
            <p className="flex items-start space-x-2">
              <span className="text-pgbet-gold">•</span>
              <span>Este é um <strong className="text-pgbet-gold">jogo recreativo</strong> para maiores de 18 anos</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-pgbet-gold">•</span>
              <span>Todas as moedas são <strong className="text-pgbet-gold">virtuais e sem valor real</strong></span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-pgbet-gold">•</span>
              <span><strong className="text-pgbet-gold">Não há prêmios em dinheiro</strong> ou qualquer valor monetário</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-pgbet-gold">•</span>
              <span>Jogue com responsabilidade e apenas por diversão</span>
            </p>
          </div>

          <div className="bg-pgbet-gold/10 border border-pgbet-gold rounded-lg p-4">
            <p className="text-center">
              <strong className="text-pgbet-gold">RTP: 96.5%</strong>
              <span className="block text-xs text-muted-foreground mt-1">
                (Return to Player - Taxa de retorno ao jogador)
              </span>
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-start space-x-3 bg-card/30 rounded-lg p-4">
          <Checkbox
            id="compliance"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
            className="mt-1"
          />
          <label
            htmlFor="compliance"
            className="text-sm md:text-base text-white cursor-pointer leading-relaxed"
          >
            Confirmo que tenho <strong className="text-pgbet-gold">18 anos ou mais</strong> e entendo que este é um jogo recreativo com moedas virtuais sem valor real
          </label>
        </div>

        {/* Button */}
        <Button
          onClick={handleAccept}
          disabled={!accepted}
          className="w-full h-14 text-xl bg-pgbet-gradient-gold text-pgbet-dark font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {accepted ? '✓ CONTINUAR PARA O JOGO' : '⚠️ ACEITE OS TERMOS ACIMA'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Ao continuar, você concorda com os termos de uso
        </p>
      </Card>
    </div>
  );
};
