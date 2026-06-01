import { useEffect, useState } from "react";
import { Music, Upload, CheckCircle, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

const GENRE_OPTIONS = [
  { value: "jazz", label: "Jazz" },
  { value: "rnb", label: "Neo Soul & R&B" },
  { value: "worldbeat", label: "World Beat" },
];

function LandingScreen() {
  const handleSignIn = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <Music className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">THE SPINN</h1>
        <p className="font-body text-muted-foreground mb-8">Team Upload Portal</p>

        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">Welcome, Team Member</h2>
          <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
            Sign in to your account or create a new one to start uploading tracks to our channels.
          </p>
          <button
            onClick={handleSignIn}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Music className="w-4 h-4" />
            Sign In / Create Account
          </button>
        </div>

        <p className="text-xs font-body text-muted-foreground/50">
          This portal is for authorized team members only.
        </p>
      </div>
    </div>
  );
}

function UploadInterface({ user }) {
  const [form, setForm] = useState({ title: "", artist: "", channel: "jazz" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select an MP3 file."); return; }

    // DEBUG: log the full user object so we can see what role the JWT carries
    try {
      const me = await base44.auth.me();
      console.log('[DEBUG] User from base44.auth.me():', JSON.stringify(me, null, 2));
    } catch (debugErr) {
      console.log('[DEBUG] Could not fetch me():', debugErr.message);
    }
    console.log('[DEBUG] user prop passed to UploadInterface:', JSON.stringify(user, null, 2));

    setError("");
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.Track.create({
        title: form.title,
        artist: form.artist,
        channel: form.channel,
        file_url,
      });
      setSuccess(true);
      setForm({ title: "", artist: "", channel: "jazz" });
      setFile(null);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout(window.location.href);
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Music className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="font-display font-bold text-foreground">THE SPINN</span>
              <p className="text-xs font-body text-muted-foreground">Team Upload Portal</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Upload Track</h1>
              <p className="text-xs font-body text-muted-foreground">Hi, {user.full_name || user.email}</p>
            </div>
          </div>

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-body text-sm mb-6">
              <CheckCircle className="w-4 h-4" /> Track uploaded successfully!
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

export default function TeamUpload() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed) {
          const me = await base44.auth.me();
          // If still on default "user" role, assign uploader and force a fresh login
          // so the new role is baked into the JWT token before any uploads are attempted
          if (me.role === 'user') {
            try {
              await Promise.race([
                base44.functions.invoke('assignUploaderRole', {}),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
              ]);
            } catch (_) {}
            // Force re-login so the JWT is reissued with role: "uploader"
            base44.auth.logout(window.location.href);
            return;
          }
          setUser(me);
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LandingScreen />;
  return <UploadInterface user={user} />;
}