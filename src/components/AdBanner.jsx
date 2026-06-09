import { Megaphone, Download } from "lucide-react";

export default function AdBanner({ variant = "horizontal", className = "" }) {
  if (variant === "sidebar") {
    return (
      <div className={`rounded-xl border border-border/50 bg-secondary/50 backdrop-blur-sm overflow-hidden ${className}`}>
        <div className="p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
            <Megaphone className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1">
            Advertisement
          </p>
          <p className="text-sm font-body text-muted-foreground/70">
            300 × 250
          </p>
          <div className="mt-4 w-full h-px bg-border/50" />
          <p className="mt-3 text-xs text-muted-foreground/50 font-body">
            Your brand here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-border/50 bg-secondary/30 backdrop-blur-sm overflow-hidden ${className}`}>
      <div className="px-6 py-4 flex items-center justify-between gap-6">
        <a href="https://media.base44.com/images/public/69c4550d94d5716560c9bc7d/d23d72fbf_Logo1.jpg" download className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/60 hover:bg-secondary/80 transition cursor-pointer group">
          <img src="https://media.base44.com/images/public/69c4550d94d5716560c9bc7d/d23d72fbf_Logo1.jpg" alt="Logo" className="w-12 h-12 object-contain" />
          <Download className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition opacity-0 group-hover:opacity-100" />
        </a>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-body text-muted-foreground uppercase tracking-widest">
              Advertisement
            </p>
            <p className="text-xs text-muted-foreground/50 font-body">
              728 × 90 — Leaderboard
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/50 font-body">
          Your brand here
        </p>
      </div>
    </div>
  );
}