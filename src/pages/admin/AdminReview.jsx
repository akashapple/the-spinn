import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Play, Pause, Mic, ArrowLeft, Music2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";

const GENRE_LABELS = { jazz: "Jazz", rnb: "Neo Soul & R&B", worldbeat: "World Beat" };
const TABS = ["all", "pending", "approved", "rejected"];

const STATUS_STYLES = {
  pending:  { pill: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30", dot: "bg-yellow-400" },
  approved: { pill: "bg-green-500/15 text-green-300 border border-green-500/30", dot: "bg-green-400" },
  rejected: { pill: "bg-red-500/15 text-red-300 border border-red-500/30", dot: "bg-red-400" },
};

function StatCard({ label, value, color }) {
  return (
    <div className="flex-1 min-w-[80px] rounded-2xl bg-card border border-border/60 px-4 py-4 text-center">
      <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs font-body text-muted-foreground mt-1 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function WaveformPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-[3px]">
      {Array.from({ length: 18 }).map((_, i) => {
        const h = Math.sin(i * 0.7) * 40 + 50;
        return (
          <div
            key={i}
            className="w-[3px] rounded-full bg-primary/30"
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>
  );
}

function AudioPlayer({ fileUrl }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => { setPlaying(false); setProgress(0); };
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onMeta = () => setDuration(audio.duration || 0);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    return () => {
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  const fmt = (s) => {
    if (!s || isNaN(s)) return "--:--";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/30 border border-primary/10">
      <audio ref={audioRef} src={fileUrl} preload="metadata" className="hidden" />
      <button
        onClick={toggle}
        className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition shadow-lg shadow-primary/20"
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Waveform bars */}
      <div className="flex-1 flex items-center gap-[2px] h-8 relative">
        {Array.from({ length: 40 }).map((_, i) => {
          const h = Math.sin(i * 0.5) * 40 + 55;
          const filled = i / 40 <= progress;
          return (
            <motion.div
              key={i}
              className={`flex-1 rounded-full transition-colors duration-150 ${filled ? "bg-primary" : "bg-primary/20"}`}
              style={{ height: `${h}%` }}
              animate={playing ? { scaleY: [1, 1.4 + Math.sin(i) * 0.4, 1] } : { scaleY: 1 }}
              transition={playing ? { duration: 0.8 + Math.random() * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.02 } : {}}
            />
          );
        })}
      </div>

      {duration > 0 && (
        <span className="text-xs font-body text-muted-foreground flex-shrink-0">{fmt(duration)}</span>
      )}
    </div>
  );
}

function SubmissionCard({ s, onUpdateStatus, index }) {
  const status = s.status || "pending";
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-2xl border border-primary/15 bg-card overflow-hidden"
      style={{ boxShadow: "0 0 0 1px hsla(40,80%,55%,0.08), 0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Left: album art placeholder */}
        <div className="sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-secondary/60 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0">
            <WaveformPlaceholder />
          </div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Music2 className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Right: content */}
        <div className="flex-1 p-5 flex flex-col gap-4">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-bold text-white leading-tight truncate">{s.artist_name}</h3>
              <p className="text-sm font-body text-primary font-semibold mt-0.5 truncate">{s.track_title}</p>
            </div>
            <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-semibold capitalize ${statusStyle.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {status}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-body text-muted-foreground">
            <span><span className="text-foreground/30 uppercase tracking-wider text-[10px] mr-1">Genre</span>{GENRE_LABELS[s.genre] || s.genre}</span>
            <span><span className="text-foreground/30 uppercase tracking-wider text-[10px] mr-1">Email</span>{s.email}</span>
            {s.submitted_date && <span><span className="text-foreground/30 uppercase tracking-wider text-[10px] mr-1">Date</span>{s.submitted_date}</span>}
          </div>

          {/* Audio player */}
          {s.file_url && <AudioPlayer fileUrl={s.file_url} />}

          {/* Action buttons */}
          <div className="flex gap-2 mt-auto pt-1">
            <button
              onClick={() => onUpdateStatus(s.id, "approved")}
              disabled={status === "approved"}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-body font-bold hover:opacity-90 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-primary/20"
            >
              <CheckCircle className="w-4 h-4" /> Approve
            </button>
            <button
              onClick={() => onUpdateStatus(s.id, "rejected")}
              disabled={status === "rejected"}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-900/60 border border-red-700/40 text-red-300 text-xs font-body font-bold hover:bg-red-900/80 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminReview() {
  const { user, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!isLoadingAuth && (!user || user.role !== "admin")) {
      navigate("/", { replace: true });
    }
  }, [isLoadingAuth, user, navigate]);

  useEffect(() => {
    if (user?.role === "admin") {
      base44.entities.ArtistSubmission.list("-created_date", 200)
        .then(setSubmissions)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    await base44.entities.ArtistSubmission.update(id, { status });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const countFor = (tab) => tab === "all"
    ? submissions.length
    : submissions.filter(s => (s.status || "pending") === tab).length;

  const filtered = activeTab === "all"
    ? submissions
    : submissions.filter(s => (s.status || "pending") === activeTab);

  if (isLoadingAuth || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-display text-xl text-foreground mb-2">Access Denied</p>
          <p className="font-body text-sm text-muted-foreground mb-6">This page is for admins only.</p>
          <Link to="/" className="text-primary text-sm font-body hover:opacity-80 transition">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-24 px-4 bg-background">
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link to="/admin/upload" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition mb-8">
          <ArrowLeft className="w-4 h-4" /> Admin Upload
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Mic className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">Artist Submissions</h1>
              <p className="text-sm font-body text-muted-foreground mt-0.5">Review and manage submitted tracks</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex gap-3">
            <StatCard label="Total" value={countFor("all")} color="text-primary" />
            <StatCard label="Pending" value={countFor("pending")} color="text-yellow-400" />
            <StatCard label="Approved" value={countFor("approved")} color="text-green-400" />
            <StatCard label="Rejected" value={countFor("rejected")} color="text-red-400" />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-7 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-body font-bold capitalize transition flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {tab}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab ? "bg-black/20" : "bg-secondary"}`}>
                {countFor(tab)}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-body text-muted-foreground">Loading submissions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card/50 p-16 text-center">
            <Music2 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-display text-lg text-foreground/50 mb-1">No submissions here</p>
            <p className="font-body text-sm text-muted-foreground">
              {activeTab === "all" ? "No tracks have been submitted yet." : `No ${activeTab} submissions.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((s, i) => (
              <SubmissionCard key={s.id} s={s} onUpdateStatus={updateStatus} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}