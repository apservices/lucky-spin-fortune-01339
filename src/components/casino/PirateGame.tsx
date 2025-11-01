import React from 'react';
import { SlotMachineCore } from './SlotMachineCore';
import { ArrowLeft } from 'lucide-react';

interface PirateGameProps {
  coins: number;
  onCoinsChange: (coins: number) => void;
  onSpinComplete: (result: any) => void;
  onBack: () => void;
}

const symbols = ['🏴‍☠️', '⚓', '💰', '🗺️', '⚔️'];
const payouts = {
  '🏴‍☠️': { 3: 10 },
  '⚓': { 3: 5 },
  '💰': { 3: 4 },
  '🗺️': { 3: 3 },
  '⚔️': { 3: 2 }
};

export const PirateGame: React.FC<PirateGameProps> = ({
  coins,
  onCoinsChange,
  onSpinComplete,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pgbet-dark via-pgbet-amber/10 to-pgbet-dark">
      <div className="bg-card/80 backdrop-blur-lg border-b-2 border-pgbet-amber/30 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-pgbet-amber hover:text-pgbet-amber/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Voltar</span>
          </button>
          
          <div className="text-center">
            <div className="text-2xl">🏴‍☠️</div>
            <h1 className="text-xl font-bold text-pgbet-amber">PIRATA DO TESOURO</h1>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xl">🪙</span>
            <span className="text-xl font-bold text-pgbet-gold">
              {coins.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      <SlotMachineCore
        symbols={symbols}
        payouts={payouts}
        coins={coins}
        onCoinsChange={onCoinsChange}
        onSpinComplete={onSpinComplete}
        gameName="Pirata do Tesouro"
        gameColor="pgbet-amber"
        spinHistory={[]}
      />
    </div>
  );
};
