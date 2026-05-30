import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function AdminCreateAccount() {
  const { user, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoadingAuth && (!user || user.role !== "admin")) {
      navigate("/", { replace: true });
    }
  }, [isLoadingAuth, user, navigate]);

  if (isLoadingAuth || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.users.inviteUser(email.trim(), "admin");
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send invite. The user may already exist.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <Link
          to="/admin/upload"
          className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Upload
        </Link>

        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Create Admin Account</h1>
              <p className="text-xs font-body text-muted-foreground">Admin only · Invite by email</p>
            </div>
          </div>

          {success && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-body text-sm mb-6">
              <CheckCircle className="w-4 h-4" />
              Invite sent! They'll receive a login link by email.
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-body text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-body text-muted-foreground uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="newadmin@example.com"
                className="w-full bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <p className="text-xs font-body text-muted-foreground leading-relaxed">
              This will send a magic login link to the email address and grant them <strong className="text-foreground">admin</strong> access, including the ability to upload tracks.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Sending Invite...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Send Admin Invite
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}