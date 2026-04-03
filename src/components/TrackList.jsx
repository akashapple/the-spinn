import { Clock, Music } from "lucide-react";

const JAZZ_TRACKS = [
  { title: "Blue in Green", artist: "Miles Davis", duration: "5:27", isNowPlaying: true },
  { title: "Take Five", artist: "Dave Brubeck", duration: "5:24" },
  { title: "So What", artist: "Miles Davis", duration: "9:22" },
  { title: "My Favorite Things", artist: "John Coltrane", duration: "13:41" },
  { title: "Round Midnight", artist: "Thelonious Monk", duration: "6:15" },
  { title: "Autumn Leaves", artist: "Bill Evans", duration: "4:52" },
  { title: "Feeling Good", artist: "Nina Simone", duration: "2:55" },
  { title: "Moanin'", artist: "Art Blakey", duration: "9:32" },
];

const RNB_TRACKS = [
  { title: "Golden Hour", artist: "SoulWave Radio", duration: "4:12", isNowPlaying: true },
  { title: "Midnight Velvet", artist: "Luna Waves", duration: "3:58" },
  { title: "Purple Skies", artist: "The Groove Collective", duration: "5:07" },
  { title: "Silk & Honey", artist: "Amber Rose", duration: "4:33" },
  { title: "City Lights", artist: "Neon Soul", duration: "3:41" },
  { title: "Slow Burn", artist: "Velvet Touch", duration: "4:55" },
  { title: "After Hours", artist: "Midnight Jazz Café", duration: "6:20" },
  { title: "Ocean Drive", artist: "Smooth Collective", duration: "4:08" },
];

const WORLDBEAT_TRACKS = [
  { title: "African Sun", artist: "World Beat Radio", duration: "4:45", isNowPlaying: true },
  { title: "Lagos Nights", artist: "Femi Groove", duration: "5:02" },
  { title: "Cumbia del Mar", artist: "Los Ritmos", duration: "3:58" },
  { title: "Kora Dream", artist: "Toumani Collective", duration: "6:14" },
  { title: "Carnival Pulse", artist: "Steel Pan Express", duration: "4:30" },
  { title: "Samba Soul", artist: "Rio Groove", duration: "3:47" },
  { title: "Djembe Fire", artist: "West Africa All Stars", duration: "5:55" },
  { title: "Reggae Sunrise", artist: "Island Vibrations", duration: "4:22" },
];

export default function TrackList({ channel, customTracks = [], currentIndex = -1, onSelect }) {
  const staticTracks = channel === "jazz" ? JAZZ_TRACKS : channel === "rnb" ? RNB_TRACKS : WORLDBEAT_TRACKS;
  const hasCustom = customTracks.length > 0;
  const tracks = hasCustom ? customTracks : staticTracks;
  const accentClass = channel === "jazz" ? "text-primary" : "text-accent";

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {hasCustom ? "Playlist" : "Up Next"}
        </h3>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="divide-y divide-border/30">
        {tracks.map((track, i) => {
          const isActive = hasCustom ? i === currentIndex : track.isNowPlaying;
          return (
            <div
              key={i}
              onClick={() => hasCustom && onSelect && onSelect(i)}
              className={`px-5 py-3.5 flex items-center justify-between hover:bg-secondary/50 transition-colors cursor-pointer ${isActive ? "bg-secondary/70" : ""}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-xs font-body w-5 text-center ${isActive ? accentClass : "text-muted-foreground"}`}>
                  {isActive ? <Music className="w-3.5 h-3.5 inline" /> : i + 1}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-body font-medium truncate ${isActive ? accentClass : "text-foreground"}`}>
                    {track.title}
                  </p>
                  <p className="text-xs font-body text-muted-foreground truncate">{track.artist}</p>
                </div>
              </div>
              <span className="text-xs font-body text-muted-foreground ml-3 flex-shrink-0">{track.duration || ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}