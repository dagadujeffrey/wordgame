import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useBackendUrl } from '../../hooks/useBackendUrl';

export default function LocalGamePage() {
  const backendUrl = useBackendUrl();
  const router = useRouter();
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/games`, {
        players: playerNames.filter(Boolean),
        mode: 'local',
      });

      const gameId = response.data.id;
      await router.push(`/game/${gameId}`);
    } catch (err) {
      console.error(err);
      setError('Unable to start local game. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-xl flex-col gap-8">
        <header>
          <button type="button" className="text-sm text-slate-400 hover:text-white" onClick={() => router.back()}>
            ← Back
          </button>
          <h1 className="mt-4 text-3xl font-bold">Local Hot-Seat</h1>
          <p className="mt-2 text-sm text-slate-300">Set up a friendly WordGrid match for 2–4 players on a single device.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="space-y-3">
            {playerNames.map((name, index) => (
              <label key={index} className="flex flex-col text-sm">
                <span className="text-slate-400">Player {index + 1}</span>
                <input
                  value={name}
                  onChange={(event) =>
                    setPlayerNames((current) => {
                      const clone = [...current];
                      clone[index] = event.target.value;
                      return clone;
                    })
                  }
                  className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
                  required={index < 2}
                />
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {playerNames.length < 4 && (
              <button
                type="button"
                onClick={() => setPlayerNames((current) => [...current, `Player ${current.length + 1}`])}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-slate-500"
              >
                + Add player
              </button>
            )}
            {playerNames.length > 2 && (
              <button
                type="button"
                onClick={() => setPlayerNames((current) => current.slice(0, -1))}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-slate-500"
              >
                − Remove player
              </button>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Starting…' : 'Start game'}
          </button>
        </form>
      </div>
    </main>
  );
}
