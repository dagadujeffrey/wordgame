interface WordBreakdown {
  word: string;
  length: number;
}

interface ScoreSummaryProps {
  rows: (WordBreakdown | null)[];
  columns: (WordBreakdown | null)[];
  totals: Record<string, number>;
}

export function ScoreSummary({ rows, columns, totals }: ScoreSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="text-lg font-semibold text-white">Final Score</h2>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Rows</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {rows.map((entry, index) => (
              <li key={`row-${index}`} className="flex items-center justify-between rounded-lg bg-slate-900/60 px-3 py-2">
                <span className="font-medium text-white">Row {index + 1}</span>
                <span>{entry ? `${entry.word} (+${entry.length})` : '—'}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Columns</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {columns.map((entry, index) => (
              <li key={`col-${index}`} className="flex items-center justify-between rounded-lg bg-slate-900/60 px-3 py-2">
                <span className="font-medium text-white">Column {index + 1}</span>
                <span>{entry ? `${entry.word} (+${entry.length})` : '—'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Totals</h3>
        <ul className="mt-2 space-y-2 text-sm text-slate-300">
          {Object.entries(totals).map(([player, score]) => (
            <li key={player} className="flex items-center justify-between rounded-lg bg-slate-900/60 px-3 py-2">
              <span className="font-medium text-white">{player}</span>
              <span className="text-base font-semibold text-white">{score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
