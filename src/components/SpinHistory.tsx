import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Trophy } from 'lucide-react';

interface SpinRecord {
  id: number;
  bet: number;
  win: number;
  multiplier: number;
  timestamp: Date;
  type: 'normal' | 'big' | 'mega' | 'free';
}

interface SpinHistoryProps {
  history: SpinRecord[];
}

export const SpinHistory: React.FC<SpinHistoryProps> = ({ history }) => {
  const totalSpins = history.length;
  const totalWins = history.filter(s => s.win > 0).length;
  const winRate = totalSpins > 0 ? ((totalWins / totalSpins) * 100).toFixed(1) : '0.0';
  const maxWin = history.length > 0 ? Math.max(...history.map(s => s.win)) : 0;
  const totalProfit = history.reduce((sum, s) => sum + (s.win - s.bet), 0);

  return (
    <Card className="w-full h-full bg-gradient-to-br from-card/80 to-pgbet-dark/60 border-2 border-pgbet-gold/30 backdrop-blur-md p-4 flex flex-col">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-pgbet-gold mb-2">📊 Histórico</h3>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-card/50 rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground">Taxa de Vitória</div>
            <div className="text-lg font-bold text-pgbet-emerald">{winRate}%</div>
          </div>
          <div className="bg-card/50 rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground">Maior Prêmio</div>
            <div className="text-lg font-bold text-pgbet-gold">{maxWin.toLocaleString('pt-BR')}</div>
          </div>
        </div>

        <div className="bg-card/50 rounded-lg p-2 text-center">
          <div className="text-xs text-muted-foreground">Lucro Total</div>
          <div className={`text-base font-bold ${totalProfit >= 0 ? 'text-pgbet-emerald' : 'text-pgbet-red'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* History list */}
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Nenhum giro ainda.<br/>Comece a jogar!
            </div>
          ) : (
            history.slice().reverse().map((spin) => (
              <div
                key={spin.id}
                className={`
                  rounded-lg p-2 border
                  ${spin.win > spin.bet * 10 ? 'bg-pgbet-purple/20 border-pgbet-purple' : 
                    spin.win > 0 ? 'bg-pgbet-emerald/10 border-pgbet-emerald/30' : 
                    'bg-card/30 border-border/50'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {spin.type === 'free' && <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">FREE</Badge>}
                    {spin.win > spin.bet * 100 && <Trophy className="w-3 h-3 text-pgbet-gold" />}
                    <span className="text-xs text-muted-foreground">
                      Aposta: {spin.bet.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="text-right">
                    {spin.win > 0 ? (
                      <div className="space-y-0">
                        <div className="text-sm font-bold text-pgbet-emerald">
                          +{spin.win.toLocaleString('pt-BR')}
                        </div>
                        {spin.multiplier > 1 && (
                          <div className="text-[10px] text-pgbet-gold">
                            ×{spin.multiplier}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">-</div>
                    )}
                  </div>
                </div>
                
                {spin.win > spin.bet * 100 && (
                  <div className="text-[10px] text-pgbet-gold font-bold mt-1 text-center animate-pulse">
                    🎉 BIG WIN! 🎉
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="text-xs text-center text-muted-foreground">
          Total: {totalSpins} giros
        </div>
      </div>
    </Card>
  );
};
