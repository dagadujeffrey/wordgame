import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useBackendUrl } from '../../hooks/useBackendUrl';

export default function OnlineGamePage() {
  const backendUrl = useBackendUrl();
  const router = useRouter();
  const [roomName, setRoomName] = useState('WordGrid Room');
  const [playerName, setPlayerName] = useState('Player');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/games`, {
        players: [playerName],
        mode: 'online',
        roomName,
      });

      await router.push(`/game/${response.data.id}`);
    } catch (err) {
      console.error(err);
      setError('Unable to create online room.');
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
          <h1 className="mt-4 text-3xl font-bold">Host Online Match</h1>
          <p className="mt-2 text-sm text-slate-300">Create a room and invite players by sharing the link.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <label className="flex flex-col text-sm">
            <span className="text-slate-400">Display name</span>
            <input
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
              required
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-slate-400">Room title</span>
            <input
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
              className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-primary focus:outline-none"
              required
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating…' : 'Create room'}
          </button>
        </form>
      </div>
    </main>
  );
}
