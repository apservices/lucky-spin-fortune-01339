import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Coins, 
  Gift, 
  History, 
  ShoppingBag, 
  Star, 
  Zap, 
  Crown, 
  Trophy,
  Search,
  Filter,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  bonus?: number;
  icon: string;
  gradient: string;
  description: string;
  method: 'daily' | 'mission' | 'achievement' | 'referral';
}

interface Prize {
  id: string;
  name: string;
  description: string;
  cost: number; // in redemption points
  type: 'theme' | 'multiplier' | 'xp_bonus' | 'cosmetic';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  available: number;
  timeLimit?: string;
}

interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'bonus' | 'achievement';
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface VirtualCoinStoreProps {
  coins: number;
  redemptionPoints: number;
  onEarnCoins: (amount: number, method: string) => void;
  onSpendRedemptionPoints: (amount: number, prize: Prize) => void;
}

export const VirtualCoinStore: React.FC<VirtualCoinStoreProps> = ({
  coins,
  redemptionPoints,
  onEarnCoins,
  onSpendRedemptionPoints
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const coinPackages: CoinPackage[] = [
    {
      id: 'daily_bonus',
      name: 'Bônus Diário',
      coins: 500,
      bonus: 100,
      icon: '🎁',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Colete seu bônus diário de moedas',
      method: 'daily'
    },
    {
      id: 'mission_complete',
      name: 'Missão Completa',
      coins: 1000,
      bonus: 250,
      icon: '✅',
      gradient: 'from-green-500 to-green-600',
      description: 'Complete missões para ganhar moedas',
      method: 'mission'
    },
    {
      id: 'achievement_unlock',
      name: 'Conquista Desbloqueada',
      coins: 2500,
      bonus: 500,
      icon: '🏆',
      gradient: 'from-purple-500 to-purple-600',
      description: 'Desbloqueie conquistas para grandes recompensas',
      method: 'achievement'
    },
    {
      id: 'referral_bonus',
      name: 'Indicação de Amigo',
      coins: 5000,
      bonus: 1000,
      icon: '👥',
      gradient: 'from-orange-500 to-red-500',
      description: 'Indique amigos e ganhe moedas',
      method: 'referral'
    }
  ];

  const prizes: Prize[] = [
    {
      id: 'theme_phoenix',
      name: 'Tema Fênix Dourada',
      description: 'Transforme seu jogo com o tema Fênix',
      cost: 5,
      type: 'theme',
      icon: '🔥',
      rarity: 'epic',
      available: 50,
      timeLimit: '7 dias'
    },
    {
      id: 'multiplier_2x',
      name: 'Multiplicador 2x',
      description: 'Dobre seus ganhos por 1 hora',
      cost: 2,
      type: 'multiplier',
      icon: '⚡',
      rarity: 'rare',
      available: 100
    },
    {
      id: 'xp_boost',
      name: 'Impulso de XP',
      description: '+50% XP por 24 horas',
      cost: 3,
      type: 'xp_bonus',
      icon: '🚀',
      rarity: 'rare',
      available: 75
    },
    {
      id: 'skin_golden_tiger',
      name: 'Tigre Dourado Premium',
      description: 'Skin exclusiva para símbolos',
      cost: 10,
      type: 'cosmetic',
      icon: '🐅',
      rarity: 'legendary',
      available: 25,
      timeLimit: '3 dias'
    }
  ];

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earn',
      amount: 1000,
      description: 'Bônus diário coletado',
      date: '2024-01-15',
      category: 'Bônus'
    },
    {
      id: '2',
      type: 'spend',
      amount: -500,
      description: 'Comprou Multiplicador 2x',
      date: '2024-01-14',
      category: 'Prêmio'
    },
    {
      id: '3',
      type: 'achievement',
      amount: 2500,
      description: 'Conquista: Primeira Vitória',
      date: '2024-01-13',
      category: 'Conquista'
    }
  ]);

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-500',
    epic: 'from-purple-400 to-purple-500',
    legendary: 'from-orange-400 to-red-500'
  };

  const rarityBorders = {
    common: 'border-gray-400',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-orange-400'
  };

  const claimCoinPackage = (pkg: CoinPackage) => {
    const totalCoins = pkg.coins + (pkg.bonus || 0);
    onEarnCoins(totalCoins, pkg.method);
    
    toast.success(
      `🪙 ${totalCoins.toLocaleString()} moedas coletadas!`,
      {
        description: pkg.description,
        duration: 3000
      }
    );
  };

  const redeemPrize = (prize: Prize) => {
    if (redemptionPoints >= prize.cost) {
      onSpendRedemptionPoints(prize.cost, prize);
      
      toast.success(
        `🎁 ${prize.name} resgatado!`,
        {
          description: prize.description,
          duration: 4000
        }
      );
    } else {
      toast.error(
        'Pontos insuficientes!',
        {
          description: `Você precisa de ${prize.cost} pontos de resgate`,
          duration: 3000
        }
      );
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPrizes = prizes.filter(prize => {
    const matchesSearch = prize.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || prize.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-pgbet-gold/20 to-pgbet-red/10 border-2 border-pgbet-gold/30">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <Coins className="w-12 h-12 mx-auto mb-2 text-pgbet-gold animate-bounce" />
            <h3 className="text-2xl font-bold text-pgbet-gold">{coins.toLocaleString()}</h3>
            <p className="text-muted-foreground">Moedas Virtuais</p>
          </div>
          <div className="text-center">
            <Star className="w-12 h-12 mx-auto mb-2 text-pgbet-purple animate-pulse" />
            <h3 className="text-2xl font-bold text-pgbet-purple">{redemptionPoints}</h3>
            <p className="text-muted-foreground">Pontos de Resgate</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-card/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ Moedas virtuais sem valor real • Apenas para entretenimento
          </p>
        </div>
      </Card>

      <Tabs defaultValue="earn" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50">
          <TabsTrigger value="earn" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Ganhar Moedas</span>
          </TabsTrigger>
          <TabsTrigger value="redeem" className="flex items-center space-x-2">
            <Gift className="w-4 h-4" />
            <span>Resgatar Prêmios</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>Histórico</span>
          </TabsTrigger>
        </TabsList>

        {/* Earn Coins Tab */}
        <TabsContent value="earn" className="space-y-4">
          <div className="text-center mb-6">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-pgbet-gold" />
            <h2 className="text-2xl font-bold mb-2">Ganhe Moedas Virtuais</h2>
            <p className="text-muted-foreground">
              Complete atividades para ganhar moedas e pontos de resgate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coinPackages.map(pkg => (
              <Card 
                key={pkg.id}
                className="p-4 transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => claimCoinPackage(pkg)}
              >
                <div className={cn(
                  "p-4 rounded-lg mb-4 bg-gradient-to-br",
                  pkg.gradient,
                  "group-hover:scale-110 transition-transform duration-300"
                )}>
                  <div className="text-center text-white">
                    <span className="text-4xl mb-2 block">{pkg.icon}</span>
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">{pkg.coins.toLocaleString()}</span>
                      {pkg.bonus && (
                        <span className="text-sm ml-2 opacity-90">
                          +{pkg.bonus.toLocaleString()} bônus
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  {pkg.description}
                </p>
                
                <Button 
                  className="w-full bg-pgbet-gradient-gold text-pgbet-dark font-bold hover:scale-105 transition-transform"
                >
                  Coletar Agora
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Redeem Prizes Tab */}
        <TabsContent value="redeem" className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Catálogo de Prêmios</h2>
              <p className="text-muted-foreground">
                Troque pontos de resgate por prêmios exclusivos
              </p>
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar prêmios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-card border border-border rounded-md"
              >
                <option value="all">Todos os tipos</option>
                <option value="theme">Temas</option>
                <option value="multiplier">Multiplicadores</option>
                <option value="xp_bonus">Bônus XP</option>
                <option value="cosmetic">Cosméticos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrizes.map(prize => (
              <Card 
                key={prize.id}
                className={cn(
                  "p-4 transition-all duration-300 hover:scale-105",
                  "border-2",
                  rarityBorders[prize.rarity]
                )}
              >
                <div className="text-center mb-4">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl",
                    "bg-gradient-to-br",
                    rarityColors[prize.rarity]
                  )}>
                    {prize.icon}
                  </div>
                  
                  <Badge 
                    className={cn(
                      "mb-2 capitalize",
                      prize.rarity === 'legendary' ? 'bg-orange-500' :
                      prize.rarity === 'epic' ? 'bg-purple-500' :
                      prize.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
                    )}
                  >
                    {prize.rarity}
                  </Badge>
                  
                  <h3 className="font-bold text-lg">{prize.name}</h3>
                  <p className="text-sm text-muted-foreground">{prize.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Custo:</span>
                    <Badge variant="outline">
                      <Star className="w-3 h-3 mr-1" />
                      {prize.cost} pts
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Disponível:</span>
                    <span className="text-sm text-muted-foreground">{prize.available}</span>
                  </div>
                  
                  {prize.timeLimit && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Expira em:</span>
                      <span className="text-sm text-red-500">{prize.timeLimit}</span>
                    </div>
                  )}
                  
                  <Button 
                    className={cn(
                      "w-full",
                      redemptionPoints >= prize.cost
                        ? "bg-pgbet-gradient-gold text-pgbet-dark"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                    onClick={() => redeemPrize(prize)}
                    disabled={redemptionPoints < prize.cost}
                  >
                    {redemptionPoints >= prize.cost ? 'Resgatar' : 'Pontos Insuficientes'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Histórico de Transações</h2>
              <p className="text-muted-foreground">
                Acompanhe seus ganhos e gastos
              </p>
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-card border border-border rounded-md"
              >
                <option value="all">Todas categorias</option>
                <option value="Bônus">Bônus</option>
                <option value="Prêmio">Prêmios</option>
                <option value="Conquista">Conquistas</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTransactions.map(transaction => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      transaction.type === 'earn' ? 'bg-green-500/20 text-green-500' :
                      transaction.type === 'spend' ? 'bg-red-500/20 text-red-500' :
                      transaction.type === 'bonus' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-purple-500/20 text-purple-500'
                    )}>
                      {transaction.type === 'earn' ? <TrendingUp className="w-4 h-4" /> :
                       transaction.type === 'spend' ? <ShoppingBag className="w-4 h-4" /> :
                       transaction.type === 'bonus' ? <Gift className="w-4 h-4" /> :
                       <Trophy className="w-4 h-4" />}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">{transaction.description}</h4>
                      <p className="text-sm text-muted-foreground flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "text-right font-bold",
                    transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};