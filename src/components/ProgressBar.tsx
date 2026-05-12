type Props = { value: number; max: number; className?: string };

export function ProgressBar({ value, max, className = "" }: Props) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-amber-100 ${className}`}>
      <div
        className="h-full rounded-full bg-amber-500 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
