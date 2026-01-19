"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Store, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface-primary/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: -10 }}
              className="p-2 bg-bodega-gold rounded-lg"
            >
              <Store className="w-5 h-5 text-surface-primary" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-lg text-foreground tracking-tight">
                BODEGA
              </span>
              <span className="font-mono text-xs text-bodega-gold -mt-1">
                RESEARCH
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="font-mono text-sm text-gray-400 hover:text-foreground transition-colors"
            >
              THE MARKET
            </Link>
            <Link
              href="#inquiry"
              className="font-mono text-sm text-gray-400 hover:text-foreground transition-colors"
            >
              INQUIRY
            </Link>
            <Link
              href="/admin/login"
              className="font-mono text-sm px-4 py-2 border border-border rounded-lg text-gray-400 hover:border-bodega-gold hover:text-bodega-gold transition-all"
            >
              STAFF ONLY
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-foreground"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm text-gray-400 hover:text-foreground py-2"
            >
              THE MARKET
            </Link>
            <Link
              href="#inquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm text-gray-400 hover:text-foreground py-2"
            >
              INQUIRY
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-mono text-sm text-gray-400 hover:text-foreground py-2"
            >
              STAFF ONLY
            </Link>
          </motion.nav>
        )}
      </div>
    </header>
  );
}
