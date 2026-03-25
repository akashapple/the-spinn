import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

// 48-hour loop anchored to Unix epoch so all users share the same position
const LOOP_DURATION_MS = 48 * 60 * 60 * 1000;

function getLoopState() {
  const now = Date.now();
  const elapsed = now % LOOP_DURATION_MS;
  const progress = elapsed / LOOP_DURATION_MS;

  const remaining = LOOP_DURATION_MS - elapsed;
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

  const elapsedHours = Math.floor(elapsed / (60 * 60 * 1000));
  const elapsedMinutes = Math.floor((elapsed % (60 * 60 * 1000)) / (60 * 1000));

  return { progress, hours, minutes, seconds, elapsedHours, elapsedMinutes };
}

export default function LoopTimer({ accentClass = "bg-primary", textAccent = "text-primary" }) {
  const [loop, setLoop] = useState(getLoopState());

  useEffect(() => {
    const interval = setInterval(() => setLoop(getLoopState()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pct = (loop.progress * 100).toFixed(3);

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${textAccent}`} />
          <span className="text-xs font-body uppercase tracking-widest text-muted-foreground">
            48-Hour Loop
          </span>
        </div>
        <span className={`text-xs font-body font-medium ${textAccent}`}>
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden mb-4">
        <div
          className={`h-full rounded-full ${accentClass} transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Time stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary/60 px-3 py-2.5 text-center">
          <p className="text-xs font-body text-muted-foreground mb-0.5">Elapsed</p>
          <p className={`text-sm font-body font-semibold ${textAccent}`}>
            {String(loop.elapsedHours).padStart(2, "0")}h {String(loop.elapsedMinutes).padStart(2, "0")}m
          </p>
        </div>
        <div className="rounded-lg bg-secondary/60 px-3 py-2.5 text-center">
          <p className="text-xs font-body text-muted-foreground mb-0.5">Resets In</p>
          <p className="text-sm font-body font-semibold text-foreground">
            {String(loop.hours).padStart(2, "0")}:{String(loop.minutes).padStart(2, "0")}:{String(loop.seconds).padStart(2, "0")}
          </p>
        </div>
      </div>
    </div>
  );
}