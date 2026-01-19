"use client";

import { motion } from "framer-motion";
import { Eye, Calendar, TrendingUp } from "lucide-react";
import type { Review } from "@/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";

interface InventoryTagProps {
  review: Review;
  onClick: () => void;
  index?: number;
}

export function InventoryTag({ review, onClick, index = 0 }: InventoryTagProps) {
  const score = review.rating_score || 0;
  const createdDate = new Date(review.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onClick={onClick}
      className="inventory-tag cursor-pointer group"
    >
      {/* Top gradient bar is handled by CSS */}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-mono font-bold text-lg text-foreground truncate group-hover:text-bodega-gold transition-colors">
              {review.project_name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-mono">
              <Calendar className="w-3 h-3" />
              <span>{createdDate}</span>
            </div>
          </div>

          <ScoreBadge score={score} size="md" />
        </div>

        {/* Quick Stats */}
        {review.ai_data?.publicReceipt && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-surface-tertiary rounded-lg">
              <div className="text-xs text-gray-500 font-mono mb-1">PMF</div>
              <div className="font-mono font-bold text-bodega-gold">
                {review.ai_data.publicReceipt.scores.pmf}
              </div>
            </div>
            <div className="text-center p-2 bg-surface-tertiary rounded-lg">
              <div className="text-xs text-gray-500 font-mono mb-1">UI</div>
              <div className="font-mono font-bold text-bodega-gold">
                {review.ai_data.publicReceipt.scores.ui}
              </div>
            </div>
            <div className="text-center p-2 bg-surface-tertiary rounded-lg">
              <div className="text-xs text-gray-500 font-mono mb-1">VIBE</div>
              <div className="font-mono font-bold text-bodega-gold">
                {review.ai_data.publicReceipt.scores.sentiment}
              </div>
            </div>
          </div>
        )}

        {/* Price Sticker Style Rating */}
        <div className="flex items-center justify-between">
          <div className="price-sticker">
            <TrendingUp className="w-3 h-3 mr-1" />
            {score >= 8 ? "CERTIFIED" : score >= 6 ? "SOLID" : score >= 4 ? "MIXED" : "DYOR"}
          </div>

          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-bodega-gold font-mono transition-colors">
            <Eye className="w-3 h-3" />
            CHECK STOCK
          </button>
        </div>
      </div>

      {/* Verified stamp for high scores */}
      {score >= 8 && (
        <div className="verified-stamp text-xs">
          BODEGA VERIFIED
        </div>
      )}
    </motion.div>
  );
}
