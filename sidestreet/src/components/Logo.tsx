import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`font-medium tracking-[-0.05em] leading-none ${className}`} aria-label="side street — home">
      side street
    </Link>
  );
}

export function StackedIcon({ size = 48, inverted = true }: { size?: number; inverted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`frame inline-flex items-center justify-center ${inverted ? "bg-ink text-paper" : "bg-paper text-ink border border-line"}`}
      style={
        {
          width: size,
          height: size,
          "--frame-size": `${Math.round(size * 0.15)}px`,
          "--frame-weight": `${Math.max(1.5, size / 50)}px`,
          padding: size * 0.16,
        } as React.CSSProperties
      }
    >
      <span className="flex flex-col font-medium tracking-[-0.05em]" style={{ fontSize: size * 0.18, lineHeight: 0.95 }}>
        <span>side</span>
        <span>street</span>
      </span>
    </span>
  );
}
