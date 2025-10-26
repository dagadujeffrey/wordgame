import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PlayerPanel } from '../components/PlayerPanel';
import { Board } from '../components/Board';
import { sampleBoard } from '../lib/sampleData';

export default function HomePage() {
  const [players] = useState([
    { id: 'p1', username: 'You', score: 12 },
    { id: 'p2', username: 'Rival', score: 9 },
  ]);

  const board = useMemo(() => sampleBoard, []);

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">WordGrid</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-300">
              Build the ultimate 4×4 word grid in local, online, or solo modes. Strategically place letters, block opponents,
              and claim the longest words to win the match.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/40 hover:bg-primary/90"
                href="/game/local"
              >
                Start Local Game
              </Link>
              <Link
                className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-100 hover:border-slate-500"
                href="/game/online"
              >
                Find Online Room
              </Link>
              <Link
                className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-accent/30 hover:bg-accent/90"
                href="/game/solo"
              >
                Challenge AI
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <PlayerPanel players={players} currentPlayerId="p1" />
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1fr,320px]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/30">
            <h2 className="text-xl font-semibold text-white">Preview the Grid</h2>
            <p className="mt-2 text-sm text-slate-300">Every row and column is a scoring opportunity. Who will control the board?</p>
            <div className="mt-6">
              <Board board={board} highlightPositions={[[0, 0], [0, 1], [0, 2], [0, 3]]} />
            </div>
          </div>
          <aside className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-lg font-semibold text-white">How scoring works</h3>
              <p className="mt-2 text-sm text-slate-300">
                Fill the grid one letter at a time. At the end, each row and column awards points for the longest valid word
                (2–4 letters). Every player contributing letters to that word shares the points.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-lg font-semibold text-white">Game modes</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                <li><span className="font-semibold text-white">Local:</span> Up to 4 friends hot-seat with one device.</li>
                <li><span className="font-semibold text-white">Online:</span> Real-time multiplayer with public or private rooms.</li>
                <li><span className="font-semibold text-white">Solo:</span> Battle an AI that adapts to your skill level.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
