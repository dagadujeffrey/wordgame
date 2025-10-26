import clsx from 'clsx';

export interface BoardCell {
  letter: string;
  ownerId: string | null;
}

interface BoardProps {
  board: BoardCell[][];
  highlightPositions?: [number, number][];
  onCellClick?: (row: number, column: number) => void;
}

const ownerColors: Record<string, string> = {
  p1: 'border-primary bg-primary/10 text-primary',
  p2: 'border-accent bg-accent/10 text-accent',
};

export function Board({ board, highlightPositions = [], onCellClick }: BoardProps) {
  const highlights = new Set(highlightPositions.map(([row, column]) => `${row}-${column}`));

  return (
    <div className="grid grid-cols-4 gap-3">
      {board.map((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          const key = `${rowIndex}-${columnIndex}`;
          const highlight = highlights.has(key);
          const letter = cell.letter || '';
          const ownerClass = cell.ownerId ? ownerColors[cell.ownerId] ?? 'border-emerald-500/70 bg-emerald-500/5 text-emerald-400' : 'border-slate-700';

          return (
            <button
              key={key}
              type="button"
              onClick={() => onCellClick?.(rowIndex, columnIndex)}
              className={clsx(
                'flex aspect-square items-center justify-center rounded-xl border text-3xl font-semibold uppercase transition-transform hover:-translate-y-0.5',
                ownerClass,
                highlight && 'ring-2 ring-offset-2 ring-offset-slate-900 ring-primary'
              )}
            >
              {letter || <span className="text-base text-slate-600">•</span>}
            </button>
          );
        }),
      )}
    </div>
  );
}
