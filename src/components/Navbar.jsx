import { Link, useLocation } from "react-router-dom";
import { Radio, Headphones } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Radio className="w-4 h-4 text-primary" />
            </div>
            <span className="bg-[hsl(var(--sidebar-border))] text-[hsl(var(--primary))] text-lg font-black text-left underline tracking-tight">THE SPINN
Digital Streams
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/channel/jazz"
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
              location.pathname === "/channel/jazz" ?
              "bg-primary text-primary-foreground" :
              "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
              }>
              
              Jazz
            </Link>
            <Link
              to="/channel/rnb"
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
              location.pathname === "/channel/rnb" ?
              "bg-accent text-accent-foreground" :
              "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
              }>
              
              Neo Soul & R&B
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs font-body text-muted-foreground hidden sm:inline">LIVE</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>
    </nav>);

}