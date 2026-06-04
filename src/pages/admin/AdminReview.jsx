import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Play, Pause, Music, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const GENRE_LABELS = { jazz: "Jazz", rnb: "Neo Soul & R&B", worldbeat: "World Beat" };

const STATUS_BADGE = {
  pending:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  approved: "bg-green-500/10 text-green-400 border-green-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

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
    <div className="flex items-center gap-2">
      <audio ref={audioRef} src={fileUrl} preload="none" />
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-body hover:bg-primary/20 transition"
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        {playing ? "Pause" : "Preview"}
      </button>
    </div>
  );
}

export default function AdminReview() {
  const { user, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoadingAuth && (!user || user.role !== "admin")) {
      navigate("/", { replace: true });
    }
  }, [isLoadingAuth, user, navigate]);

  useEffect(() => {
    if (user?.role === "admin") {
      base44.entities.ArtistSubmission.list("-submitted_date", 200)
        .then(setSubmissions)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    await base44.entities.ArtistSubmission.update(id, { status });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  if (isLoadingAuth || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 pb-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/admin/upload" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" /> Admin Upload
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Music className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Artist Submissions</h1>
            <p className="text-xs font-body text-muted-foreground">{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
            <Music className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-body text-muted-foreground text-sm">No submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map(s => (
              <div key={s.id} className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg font-semibold text-foreground">{s.artist_name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body border ${STATUS_BADGE[s.status] || STATUS_BADGE.pending}`}>
                        {s.status || "pending"}
                      </span>
                    </div>
                    <p className="text-sm font-body text-primary font-medium">{s.track_title}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-body text-muted-foreground">
                      <span>{GENRE_LABELS[s.genre] || s.genre}</span>
                      <span>{s.email}</span>
                      {s.submitted_date && <span>{s.submitted_date}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    {s.file_url && <AudioPreview fileUrl={s.file_url} />}
                    <button
                      onClick={() => updateStatus(s.id, "approved")}
                      disabled={s.status === "approved"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-body hover:bg-green-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => updateStatus(s.id, "rejected")}
                      disabled={s.status === "rejected"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body hover:bg-red-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}