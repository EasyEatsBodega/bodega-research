"use client";

import { motion } from "framer-motion";
import { Scan, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary border border-border rounded-full mb-8"
        >
          <span className="w-2 h-2 bg-bodega-gold rounded-full animate-pulse" />
          <span className="font-mono text-sm text-gray-400">
            OPEN FOR BUSINESS
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-mono text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
        >
          Web3 Due Diligence
          <br />
          <span className="text-gradient-gold">From the Corner Store</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 font-mono max-w-2xl mx-auto mb-10"
        >
          We scan the aisles so you don&apos;t have to. Professional project
          analysis with that bodega authenticity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
            Browse Stock
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Scan className="w-5 h-5 text-bodega-gold" />
              <span className="font-mono text-3xl font-bold text-foreground">
                50+
              </span>
            </div>
            <p className="text-sm text-gray-500 font-mono">Projects Reviewed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-bodega-gold" />
              <span className="font-mono text-3xl font-bold text-foreground">
                15+
              </span>
            </div>
            <p className="text-sm text-gray-500 font-mono">Bodega Verified</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-bodega-gold" />
              <span className="font-mono text-3xl font-bold text-foreground">
                48h
              </span>
            </div>
            <p className="text-sm text-gray-500 font-mono">Avg. Turnaround</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
