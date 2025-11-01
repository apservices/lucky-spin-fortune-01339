import React from 'react';
import { SlotMachineCore } from './SlotMachineCore';
import { ArrowLeft } from 'lucide-react';

interface DragonGoldGameProps {
  coins: number;
  onCoinsChange: (coins: number) => void;
  onSpinComplete: (result: any) => void;
  onBack: () => void;
}

const symbols = ['🐉', '🔥', '💎', '👑', '⚡'];
const payouts = {
  '🐉': { 3: 10 },
  '🔥': { 3: 5 },
  '💎': { 3: 4 },
  '👑': { 3: 3 },
  '⚡': { 3: 2 }
};

export const DragonGoldGame: React.FC<DragonGoldGameProps> = ({
  coins,
  onCoinsChange,
  onSpinComplete,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pgbet-dark via-pgbet-red/10 to-pgbet-dark">
      <div className="bg-card/80 backdrop-blur-lg border-b-2 border-pgbet-red/30 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-pgbet-red hover:text-pgbet-red/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Voltar</span>
          </button>
          
          <div className="text-center">
            <div className="text-2xl">🐉</div>
            <h1 className="text-xl font-bold text-pgbet-red">DRAGON GOLD</h1>
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
        gameName="Dragon Gold"
        gameColor="pgbet-red"
        spinHistory={[]}
      />
    </div>
  );
};
