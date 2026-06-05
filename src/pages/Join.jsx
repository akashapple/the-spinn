import { Link } from "react-router-dom";
import { Music2, Radio, BarChart2, Users, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const BENEFITS = [
  {
    icon: Radio,
    title: "Get Featured",
    description: "Approved tracks play in our Featured Artist Hour on your genre channel, heard by thousands of listeners.",
  },
  {
    icon: BarChart2,
    title: "Track Your Submissions",
    description: "Create a profile and monitor the status of every track you submit — all in one place.",
  },
  {
    icon: Users,
    title: "Connect With Listeners",
    description: "Reach thousands of listeners across our 3 live channels: Jazz, Neo Soul & R&B, and World Beat.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Submit Your Track",
    description: "Fill out our simple submission form with your track details and upload your audio file.",
  },
  {
    number: "02",
    title: "We Review Your Music",
    description: "Our editorial team listens to every submission and carefully selects tracks that fit our channels.",
  },
  {
    number: "03",
    title: "Get on Air",
    description: "Approved tracks are scheduled to play in the Featured Artist Hour on your matching genre channel.",
  },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay, ease: "easeOut" },
  };
}

export default function Join() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* HERO */}
      <section className="relative pt-24 pb-28 px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

        <motion.div {...fadeUp(0)} className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-body font-semibold uppercase tracking-widest mb-8">
            <Music2 className="w-3.5 h-3.5" />
            Open for Submissions
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-bold text-foreground leading-tight mb-6">
            Get Your Music<br />
            <span className="text-primary">Heard</span>
          </h1>

          <p className="font-body text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            Share your music with thousands of listeners. Join The Spinn community and let your sound be heard on our 24/7 live radio channels.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-body font-bold text-base hover:opacity-90 transition shadow-lg shadow-primary/25"
            >
              Submit Your Track <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/artist/profile"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-border/60 text-muted-foreground font-body text-sm hover:text-foreground hover:border-primary/40 transition"
            >
              New or returning artist? Start here
            </Link>
          </div>
        </motion.div>

        {/* Decorative channel pills */}
        <motion.div {...fadeUp(0.2)} className="relative z-10 flex flex-wrap items-center justify-center gap-3 mt-14">
          {["Jazz", "Neo Soul & R&B", "World Beat"].map((ch) => (
            <span key={ch} className="px-4 py-1.5 rounded-full border border-border/40 bg-card/60 text-xs font-body text-muted-foreground">
              {ch}
            </span>
          ))}
        </motion.div>
      </section>

      {/* DIVIDER */}
      <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mx-8" />

      {/* BENEFITS */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">Why Submit to The Spinn?</h2>
            <p className="font-body text-muted-foreground">Everything you need to grow your audience.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title} {...fadeUp(i * 0.1)}
                className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-7 flex flex-col gap-4 hover:border-primary/30 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{b.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 bg-card/20">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="font-body text-muted-foreground">Simple, transparent, and artist-first.</p>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-8 left-[calc(16.666%+20px)] right-[calc(16.666%+20px)] h-px bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {STEPS.map((step, i) => (
                <motion.div key={step.number} {...fadeUp(i * 0.15)} className="flex flex-col items-center text-center gap-4">
                  <div className="relative w-16 h-16 rounded-full border-2 border-primary/40 bg-card flex items-center justify-center flex-shrink-0 z-10">
                    <span className="font-display text-xl font-bold text-primary">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <CheckCircle className="sm:hidden w-5 h-5 text-primary/40" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] rounded-full bg-primary/8 blur-[100px]" />
        </div>
        <motion.div {...fadeUp(0)} className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">Ready to be heard?</h2>
          <p className="font-body text-muted-foreground mb-10">Join the artists already spinning on our channels.</p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-body font-bold text-base hover:opacity-90 transition shadow-xl shadow-primary/20"
          >
            Submit Your Track Now <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
}