import React from 'react';
import { Home, Gamepad2, Trophy, ShoppingBag, Settings } from 'lucide-react';
import { GameType } from '@/pages/Index';

interface BottomNavProps {
  currentScreen: GameType;
  onNavigate: (screen: GameType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'lobby' as GameType, icon: Home, label: 'Lobby' },
    { id: 'fortune-tiger' as GameType, icon: Gamepad2, label: 'Tigre' },
    { id: 'challenges' as GameType, icon: Trophy, label: 'Desafios' },
    { id: 'store' as GameType, icon: ShoppingBag, label: 'Loja' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t-2 border-pgbet-gold/30 z-50">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 transition-all ${
                isActive
                  ? 'text-pgbet-gold scale-110'
                  : 'text-muted-foreground hover:text-pgbet-gold'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'animate-symbol-glow-dance' : ''}`} />
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
