import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function ChannelChat({ channelId, accentClass = "bg-primary", textAccent = "text-primary" }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Initial load
  useEffect(() => {
    base44.entities.ChannelChat.filter({ channel: channelId }, "-created_date", 50)
      .then((data) => setMessages(data.reverse()));
  }, [channelId]);

  // Real-time subscription
  useEffect(() => {
    const unsub = base44.entities.ChannelChat.subscribe((event) => {
      if (event.data?.channel !== channelId) return;
      if (event.type === "create") {
        setMessages((prev) => [...prev, event.data]);
      }
    });
    return unsub;
  }, [channelId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    await base44.entities.ChannelChat.create({
      channel: channelId,
      message: text,
      author_name: currentUser?.full_name || currentUser?.email?.split("@")[0] || "Listener",
    });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm flex flex-col h-[420px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 flex-shrink-0">
        <MessageCircle className={`w-4 h-4 ${textAccent}`} />
        <span className="text-xs font-body uppercase tracking-widest text-muted-foreground">
          Live Chat
        </span>
        <span className="ml-auto text-xs text-muted-foreground/50">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground/50 font-body text-center mt-8">
            Be the first to say something 🎵
          </p>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-0.5"
            >
              <span className={`text-[11px] font-body font-semibold ${textAccent}`}>
                {msg.author_name}
              </span>
              <p className="text-sm font-body text-foreground/90 leading-snug break-words">
                {msg.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-border/50 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          maxLength={300}
          placeholder="Share your thoughts..."
          className="flex-1 bg-secondary/60 rounded-lg px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40 transition"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className={`w-9 h-9 rounded-lg ${accentClass} flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0`}
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}