import useSWR from 'swr';
import axios from 'axios';

interface LeaderboardEntry {
  id: string;
  username: string;
  gamesPlayed: number;
  totalPoints: number;
  averagePointsPerGame: number;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const fetcher = (url: string) => axios.get(url).then((response) => response.data);

export default function LeaderboardPage() {
  const { data, error } = useSWR<LeaderboardEntry[]>(`${backendUrl}/leaderboard`, fetcher, {
    refreshInterval: 30_000,
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold">Global Leaderboard</h1>
          <p className="mt-2 text-sm text-slate-300">Track the sharpest word tacticians across every WordGrid match.</p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3 text-right">Games Played</th>
                <th className="px-4 py-3 text-right">Total Points</th>
                <th className="px-4 py-3 text-right">Average</th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Failed to load leaderboard. Please try again later.
                  </td>
                </tr>
              )}
              {!data && !error && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Loading leaderboard…
                  </td>
                </tr>
              )}
              {data?.map((entry, index) => (
                <tr key={entry.id} className="border-t border-slate-800/80">
                  <td className="px-4 py-3 font-semibold text-white">#{index + 1}</td>
                  <td className="px-4 py-3 text-white">{entry.username}</td>
                  <td className="px-4 py-3 text-right">{entry.gamesPlayed}</td>
                  <td className="px-4 py-3 text-right">{entry.totalPoints}</td>
                  <td className="px-4 py-3 text-right">{entry.averagePointsPerGame.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
