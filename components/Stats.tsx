interface StatsProps {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
}

export default function Stats({
  gamesPlayed,
  wins,
  currentStreak,
  maxStreak,
}: StatsProps) {
  const winPercentage =
    gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-3xl font-bold">{gamesPlayed}</div>
        <div className="text-xs text-gray-500">Runder spilt</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{winPercentage}</div>
        <div className="text-xs text-gray-500">Vunnet %</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{currentStreak}</div>
        <div className="text-xs text-gray-500">Streak</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{maxStreak}</div>
        <div className="text-xs text-gray-500">Rekord streak</div>
      </div>
    </div>
  );
}
