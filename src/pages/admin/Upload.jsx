import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Upload, Music, CheckCircle, ArrowLeft, LogIn } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const GENRE_OPTIONS = [
  { value: "jazz", label: "Jazz" },
  { value: "rnb", label: "Neo Soul & R&B" },
  { value: "worldbeat", label: "World Beat" },
];

export default function AdminUpload() {
  const { user, isLoadingAuth } = useAuth();
  const [form, setForm] = useState({ title: "", artist: "", channel: "jazz" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <LogIn className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Admin Access Required</h2>
          <p className="font-body text-muted-foreground">Please log in to access the upload page.</p>
          <button
            onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-body font-medium hover:opacity-90 transition"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">Access Denied</h2>
          <p className="font-body text-muted-foreground">This page is for admins only.</p>
          <Link to="/" className="inline-block px-6 py-2.5 rounded-full bg-secondary text-foreground font-body font-medium hover:opacity-80 transition">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select an MP3 file."); return; }
    setError("");
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.Track.create({
      title: form.title,
      artist: form.artist,
      channel: form.channel,
      file_url,
    });
    setUploading(false);
    setSuccess(true);
    setForm({ title: "", artist: "", channel: "jazz" });
    setFile(null);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Music className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Upload Track</h1>
              <p className="text-xs font-body text-muted-foreground">Admin · Direct to database</p>
            </div>
          </div>

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-body text-sm mb-6">
              <CheckCircle className="w-4 h-4" /> Track uploaded and saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Track Title</label>
              <input
                required
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Blue in Green"
                className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Artist Name</label>
              <input
                required
                value={form.artist}
                onChange={e => setForm(p => ({ ...p, artist: e.target.value }))}
                placeholder="e.g. Miles Davis"
                className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Genre / Channel</label>
              <select
                value={form.channel}
                onChange={e => setForm(p => ({ ...p, channel: e.target.value }))}
                className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary/40"
              >
                {GENRE_OPTIONS.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">MP3 File</label>
              <label className={`flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed px-4 py-8 cursor-pointer transition ${file ? "border-primary/50 bg-primary/5" : "border-border/50 bg-secondary/30 hover:border-primary/30"}`}>
                <Upload className={`w-6 h-6 ${file ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-sm font-body text-center">
                  {file ? file.name : "Click to select MP3 file"}
                </span>
                {file && <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</span>}
                <input type="file" accept=".mp3,audio/mpeg" className="hidden" onChange={e => setFile(e.target.files[0])} />
              </label>
              {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Upload Track
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}