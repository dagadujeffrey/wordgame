import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Board, BoardCell } from '../../components/Board';
import { PlayerPanel } from '../../components/PlayerPanel';
import { ScoreSummary } from '../../components/ScoreSummary';
import { getSocket } from '../../lib/socket';
import { useBackendUrl } from '../../hooks/useBackendUrl';

interface PlayerState {
  id: string;
  username: string;
  score: number;
}

interface GameState {
  id: string;
  players: PlayerState[];
  board: BoardCell[][];
  currentPlayerIndex: number;
  isComplete: boolean;
}

interface ScoreWord {
  word: string;
  length: number;
}

interface ScorePayload {
  rows: (ScoreWord | null)[];
  columns: (ScoreWord | null)[];
  totals: Record<string, number>;
}

export default function GameRoomPage() {
  const router = useRouter();
  const backendUrl = useBackendUrl();
  const { roomId } = router.query as { roomId?: string };
  const [state, setState] = useState<GameState | null>(null);
  const [scores, setScores] = useState<ScorePayload | null>(null);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    let mounted = true;
    axios
      .get<GameState>(`${backendUrl}/games/${roomId}`)
      .then((response) => {
        if (mounted) {
          setState(response.data);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch game', error);
      });

    const socket = getSocket(backendUrl);
    socket.emit('join-room', { roomId });
    socket.on('state-updated', (game: GameState) => {
      setState(game);
    });

    return () => {
      mounted = false;
      socket.off('state-updated');
    };
  }, [backendUrl, roomId]);

  useEffect(() => {
    if (!state || !state.isComplete) {
      return;
    }

    axios
      .post<ScorePayload>(`${backendUrl}/games/${state.id}/score`)
      .then((response) => setScores(response.data))
      .catch((error) => console.error('Failed to fetch score', error));
  }, [backendUrl, state]);

  const board = useMemo(() => state?.board ?? [], [state]);
  const players = state?.players ?? [];
  const currentPlayer = state ? state.players[state.currentPlayerIndex] : null;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header>
          <button className="text-sm text-slate-400 hover:text-white" type="button" onClick={() => router.push('/')}>← Back</button>
          <h1 className="mt-4 text-3xl font-bold">Room {roomId}</h1>
          <p className="mt-2 text-sm text-slate-300">Share this link with friends or invite AI opponents to compete.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            {currentPlayer && <PlayerPanel players={players} currentPlayerId={currentPlayer.id} />}
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <Board board={board} />
          </div>
        </div>

        {scores && (
          <ScoreSummary rows={scores.rows} columns={scores.columns} totals={scores.totals} />
        )}
      </div>
    </main>
  );
}
