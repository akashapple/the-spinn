import { useState, useEffect } from "react";
import { Ticket, Plus, Trash2, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function ConcertLinks({ channelId, textAccent, accentClass }) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const [concerts, setConcerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ artist: "", venue: "", city: "", date: "", ticket_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.ConcertLink.filter({ channel: channelId }, "date", 20)
      .then(setConcerts);
  }, [channelId]);

  const handleSave = async () => {
    setSaving(true);
    const saved = await base44.entities.ConcertLink.create({ ...form, channel: channelId });
    setConcerts(prev => [...prev, saved].sort((a,b) => a.date > b.date ? 1 : -1));
    setForm({ artist: "", venue: "", city: "", date: "", ticket_url: "" });
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.ConcertLink.delete(id);
    setConcerts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Ticket className={`w-4 h-4 ${textAccent}`} />
          <h3 className="font-display text-base font-semibold text-foreground">Concerts & Events</h3>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className={`p-1.5 rounded-lg ${accentClass}/10 ${textAccent} hover:opacity-80 transition`}>
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {showForm && (
        <div className="p-4 border-b border-border/50 space-y-2.5">
          {[["artist","Artist"],["venue","Venue"],["city","City"],["date","Date (e.g. Apr 12, 2026)"],["ticket_url","Ticket URL"]].map(([key, placeholder]) => (
            <input key={key} placeholder={placeholder} value={form[key]} onChange={e => setForm(p => ({...p, [key]: e.target.value}))}
              className="w-full bg-secondary/60 rounded-lg px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40" />
          ))}
          <button onClick={handleSave} disabled={saving || !form.artist || !form.ticket_url}
            className={`w-full py-2 rounded-lg ${accentClass} text-white text-sm font-body font-medium disabled:opacity-40 transition`}>
            {saving ? "Saving..." : "Add Event"}
          </button>
        </div>
      )}

      {concerts.length === 0 && !showForm && (
        <p className="text-xs text-muted-foreground/50 font-body text-center py-6">No upcoming concerts listed.</p>
      )}

      <div className="divide-y divide-border/30">
        {concerts.map(c => (
          <div key={c.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className={`text-sm font-body font-medium ${textAccent} truncate`}>{c.artist}</p>
              <p className="text-xs font-body text-muted-foreground truncate">{c.venue}{c.city ? `, ${c.city}` : ""}</p>
              <p className="text-xs font-body text-muted-foreground/70">{c.date}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href={c.ticket_url} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body font-medium ${accentClass}/10 ${textAccent} hover:opacity-80 transition`}>
                Tickets <ExternalLink className="w-3 h-3" />
              </a>
              {isAdmin && (
                <button onClick={() => handleDelete(c.id)} className="text-muted-foreground hover:text-destructive transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}