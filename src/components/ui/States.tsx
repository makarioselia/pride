export function LoadingScreen({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ivory text-charcoal gap-3">
      <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      <p className="text-xs uppercase tracking-widest opacity-60">{label}</p>
    </div>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
      <p className="font-heading text-xl mb-2">{title}</p>
      {subtitle && <p className="text-sm opacity-60">{subtitle}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
      <p className="font-heading text-xl mb-2">Something went wrong</p>
      <p className="text-sm opacity-60">{message}</p>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-champagne/50 rounded ${className}`} />;
}
