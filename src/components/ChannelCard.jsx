import { Link } from "react-router-dom";
import { Play, Radio } from "lucide-react";
import { motion } from "framer-motion";
import Equalizer from "./Equalizer";

export default function ChannelCard({ name, genre, image, path, accentColor, listeners, isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link to={path} className="block group">
        <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-primary/30 transition-all duration-500">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`w-16 h-16 rounded-full ${accentColor} flex items-center justify-center shadow-2xl`}>
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </div>
            </div>

            {/* Live badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-body font-medium text-white uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-2xl font-semibold text-foreground">{name}</h3>
              {isActive && <Equalizer isPlaying={true} color={accentColor.replace("bg-", "bg-")} />}
            </div>
            <p className="text-sm font-body text-muted-foreground mb-4">{genre}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-body text-muted-foreground">{listeners} listening</span>
              </div>
              <span className={`text-xs font-body font-medium px-3 py-1 rounded-full ${accentColor}/10 ${accentColor.replace("bg-", "text-").replace("primary", "primary").replace("accent", "accent")}`}>
                Tune In →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}