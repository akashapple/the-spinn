import { motion } from "framer-motion";
import { Radio, Disc3, Headphones } from "lucide-react";
import ChannelCard from "../components/ChannelCard";
import AdBanner from "../components/AdBanner";

const JAZZ_IMG = "https://media.base44.com/images/public/69c4550d94d5716560c9bc7d/99deadc72_generated_a6fc5c33.png";
const RNB_IMG = "https://media.base44.com/images/public/69c4550d94d5716560c9bc7d/b3abba13b_generated_fcb1e711.png";
const WORLDBEAT_IMG = "https://media.base44.com/images/public/69c4550d94d5716560c9bc7d/08c45172e_generated_image.png";
const HERO_IMG = "https://media.base44.com/images/public/69c4550d94d5716560c9bc7d/502647789_generated_1f43b1cd.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Sound waves" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto">
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-body text-primary uppercase tracking-[0.2em] font-medium">
                Now Streaming
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold text-foreground leading-[0.9] mb-6">Enjoy the Ride!


            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">Jazz,Neo Soul & R&B and World Beat music!


            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center gap-8 sm:gap-16 mt-12">
            
            {[
            { icon: Radio, label: "3 Live Channels", value: "" },
            { icon: Disc3, label: "24/7 Streaming", value: "" },
            { icon: Headphones, label: "Hi-Fi Quality", value: "" }].
            map((stat, i) =>
            <div key={i} className="flex flex-col items-center gap-2">
                <stat.icon className="w-5 h-5 text-primary" />
                <span className="text-xs font-body text-muted-foreground tracking-wider uppercase">{stat.label}</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Ad Banner - Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <AdBanner variant="horizontal" />
      </div>

      {/* Channels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 rounded-full bg-primary" />
          <h2 className="font-display text-2xl font-semibold text-foreground">Choose Your Vibe</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChannelCard
              name="Jazz"
              genre="Smooth Jazz • Bebop • Cool Jazz • Fusion"
              image={JAZZ_IMG}
              path="/channel/jazz"
              accentColor="bg-primary"
              listeners="2.4K"
              isActive={false} />
            
            <ChannelCard
              name="Neo Soul & R&B"
              genre="Neo-Soul • Classic R&B • Contemporary"
              image={RNB_IMG}
              path="/channel/rnb"
              accentColor="bg-accent"
              listeners="3.1K"
              isActive={false} />

            <ChannelCard
              name="World Beat"
              genre="Afrobeat • Latin • Caribbean • World"
              image={WORLDBEAT_IMG}
              path="/channel/worldbeat"
              accentColor="bg-chart-3"
              listeners="1.8K"
              isActive={false} />
          </div>

          {/* Sidebar Ad */}
          <div className="hidden lg:block">
            <AdBanner variant="sidebar" />
          </div>
        </div>
      </section>

      {/* Second Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <AdBanner variant="horizontal" />
      </div>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border border-border/50 bg-card/30 p-8 sm:p-12 text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
            Crafted for Connoisseurs
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed"> The SPINN more than a radio station — it's a sanctuary for music lovers. Our channels are curated by passionate DJs who breathe Jazz, Neo Soul and World Beat delivering an uninterrupted stream of timeless classics and fresh discoveries. Enjoy!



          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" />
            <span className="font-display text-sm text-foreground">The SPINN</span>
          </div>
          <p className="text-xs font-body text-muted-foreground">© 2026 TheSPINN Radio. All rights reserved.

          </p>
        </div>
      </footer>
    </div>);

}