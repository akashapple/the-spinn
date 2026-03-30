import { useState } from "react";
import { X, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AddTrackModal({ channelId, accentClass, textAccent, onAdded, onClose }) {
  const [form, setForm] = useState({ title: "", artist: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !form.title || !form.artist) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const track = await base44.entities.Track.create({
      title: form.title,
      artist: form.artist,
      channel: channelId,
      file_url,
    });
    onAdded(track);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">Add Track to Playlist</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <input placeholder="Track Title" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
          className="w-full bg-secondary/60 rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40" />
        <input placeholder="Artist Name" value={form.artist} onChange={e => setForm(p => ({...p, artist: e.target.value}))}
          className="w-full bg-secondary/60 rounded-lg px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40" />

        <label className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 cursor-pointer transition">
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-xs font-body text-muted-foreground">
            {file ? file.name : "Click to upload audio file (MP3, WAV, etc.)"}
          </span>
          <input type="file" accept="audio/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
        </label>

        <button onClick={handleSubmit} disabled={uploading || !file || !form.title || !form.artist}
          className={`w-full py-2.5 rounded-xl ${accentClass} text-white font-body font-medium text-sm disabled:opacity-40 transition`}>
          {uploading ? "Uploading..." : "Add to Playlist"}
        </button>
      </div>
    </div>
  );
}