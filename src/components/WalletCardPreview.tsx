type Props = {
  shopName: string;
  beans: number;
  threshold: number;
  uniqueCode: string;
  progressLabel?: string;
  beansLabel?: string;
};

export function WalletCardPreview({
  shopName, beans, threshold, uniqueCode,
  progressLabel = "to free coffee",
  beansLabel = "beans",
}: Props) {
  const pct = Math.min(100, Math.round((beans / threshold) * 100));
  return (
    <div className="coffee-gradient rounded-3xl p-6 text-cream shadow-lg ring-1 ring-coffee-900/30">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-coffee-200/80">
        <span>grabthebeans</span>
        <span>{shopName}</span>
      </div>
      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-5xl font-extrabold tracking-tight leading-none">{beans}</p>
          <p className="mt-1 text-sm text-coffee-200/80">/ {threshold} {beansLabel}</p>
        </div>
        <p className="text-sm font-semibold text-coffee-200">{pct}% {progressLabel}</p>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-cream transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-center font-mono text-sm tracking-wider">
        {uniqueCode}
      </div>
    </div>
  );
}
