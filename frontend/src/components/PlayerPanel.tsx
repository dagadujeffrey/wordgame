import clsx from 'clsx';

interface PlayerInfo {
  id: string;
  username: string;
  score: number;
}

interface PlayerPanelProps {
  players: PlayerInfo[];
  currentPlayerId: string;
}

export function PlayerPanel({ players, currentPlayerId }: PlayerPanelProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <h2 className="text-lg font-semibold text-white">Players</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {players.map((player) => {
          const isCurrent = player.id === currentPlayerId;
          return (
            <div
              key={player.id}
              className={clsx(
                'rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition-colors',
                isCurrent && 'border-primary/70 bg-primary/10'
              )}
            >
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span className="font-semibold text-white">{player.username}</span>
                <span className="text-xs uppercase tracking-wide text-slate-400">Score</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-white">{player.score}</div>
              {isCurrent && <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary">Your turn</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
