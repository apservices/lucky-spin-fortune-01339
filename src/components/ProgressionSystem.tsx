import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Star, Trophy, Gift, Zap, Target, Calendar, Award } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'player' | 'veteran' | 'legendary';
  progress: number;
  maxProgress: number;
  reward: {
    xp: number;
    coins: number;
    badge?: string;
    title?: string;
  };
  unlocked: boolean;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
  unlockLevel: number;
  unlocked: boolean;
  active: boolean;
}

interface ProgressionSystemProps {
  level: number;
  experience: number;
  maxExperience: number;
  coins: number;
  onClaimReward: (reward: { xp: number; coins: number }) => void;
  onUnlockTheme: (themeId: string) => void;
}

export const ProgressionSystem: React.FC<ProgressionSystemProps> = ({
  level,
  experience,
  maxExperience,
  coins,
  onClaimReward,
  onUnlockTheme
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_spin',
      name: 'Primeira Rodada',
      description: 'Execute sua primeira rodada no Fortune Tiger',
      icon: '🎰',
      category: 'beginner',
      progress: 1,
      maxProgress: 1,
      reward: { xp: 50, coins: 100, badge: '🎯' },
      unlocked: true
    },
    {
      id: 'win_streak_5',
      name: 'Sequência de Sorte',
      description: 'Consiga 5 vitórias consecutivas',
      icon: '🔥',
      category: 'player',
      progress: 3,
      maxProgress: 5,
      reward: { xp: 200, coins: 500, title: 'Sortudo' },
      unlocked: false
    },
    {
      id: 'jackpot_hit',
      name: 'Grande Prêmio',
      description: 'Acerte um jackpot no Fortune Tiger',
      icon: '💰',
      category: 'veteran',
      progress: 0,
      maxProgress: 1,
      reward: { xp: 1000, coins: 2500, badge: '👑' },
      unlocked: false
    },
    {
      id: 'master_player',
      name: 'Mestre do Tigre',
      description: 'Alcance o nível 50',
      icon: '🐅',
      category: 'legendary',
      progress: level,
      maxProgress: 50,
      reward: { xp: 5000, coins: 10000, title: 'Mestre', badge: '🏆' },
      unlocked: false
    }
  ]);

  const [themes, setThemes] = useState<Theme[]>([
    {
      id: 'default',
      name: 'Fortune Tiger Clássico',
      description: 'O tema original do Fortune Tiger',
      preview: '🐅',
      unlockLevel: 1,
      unlocked: true,
      active: true
    },
    {
      id: 'phoenix',
      name: 'Fênix Dourada',
      description: 'Tema exclusivo com Fênix e cores douradas',
      preview: '🔥',
      unlockLevel: 5,
      unlocked: level >= 5,
      active: false
    },
    {
      id: 'panda',
      name: 'Panda da Sorte',
      description: 'Tema com Panda e bambús da fortuna',
      preview: '🐼',
      unlockLevel: 10,
      unlocked: level >= 10,
      active: false
    },
    {
      id: 'dragon',
      name: 'Dragão Imperial',
      description: 'Tema premium com Dragão Imperial',
      preview: '🐲',
      unlockLevel: 15,
      unlocked: level >= 15,
      active: false
    }
  ]);

  const [dailyMissions, setDailyMissions] = useState([
    {
      id: 'daily_spins',
      name: 'Rodadas Diárias',
      description: 'Execute 10 rodadas hoje',
      progress: 7,
      maxProgress: 10,
      reward: { xp: 100, coins: 200 },
      completed: false
    },
    {
      id: 'daily_wins',
      name: 'Vitórias do Dia',
      description: 'Consiga 3 vitórias hoje',
      progress: 1,
      maxProgress: 3,
      reward: { xp: 150, coins: 300 },
      completed: false
    }
  ]);

  const categoryColors = {
    beginner: 'bg-green-500',
    player: 'bg-blue-500',
    veteran: 'bg-purple-500',
    legendary: 'bg-orange-500'
  };

  const categoryIcons = {
    beginner: <Target className="w-4 h-4" />,
    player: <Star className="w-4 h-4" />,
    veteran: <Crown className="w-4 h-4" />,
    legendary: <Trophy className="w-4 h-4" />
  };

  const claimAchievement = (achievement: Achievement) => {
    if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      setAchievements(prev => 
        prev.map(a => 
          a.id === achievement.id ? { ...a, unlocked: true } : a
        )
      );
      
      onClaimReward(achievement.reward);
      
      toast.success(
        `🏆 Conquista desbloqueada: ${achievement.name}!`,
        {
          description: `+${achievement.reward.xp} XP, +${achievement.reward.coins} moedas`,
          duration: 4000
        }
      );
    }
  };

  const activateTheme = (themeId: string) => {
    setThemes(prev => 
      prev.map(theme => ({
        ...theme,
        active: theme.id === themeId
      }))
    );
    
    onUnlockTheme(themeId);
    toast.success(`Tema "${themes.find(t => t.id === themeId)?.name}" ativado!`);
  };

  const claimDailyMission = (missionId: string) => {
    const mission = dailyMissions.find(m => m.id === missionId);
    if (mission && mission.progress >= mission.maxProgress && !mission.completed) {
      setDailyMissions(prev => 
        prev.map(m => 
          m.id === missionId ? { ...m, completed: true } : m
        )
      );
      
      onClaimReward(mission.reward);
      
      toast.success(
        `✅ Missão completada: ${mission.name}!`,
        {
          description: `+${mission.reward.xp} XP, +${mission.reward.coins} moedas`,
          duration: 3000
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Progress Card */}
      <Card className="p-6 bg-gradient-to-br from-pgbet-gold/20 to-pgbet-red/10 border-2 border-pgbet-gold/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-4xl animate-symbol-glow-dance">👑</div>
            <div>
              <h3 className="text-2xl font-bold text-pgbet-gold">Nível {level}</h3>
              <p className="text-muted-foreground">Próximo nível em {maxExperience - experience} XP</p>
            </div>
          </div>
          <Badge className="bg-pgbet-gradient-gold text-pgbet-dark">
            {experience} / {maxExperience} XP
          </Badge>
        </div>
        
        <Progress 
          value={(experience / maxExperience) * 100} 
          className="h-4 bg-pgbet-dark/50"
        />
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/50">
          <TabsTrigger value="achievements" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Conquistas</span>
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center space-x-2">
            <Crown className="w-4 h-4" />
            <span>Temas</span>
          </TabsTrigger>
          <TabsTrigger value="missions" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Missões</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center space-x-2">
            <Gift className="w-4 h-4" />
            <span>Recompensas</span>
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          {Object.entries(
            achievements.reduce((acc, achievement) => {
              if (!acc[achievement.category]) acc[achievement.category] = [];
              acc[achievement.category].push(achievement);
              return acc;
            }, {} as Record<string, Achievement[]>)
          ).map(([category, categoryAchievements]) => (
            <div key={category}>
              <div className="flex items-center space-x-2 mb-3">
                <div className={cn("p-2 rounded", categoryColors[category as keyof typeof categoryColors])}>
                  {categoryIcons[category as keyof typeof categoryIcons]}
                </div>
                <h3 className="text-lg font-semibold capitalize">{category}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryAchievements.map(achievement => (
                  <Card 
                    key={achievement.id}
                    className={cn(
                      "p-4 transition-all duration-300",
                      achievement.unlocked 
                        ? "bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/50" 
                        : achievement.progress >= achievement.maxProgress
                        ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/50 animate-pulse"
                        : "bg-card/50 border-border"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-green-500 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Concluída
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100}
                        className="h-2"
                      />
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex space-x-2 text-xs">
                          <Badge variant="outline">+{achievement.reward.xp} XP</Badge>
                          <Badge variant="outline">+{achievement.reward.coins} moedas</Badge>
                        </div>
                        
                        {achievement.progress >= achievement.maxProgress && !achievement.unlocked && (
                          <Button 
                            size="sm"
                            onClick={() => claimAchievement(achievement)}
                            className="bg-pgbet-gradient-gold text-pgbet-dark"
                          >
                            Resgatar
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map(theme => (
              <Card 
                key={theme.id}
                className={cn(
                  "p-4 transition-all duration-300 cursor-pointer",
                  theme.active 
                    ? "bg-gradient-to-br from-pgbet-gold/30 to-pgbet-red/20 border-2 border-pgbet-gold ring-2 ring-pgbet-gold/50" 
                    : theme.unlocked
                    ? "bg-card/80 hover:bg-card border-border hover:border-pgbet-gold/30"
                    : "bg-card/30 border-muted opacity-60"
                )}
                onClick={() => theme.unlocked && activateTheme(theme.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{theme.preview}</span>
                    <div>
                      <h4 className="font-semibold">{theme.name}</h4>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {theme.active ? (
                      <Badge className="bg-pgbet-gradient-gold text-pgbet-dark">Ativo</Badge>
                    ) : theme.unlocked ? (
                      <Button size="sm" variant="outline">Ativar</Button>
                    ) : (
                      <Badge variant="outline">Nível {theme.unlockLevel}</Badge>
                    )}
                  </div>
                </div>
                
                {!theme.unlocked && (
                  <div className="text-xs text-muted-foreground">
                    Desbloqueado no nível {theme.unlockLevel}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Daily Missions Tab */}
        <TabsContent value="missions" className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-pgbet-gold" />
            <h3 className="text-lg font-semibold">Missões Diárias</h3>
            <Badge className="bg-pgbet-gradient-red text-white">Renovam em 12h</Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {dailyMissions.map(mission => (
              <Card 
                key={mission.id}
                className={cn(
                  "p-4",
                  mission.completed 
                    ? "bg-gradient-to-r from-green-500/20 to-green-600/10 border-green-500/50" 
                    : mission.progress >= mission.maxProgress
                    ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/50"
                    : "bg-card/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{mission.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{mission.progress}/{mission.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(mission.progress / mission.maxProgress) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    {mission.completed ? (
                      <Badge className="bg-green-500 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Concluída
                      </Badge>
                    ) : mission.progress >= mission.maxProgress ? (
                      <Button 
                        size="sm"
                        onClick={() => claimDailyMission(mission.id)}
                        className="bg-pgbet-gradient-gold text-pgbet-dark"
                      >
                        Resgatar
                      </Button>
                    ) : (
                      <div className="text-sm space-y-1">
                        <Badge variant="outline">+{mission.reward.xp} XP</Badge>
                        <Badge variant="outline">+{mission.reward.coins} moedas</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <Card className="p-6 text-center bg-gradient-to-br from-pgbet-purple/20 to-pgbet-emerald/10 border-2 border-pgbet-purple/30">
            <Gift className="w-16 h-16 mx-auto mb-4 text-pgbet-purple animate-bounce" />
            <h3 className="text-xl font-bold mb-2">Sistema de Recompensas</h3>
            <p className="text-muted-foreground mb-4">
              Complete conquistas e missões para ganhar XP, moedas, temas exclusivos e títulos especiais!
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-card/50 rounded-lg">
                <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <h4 className="font-semibold">XP Bônus</h4>
                <p className="text-sm text-muted-foreground">Acelere seu progresso</p>
              </div>
              <div className="p-4 bg-card/50 rounded-lg">
                <Crown className="w-8 h-8 mx-auto mb-2 text-pgbet-gold" />
                <h4 className="font-semibold">Temas Exclusivos</h4>
                <p className="text-sm text-muted-foreground">Personalize seu jogo</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};