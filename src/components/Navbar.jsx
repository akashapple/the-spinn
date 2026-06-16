import { Link, useLocation } from "react-router-dom";
import { Radio, Headphones } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-32">
          <Link to="/" className="flex items-center group">
            <img
              src="https://media.base44.com/images/public/69c4550d94d5716560c9bc7d/8894de84d_logo_mark_transparent.png"
              alt="The Spinn"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/channel/jazz"
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-body font-medium transition-all ${
              location.pathname === "/channel/jazz" ?
              "bg-primary text-primary-foreground" :
              "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
              }>
              
              Jazz
            </Link>
            <Link
              to="/channel/rnb"
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-body font-medium transition-all ${
              location.pathname === "/channel/rnb" ?
              "bg-accent text-accent-foreground" :
              "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
              }>
              Neo Soul & R&B
            </Link>
            <Link
              to="/channel/worldbeat"
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-body font-medium transition-all ${
              location.pathname === "/channel/worldbeat" ?
              "bg-chart-3 text-white" :
              "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
              }>
              World Beat
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/join"
              className="text-sm sm:text-base font-body font-semibold text-primary hover:opacity-75 transition-opacity hidden sm:inline"
            >
              Join The Spinn
            </Link>
            <Link
              to="/submit"
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-body font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Submit Track
            </Link>
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-body text-muted-foreground hidden sm:inline">LIVE</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </nav>);

}