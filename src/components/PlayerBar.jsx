import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import Equalizer from "./Equalizer";

export default function PlayerBar({ channel, trackTitle, artist, isPlaying, onTogglePlay }) {
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);

  const isJazz = channel === "jazz";
  const accentClass = isJazz ? "bg-primary" : "bg-accent";
  const textAccent = isJazz ? "text-primary" : "text-accent";

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Track info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className={`w-12 h-12 rounded-lg ${accentClass}/10 flex items-center justify-center flex-shrink-0`}>
              {isPlaying ? (
                <Equalizer isPlaying={true} color={accentClass} />
              ) : (
                <div className={`w-2 h-2 rounded-full ${accentClass}`} />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-body font-medium text-foreground text-sm truncate">{trackTitle}</p>
              <p className="font-body text-xs text-muted-foreground truncate">{artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePlay}
              className={`w-12 h-12 rounded-full ${accentClass} flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg`}
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Pause className="w-5 h-5 text-white" fill="white" />
                  </motion.div>
                ) : (
                  <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-3 flex-1 justify-end">
            <button onClick={() => setIsMuted(!isMuted)} className="text-muted-foreground hover:text-foreground transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <Slider
              value={isMuted ? [0] : volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-24"
            />
            <span className={`text-xs font-body font-medium ${textAccent} uppercase tracking-wider`}>
              {isJazz ? "Jazz" : "Neo Soul & R&B"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}