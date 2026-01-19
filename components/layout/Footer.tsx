"use client";

import { Store, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-bodega-gold rounded-lg">
                <Store className="w-5 h-5 text-surface-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold text-lg text-foreground">
                  BODEGA RESEARCH
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-md font-mono">
              Professional Web3 due diligence. We scan the aisles so you
              don&apos;t have to. Get the alpha before you ape.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono font-bold text-sm text-foreground mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm text-gray-400 hover:text-bodega-gold transition-colors font-mono"
                >
                  The Market
                </a>
              </li>
              <li>
                <a
                  href="#inquiry"
                  className="text-sm text-gray-400 hover:text-bodega-gold transition-colors font-mono"
                >
                  Request Review
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-mono font-bold text-sm text-foreground mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-tertiary rounded-lg text-gray-400 hover:text-bodega-gold hover:bg-surface-elevated transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-tertiary rounded-lg text-gray-400 hover:text-bodega-gold hover:bg-surface-elevated transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-mono">
            &copy; {new Date().getFullYear()} Bodega Research. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Built with care in the digital bodega.
          </p>
        </div>
      </div>
    </footer>
  );
}
