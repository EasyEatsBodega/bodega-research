"use client";

import { motion } from "framer-motion";
import { Scan, ShieldCheck, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="py-16 md:py-24 relative gritty-overlay">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-bodega-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-bodega-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative">
        {/* Neon OPEN Sign */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <div className="open-sign px-6 py-2 rounded-lg flex items-center gap-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-mono text-green-400 font-bold tracking-widest text-sm">
              OPEN 24/7
            </span>
            <Clock className="w-4 h-4 text-green-400" />
          </div>
        </motion.div>

        {/* Main Neon Sign */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative inline-block mb-8"
        >
          <div className="neon-sign py-6 px-10 rounded-lg">
            <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="neon-text text-bodega-gold">BODEGA</span>
            </h1>
            <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-2 tracking-wider">
              RESEARCH
            </h2>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <p className="text-lg md:text-xl text-gray-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Your neighborhood Web3 due diligence shop.
            <br />
            <span className="text-bodega-gold">We check the expiration dates</span> so you don&apos;t get burned.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            leftIcon={<Scan className="w-5 h-5" />}
            onClick={() =>
              document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Request Review
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              document.querySelector('[data-section="stock"]')?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Browse the Aisles
          </Button>
        </motion.div>

        {/* Store Front Stats Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="window-display p-8 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-surface-tertiary border border-border flex items-center justify-center group-hover:border-bodega-gold group-hover:neon-box transition-all duration-300">
                <Scan className="w-7 h-7 text-bodega-gold" />
              </div>
              <span className="font-mono text-xl md:text-2xl font-bold text-foreground block">
                Open for
              </span>
              <p className="text-xs md:text-sm text-gray-500 font-mono mt-1">
                Customers
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-surface-tertiary border border-border flex items-center justify-center group-hover:border-bodega-gold group-hover:neon-box transition-all duration-300">
                <ShieldCheck className="w-7 h-7 text-bodega-gold" />
              </div>
              <span className="font-mono text-lg md:text-xl font-bold text-foreground block">
                Are They...
              </span>
              <p className="text-xs md:text-sm text-gray-500 font-mono mt-1">
                Fresh or a Flop
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-surface-tertiary border border-border flex items-center justify-center group-hover:border-bodega-gold group-hover:neon-box transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-bodega-gold" />
              </div>
              <span className="font-mono text-2xl md:text-3xl font-bold text-foreground block">
                48h
              </span>
              <p className="text-xs md:text-sm text-gray-500 font-mono mt-1">
                Avg. Turnaround
              </p>
            </div>
          </div>

          {/* Decorative Receipt Tape */}
          <div className="mt-8 pt-6 border-t border-dashed border-gray-700">
            <p className="font-mono text-xs text-gray-600 uppercase tracking-widest">
              Est. 2024 &bull; NYC Vibes &bull; Always Fresh Stock
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
