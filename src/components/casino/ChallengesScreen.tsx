import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Star, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ChallengesScreenProps {
  coins: number;
  onCoinsChange: (coins: number) => void;
  dailyProgress: {
    tigerSpins: number;
    totalWins: number;
    adsWatched: number;
  };
  onBack: () => void;
}

export const ChallengesScreen: React.FC<ChallengesScreenProps> = ({
  coins,
  onCoinsChange,
  dailyProgress,
  onBack
}) => {
  const challenges = [
    {
      id: 1,
      title: '🐯 20 Giros no Fortune Tiger',
      description: 'Gire 20 vezes no jogo do Tigrinho',
      reward: 300,
      progress: dailyProgress.tigerSpins,
      target: 20,
      icon: '🐯',
      color: 'pgbet-gold'
    },
    {
      id: 2,
      title: '⭐ Ganhe 5 Vitórias',
      description: 'Conquiste 5 vitórias em qualquer jogo',
      reward: 500,
      progress: dailyProgress.totalWins,
      target: 5,
      icon: '⭐',
      color: 'pgbet-amber'
    },
    {
      id: 3,
      title: '📺 Assista 3 Anúncios',
      description: 'Ganhe moedas extras assistindo anúncios',
      reward: 200,
      progress: dailyProgress.adsWatched,
      target: 3,
      icon: '📺',
      color: 'pgbet-purple'
    },
    {
      id: 4,
      title: '🎰 Big Win no Tigrinho',
      description: 'Ganhe 5x ou mais em um único spin',
      reward: 1000,
      progress: 0,
      target: 1,
      icon: '💰',
      color: 'pgbet-red'
    }
  ];

  const handleClaimReward = (challenge: typeof challenges[0]) => {
    if (challenge.progress >= challenge.target) {
      onCoinsChange(coins + challenge.reward);
      toast.success(`🎉 Desafio concluído! +${challenge.reward} moedas`);
    } else {
      toast.error('Complete o desafio primeiro!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pgbet-dark via-card to-pgbet-dark p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto space-y-6 pb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-pgbet-gold hover:text-pgbet-gold/80"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Voltar</span>
          </button>

          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-pgbet-gold animate-symbol-glow-dance" />
            <h1 className="text-2xl font-bold text-pgbet-gold">DESAFIOS DIÁRIOS</h1>
          </div>

          <div className="w-20" />
        </div>

        {/* Challenges */}
        <div className="space-y-4">
          {challenges.map((challenge) => {
            const isCompleted = challenge.progress >= challenge.target;
            const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100);

            return (
              <Card key={challenge.id} className="p-6 bg-card/80 backdrop-blur-lg border-2 border-pgbet-gold/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{challenge.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{challenge.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-pgbet-gold text-pgbet-dark">
                          +{challenge.reward} moedas
                        </Badge>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-pgbet-emerald" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progresso: {challenge.progress}/{challenge.target}
                    </span>
                    <span className="text-pgbet-gold font-bold">
                      {progressPercent.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>

                {isCompleted && (
                  <button
                    onClick={() => handleClaimReward(challenge)}
                    className="w-full mt-4 h-10 bg-pgbet-gradient-gold hover:scale-105 transition-transform font-bold text-pgbet-dark rounded-lg"
                  >
                    RESGATAR RECOMPENSA
                  </button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Ranking (Fictício) */}
        <Card className="p-6 bg-card/80 backdrop-blur-lg border-2 border-pgbet-purple/30">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-6 h-6 text-pgbet-purple" />
            <h2 className="text-xl font-bold text-pgbet-purple">RANKING SEMANAL</h2>
          </div>

          <div className="space-y-2">
            {['João S.', 'Ana R.', 'Pedro M.', 'Maria L.', 'Carlos A.'].map((name, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-pgbet-dark/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-pgbet-gold">#{idx + 1}</span>
                  <span className="font-medium">{name}</span>
                </div>
                <span className="text-pgbet-gold font-bold">
                  {(15000 - idx * 2000).toLocaleString('pt-BR')} pts
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Top 100 ganham +5000 moedas toda semana!
          </p>
        </Card>
      </div>
    </div>
  );
};
