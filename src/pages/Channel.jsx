import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Users } from "lucide-react";
import { motion } from "framer-motion";
import PlayerBar from "../components/PlayerBar";
import TrackList from "../components/TrackList";
import AdBanner from "../components/AdBanner";
import Equalizer from "../components/Equalizer";

const JAZZ_IMG = "https://media.base44.com/images/public/69c4550d94d5716560c9bc7d/99deadc72_generated_a6fc5c33.png";
const RNB_IMG = "https://media.base44.com/images/public/69c4550d94d5716560c9bc7d/b3abba13b_generated_fcb1e711.png";

const CHANNEL_DATA = {
  jazz: {
    name: "Jazz Channel",
    tagline: "Where every note tells a story",
    description: "Immerse yourself in the timeless world of Jazz. From smoky bebop sessions to cool, laid-back melodies — our Jazz channel is curated for those who appreciate the art of improvisation.",
    image: JAZZ_IMG,
    nowPlaying: "Blue in Green",
    artist: "Miles Davis",
    listeners: "2,431",
    accent: "bg-primary",
    textAccent: "text-primary",
  },
  rnb: {
    name: "R&B Channel",
    tagline: "Smooth grooves for the soul",
    description: "Feel the rhythm of R&B — from silky Neo-Soul to contemporary hits that move you. Our R&B channel delivers a seamless blend of vocals, rhythm, and emotion around the clock.",
    image: RNB_IMG,
    nowPlaying: "Golden Hour",
    artist: "SoulWave Radio",
    listeners: "3,128",
    accent: "bg-accent",
    textAccent: "text-accent",
  },
};

export default function Channel() {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  const channel = CHANNEL_DATA[id] || CHANNEL_DATA.jazz;

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <img src={channel.image} alt={channel.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white transition-colors text-sm font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>

        <div className="absolute bottom-8 left-4 sm:left-8 right-4 sm:right-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-body text-white/70 uppercase tracking-widest">Live Now</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold text-white mb-2">
              {channel.name}
            </h1>
            <p className="font-body text-white/60 text-lg italic">{channel.tagline}</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Ad Banner */}
        <AdBanner variant="horizontal" className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Now Playing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${channel.accent}/10 flex items-center justify-center`}>
                    <Equalizer isPlaying={isPlaying} color={channel.accent} />
                  </div>
                  <div>
                    <p className="text-xs font-body text-muted-foreground uppercase tracking-widest">Now Playing</p>
                    <h2 className={`font-display text-xl font-semibold ${channel.textAccent}`}>{channel.nowPlaying}</h2>
                    <p className="text-sm font-body text-muted-foreground">{channel.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`p-2 rounded-full hover:bg-secondary transition-colors ${liked ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    <Heart className="w-5 h-5" fill={liked ? "currentColor" : "none"} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Waveform visualization */}
              <div className="h-16 flex items-center justify-center gap-[2px] overflow-hidden rounded-lg bg-secondary/50 px-4">
                {Array.from({ length: 60 }).map((_, i) => {
                  const height = Math.sin(i * 0.3) * 30 + 35;
                  return (
                    <motion.div
                      key={i}
                      className={`w-[2px] rounded-full ${channel.accent}`}
                      style={{ opacity: isPlaying ? 0.6 : 0.2 }}
                      animate={
                        isPlaying
                          ? { height: [height * 0.3, height, height * 0.5, height * 0.8, height * 0.3] }
                          : { height: height * 0.3 }
                      }
                      transition={
                        isPlaying
                          ? { duration: 1.5 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: i * 0.02 }
                          : { duration: 0.5 }
                      }
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-body text-muted-foreground">{channel.listeners} listeners</span>
                </div>
                <span className="text-xs font-body text-muted-foreground">320kbps · Lossless</span>
              </div>
            </motion.div>

            {/* Track List */}
            <TrackList channel={id} />

            {/* Description */}
            <div className="rounded-xl border border-border/50 bg-card/30 p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">About This Channel</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {channel.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AdBanner variant="sidebar" />
            <AdBanner variant="sidebar" />
          </div>
        </div>

        {/* Bottom Ad */}
        <AdBanner variant="horizontal" className="mt-8" />
      </div>

      {/* Player Bar */}
      <PlayerBar
        channel={id}
        trackTitle={channel.nowPlaying}
        artist={channel.artist}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />
    </div>
  );
}