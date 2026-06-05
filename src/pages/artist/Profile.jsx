import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Camera, Save, Music2, Instagram, Twitter, Facebook, ExternalLink, MessageSquare, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

const GENRE_LABELS = { jazz: "Jazz", rnb: "Neo Soul & R&B", worldbeat: "World Beat" };
const GENRE_OPTIONS = [
  { value: "jazz", label: "Jazz" },
  { value: "rnb", label: "Neo Soul & R&B" },
  { value: "worldbeat", label: "World Beat" },
];

const STATUS_CONFIG = {
  pending:  { label: "Pending Review", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  approved: { label: "Approved", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  rejected: { label: "Rejected", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

function TrackCard({ submission }) {
  const status = submission.status || "pending";
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-secondary/30 border border-border/30">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Music2 className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-body font-semibold text-foreground truncate">{submission.track_title}</p>
          <p className="text-xs font-body text-muted-foreground">{GENRE_LABELS[submission.genre] || submission.genre} · {submission.submitted_date || "—"}</p>
        </div>
      </div>
      <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-semibold border ${cfg.bg} ${cfg.color}`}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
    </div>
  );
}

function MessageCard({ msg }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!msg.read) {
      base44.entities.ArtistMessage.update(msg.id, { read: true }).catch(() => {});
    }
  }, []);

  return (
    <div className={`rounded-xl border p-4 transition ${msg.read ? "border-border/30 bg-secondary/20" : "border-primary/30 bg-primary/5"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquare className={`w-4 h-4 flex-shrink-0 ${msg.read ? "text-muted-foreground" : "text-primary"}`} />
          <div className="min-w-0">
            <p className="text-xs font-body text-muted-foreground">
              Re: <span className="text-foreground/70">{msg.track_title || "your submission"}</span>
              {!msg.read && <span className="ml-2 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">NEW</span>}
            </p>
          </div>
        </div>
        <button onClick={() => setExpanded(p => !p)} className="text-muted-foreground hover:text-foreground transition flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      {expanded && (
        <p className="mt-3 text-sm font-body text-foreground/80 leading-relaxed border-t border-border/30 pt-3">
          {msg.message}
        </p>
      )}
      {!expanded && (
        <p className="mt-2 text-sm font-body text-muted-foreground truncate">{msg.message}</p>
      )}
    </div>
  );
}

export default function ArtistProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const [form, setForm] = useState({
    artist_name: "",
    bio: "",
    genre: "",
    social_instagram: "",
    social_twitter: "",
    social_facebook: "",
    social_spotify: "",
    photo: "",
  });

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (!authed) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }
      const me = await base44.auth.me();
      setUser(me);

      // Load profile, submissions, messages in parallel
      const [profiles, subs, msgs] = await Promise.all([
        base44.entities.ArtistProfile.filter({ email: me.email }, "-created_date", 1),
        base44.entities.ArtistSubmission.filter({ email: me.email }, "-created_date", 50),
        base44.entities.ArtistMessage.filter({ artist_email: me.email }, "-created_date", 50),
      ]);

      if (profiles.length > 0) {
        const p = profiles[0];
        setProfile(p);
        setForm({
          artist_name: p.artist_name || me.full_name || "",
          bio: p.bio || "",
          genre: p.genre || "",
          social_instagram: p.social_instagram || "",
          social_twitter: p.social_twitter || "",
          social_facebook: p.social_facebook || "",
          social_spotify: p.social_spotify || "",
          photo: p.photo || "",
        });
      } else {
        setForm(f => ({ ...f, artist_name: me.full_name || "" }));
      }

      setSubmissions(subs);
      setMessages(msgs);
      setLoading(false);
    });
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, photo: file_url }));
    setPhotoUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, email: user.email };
    if (profile) {
      await base44.entities.ArtistProfile.update(profile.id, data);
    } else {
      const created = await base44.entities.ArtistProfile.create(data);
      setProfile(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen pt-10 pb-24 px-4 bg-background">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-1">Artist Profile</h1>
          <p className="font-body text-sm text-muted-foreground">Manage your profile and track your submissions</p>
        </motion.div>

        <div className="space-y-6">

          {/* Profile Card */}
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-5">Your Profile</h2>

            {/* Photo */}
            <div className="flex items-center gap-5 mb-6">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-secondary border border-border/60 flex items-center justify-center flex-shrink-0">
                {form.photo
                  ? <img src={form.photo} alt="Profile" className="w-full h-full object-cover" />
                  : <Music2 className="w-8 h-8 text-muted-foreground/40" />
                }
                {photoUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-secondary/50 text-sm font-body text-muted-foreground hover:text-foreground hover:border-primary/40 cursor-pointer transition">
                <Camera className="w-4 h-4" />
                {form.photo ? "Change Photo" : "Upload Photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Artist Name</label>
                  <input
                    value={form.artist_name}
                    onChange={e => setForm(f => ({ ...f, artist_name: e.target.value }))}
                    className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Genre</label>
                  <select
                    value={form.genre}
                    onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
                    className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary/40"
                  >
                    <option value="">Select genre...</option>
                    {GENRE_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={4}
                  placeholder="Tell us about yourself and your music..."
                  className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                />
              </div>

              {/* Social links */}
              <div>
                <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-3">Social Links</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "social_instagram", icon: Instagram, placeholder: "Instagram URL" },
                    { key: "social_twitter", icon: Twitter, placeholder: "Twitter/X URL" },
                    { key: "social_facebook", icon: Facebook, placeholder: "Facebook URL" },
                    { key: "social_spotify", icon: ExternalLink, placeholder: "Spotify Artist URL" },
                  ].map(({ key, icon: Icon, placeholder }) => (
                    <div key={key} className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2.5">
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <input
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none min-w-0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
              >
                {saving ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saved ? "Saved!" : saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>

          {/* Submitted Tracks */}
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-foreground">Your Submissions</h2>
              <Link to="/submit" className="text-xs font-body text-primary hover:opacity-80 transition">+ Submit a track</Link>
            </div>
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <Music2 className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="font-body text-sm text-muted-foreground">No submissions yet.</p>
                <Link to="/submit" className="mt-3 inline-block text-xs text-primary hover:opacity-80 transition">Submit your first track →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.map(s => <TrackCard key={s.id} submission={s} />)}
              </div>
            )}
          </div>

          {/* Messages from Admin */}
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-lg font-semibold text-foreground">Messages from The Spinn</h2>
              {unread > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">{unread} new</span>
              )}
            </div>
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="font-body text-sm text-muted-foreground">No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map(m => <MessageCard key={m.id} msg={m} />)}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}