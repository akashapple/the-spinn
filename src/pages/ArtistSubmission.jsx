import { useState } from "react";
import { Music, Upload, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const GENRE_OPTIONS = [
  { value: "jazz", label: "Jazz" },
  { value: "rnb", label: "Neo Soul & R&B" },
  { value: "worldbeat", label: "World Beat" },
];

export default function ArtistSubmission() {
  const [form, setForm] = useState({
    artist_name: "",
    email: "",
    genre: "",
    track_title: "",
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select an audio file."); return; }
    setError("");
    setSubmitting(true);

    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities.ArtistSubmission.create({
      ...form,
      file_url,
      submitted_date: new Date().toISOString().split("T")[0],
      status: "pending",
    });

    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">You're in the queue!</h2>
          <p className="font-body text-muted-foreground leading-relaxed">
            Thank you! Your track has been submitted for review.
          </p>
          <button
            onClick={() => { setSuccess(false); setForm({ artist_name: "", email: "", genre: "", track_title: "" }); setFile(null); }}
            className="mt-8 px-6 py-2.5 rounded-xl border border-border/50 text-sm font-body text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
          >
            Submit another track
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-20 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
            <Music className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Submit Your Track to The Spinn
          </h1>
          <p className="font-body text-muted-foreground">Share your music with our community</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Artist Name</label>
              <input
                required
                value={form.artist_name}
                onChange={e => setForm(p => ({ ...p, artist_name: e.target.value }))}
                placeholder="e.g. Miles Davis"
                className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Genre</label>
              <select
                required
                value={form.genre}
                onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}
                className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary/40"
              >
                <option value="" disabled>Select a genre...</option>
                {GENRE_OPTIONS.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Track Title</label>
              <input
                required
                value={form.track_title}
                onChange={e => setForm(p => ({ ...p, track_title: e.target.value }))}
                placeholder="e.g. Blue in Green"
                className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">Audio File</label>
              <label className={`flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed px-4 py-8 cursor-pointer transition ${file ? "border-primary/50 bg-primary/5" : "border-border/50 bg-secondary/30 hover:border-primary/30"}`}>
                <Upload className={`w-6 h-6 ${file ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-sm font-body text-center">
                  {file ? file.name : "Click to select audio file"}
                </span>
                {file && <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</span>}
                <input type="file" accept="audio/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
              </label>
              {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Music className="w-4 h-4" /> Submit Track
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}