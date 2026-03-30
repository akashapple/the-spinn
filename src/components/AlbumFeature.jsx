import { useState, useEffect } from "react";
import { Star, Plus, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function AlbumFeature({ channelId, textAccent, accentClass }) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const [albums, setAlbums] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", artist: "", year: "", review: "", rating: 5, image_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.FeaturedAlbum.filter({ channel: channelId }, "-created_date", 5)
      .then(setAlbums);
  }, [channelId]);

  const handleSave = async () => {
    setSaving(true);
    const saved = await base44.entities.FeaturedAlbum.create({ ...form, channel: channelId, rating: Number(form.rating) });
    setAlbums(prev => [saved, ...prev]);
    setForm({ title: "", artist: "", year: "", review: "", rating: 5, image_url: "" });
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.FeaturedAlbum.delete(id);
    setAlbums(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <h3 className="font-display text-base font-semibold text-foreground">Featured Albums</h3>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className={`p-1.5 rounded-lg ${accentClass}/10 ${textAccent} hover:opacity-80 transition`}>
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {showForm && (
        <div className="p-4 border-b border-border/50 space-y-2.5">
          {[["title","Album Title"],["artist","Artist"],["year","Year"],["image_url","Cover Image URL"]].map(([key, placeholder]) => (
            <input key={key} placeholder={placeholder} value={form[key]} onChange={e => setForm(p => ({...p, [key]: e.target.value}))}
              className="w-full bg-secondary/60 rounded-lg px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40" />
          ))}
          <textarea placeholder="Your review..." rows={3} value={form.review} onChange={e => setForm(p => ({...p, review: e.target.value}))}
            className="w-full bg-secondary/60 rounded-lg px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40 resize-none" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground font-body">Rating:</label>
            <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(p => ({...p, rating: e.target.value}))}
              className="w-14 bg-secondary/60 rounded-lg px-2 py-1 text-sm font-body text-foreground outline-none focus:ring-1 focus:ring-primary/40" />
            <span className="text-xs text-muted-foreground">/5</span>
          </div>
          <button onClick={handleSave} disabled={saving || !form.title || !form.review}
            className={`w-full py-2 rounded-lg ${accentClass} text-white text-sm font-body font-medium disabled:opacity-40 transition`}>
            {saving ? "Saving..." : "Publish Review"}
          </button>
        </div>
      )}

      {albums.length === 0 && !showForm && (
        <p className="text-xs text-muted-foreground/50 font-body text-center py-6">No featured albums yet.</p>
      )}

      <div className="divide-y divide-border/30">
        {albums.map(album => (
          <div key={album.id} className="p-4 space-y-2">
            <div className="flex items-start gap-3">
              {album.image_url && (
                <img src={album.image_url} alt={album.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className={`font-body font-semibold text-sm ${textAccent} truncate`}>{album.title}</p>
                <p className="text-xs font-body text-muted-foreground">{album.artist}{album.year ? ` · ${album.year}` : ""}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {Array.from({length: 5}).map((_,i) => (
                    <Star key={i} className={`w-3 h-3 ${i < (album.rating||0) ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                  ))}
                </div>
              </div>
              {isAdmin && (
                <button onClick={() => handleDelete(album.id)} className="text-muted-foreground hover:text-destructive transition flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-xs font-body text-muted-foreground leading-relaxed line-clamp-4">{album.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}