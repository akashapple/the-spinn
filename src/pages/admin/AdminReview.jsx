import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Play, Pause, Music, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const GENRE_LABELS = { jazz: "Jazz", rnb: "Neo Soul & R&B", worldbeat: "World Beat" };

const STATUS_STYLES = {
  pending:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  approved: "bg-green-500/10 text-green-400 border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const TABS = ["all", "pending", "approved", "rejected"];

function AudioPreview({ fileUrl }) {
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
    <div className="mt-3">
      <audio ref={audioRef} src={fileUrl} preload="none" className="hidden" />
      <button
        onClick={toggle}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-body hover:bg-primary/20 transition w-full justify-center sm:w-auto"
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        {playing ? "Pause Preview" : "Play Preview"}
      </button>
    </div>
  );
}

function SubmissionCard({ s, onUpdateStatus }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex flex-col gap-4">
        {/* Top row: name + badge */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-lg font-semibold text-foreground">{s.artist_name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body border capitalize ${STATUS_STYLES[s.status] || STATUS_STYLES.pending}`}>
                {s.status || "pending"}
              </span>
            </div>
            <p className="text-sm font-body text-primary font-medium mt-0.5">{s.track_title}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs font-body text-muted-foreground">
          <div><span className="text-foreground/40 uppercase tracking-wider text-[10px]">Genre</span><br />{GENRE_LABELS[s.genre] || s.genre}</div>
          <div><span className="text-foreground/40 uppercase tracking-wider text-[10px]">Email</span><br />{s.email}</div>
          <div><span className="text-foreground/40 uppercase tracking-wider text-[10px]">Submitted</span><br />{s.submitted_date || "—"}</div>
        </div>

        {/* Audio preview */}
        {s.file_url && <AudioPreview fileUrl={s.file_url} />}

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onUpdateStatus(s.id, "approved")}
            disabled={s.status === "approved"}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-body font-semibold hover:bg-green-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Approve
          </button>
          <button
            onClick={() => onUpdateStatus(s.id, "rejected")}
            disabled={s.status === "rejected"}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body font-semibold hover:bg-red-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
        </div>
      </div>
    </div>
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

  const filtered = activeTab === "all"
    ? submissions
    : submissions.filter(s => (s.status || "pending") === activeTab);

  const countFor = (tab) => tab === "all"
    ? submissions.length
    : submissions.filter(s => (s.status || "pending") === tab).length;

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
    <div className="min-h-screen pt-10 pb-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link to="/admin/upload" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition mb-8">
          <ArrowLeft className="w-4 h-4" /> Admin Upload
        </Link>

        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Music className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Artist Submissions</h1>
            <p className="text-xs font-body text-muted-foreground">{submissions.length} total submission{submissions.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 bg-card/40 border border-border/50 rounded-xl p-1 w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-body font-semibold capitalize transition flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                {countFor(tab)}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
            <Music className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-body text-muted-foreground text-sm">
              {activeTab === "all" ? "No submissions yet." : `No ${activeTab} submissions.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(s => (
              <SubmissionCard key={s.id} s={s} onUpdateStatus={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}