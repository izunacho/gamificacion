import type { ReactNode } from 'react';

interface StatBarProps {
  value: number;
  max: number;
  colorClass: string;
  trackClass?: string;
  label?: ReactNode;
  valueLabel?: ReactNode;
  height?: string;
}

export function StatBar({
  value,
  max,
  colorClass,
  trackClass = 'bg-white/10',
  label,
  valueLabel,
  height = 'h-3',
}: StatBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

  return (
    <div className="w-full">
      {(label || valueLabel) && (
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-white/70">
          <span>{label}</span>
          <span>{valueLabel}</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full ${trackClass} ${height}`}>
        <div
          className={`animate-bar-fill h-full rounded-full ${colorClass} transition-[width] duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
