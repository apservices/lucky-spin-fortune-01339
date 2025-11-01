import React, { useState } from 'react';
import { SlotMachineCore } from './SlotMachineCore';
import { ArrowLeft } from 'lucide-react';

interface FortuneTigerGameProps {
  coins: number;
  onCoinsChange: (coins: number) => void;
  onSpinComplete: (result: any) => void;
  onBack: () => void;
  spinHistory: any[];
}

const symbols = ['🐅', '🪙', '🧧', '🏮', '🎆'];
const payouts = {
  '🐅': { 3: 10 },  // Wild x10
  '🪙': { 3: 5 },
  '🧧': { 3: 3 },
  '🏮': { 3: 2 },
  '🎆': { 3: 2 }
};

export const FortuneTigerGame: React.FC<FortuneTigerGameProps> = ({
  coins,
  onCoinsChange,
  onSpinComplete,
  onBack,
  spinHistory
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pgbet-dark via-pgbet-red/10 to-pgbet-dark">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-lg border-b-2 border-pgbet-gold/30 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-pgbet-gold hover:text-pgbet-gold/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Voltar</span>
          </button>
          
          <div className="text-center">
            <div className="text-2xl animate-symbol-glow-dance">🐅</div>
            <h1 className="text-xl font-bold text-pgbet-gold">FORTUNE TIGER</h1>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xl">🪙</span>
            <span className="text-xl font-bold text-pgbet-gold">
              {coins.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Slot Machine */}
      <SlotMachineCore
        symbols={symbols}
        payouts={payouts}
        coins={coins}
        onCoinsChange={onCoinsChange}
        onSpinComplete={onSpinComplete}
        gameName="Fortune Tiger"
        gameColor="pgbet-gold"
        spinHistory={spinHistory}
      />
    </div>
  );
};
