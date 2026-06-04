import { useState, useEffect, useRef } from "react";
import { Star, Play, Pause } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

function TrackCard({ track, textAccent }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => setPlaying(false);
    audio.addEventListener("ended", onEnd);
    return () => audio.removeEventListener("ended", onEnd);
  }, []);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/30 transition group">
      <audio ref={audioRef} src={track.file_url} preload="none" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body font-semibold text-foreground truncate">{track.artist_name}</p>
        <p className={`text-xs font-body truncate ${textAccent}`}>{track.track_title}</p>
      </div>
      <button
        onClick={toggle}
        className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/25 transition"
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>
    </div>
  );
}

export default function FeaturedArtistHour({ channelId, textAccent }) {
  const [tracks, setTracks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    base44.entities.ArtistSubmission.filter({ status: "approved", genre: channelId }, "-created_date", 50)
      .then(setTracks)
      .finally(() => setLoaded(true));
  }, [channelId]);

  if (!loaded || tracks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-primary fill-primary" />
        <h3 className="font-display text-lg font-semibold text-primary">Featured Artist Hour</h3>
        <span className="ml-auto text-xs font-body text-muted-foreground">{tracks.length} track{tracks.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="space-y-2">
        {tracks.map(track => (
          <TrackCard key={track.id} track={track} textAccent={textAccent} />
        ))}
      </div>
    </motion.div>
  );
}