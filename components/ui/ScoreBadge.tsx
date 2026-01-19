"use client";

import { motion } from "framer-motion";

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeStyles = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-lg",
  lg: "w-16 h-16 text-2xl",
};

function getScoreColor(score: number): string {
  if (score >= 8) return "bg-bodega-gold text-surface-primary";
  if (score >= 6) return "bg-bodega-orange text-surface-primary";
  if (score >= 4) return "bg-bodega-coral text-white";
  return "bg-bodega-burgundy text-white";
}

function getScoreLabel(score: number): string {
  if (score >= 8) return "CERTIFIED";
  if (score >= 6) return "SOLID";
  if (score >= 4) return "MIXED";
  return "CAUTION";
}

export function ScoreBadge({
  score,
  label,
  size = "md",
  showLabel = false,
}: ScoreBadgeProps) {
  const colorClass = getScoreColor(score);
  const scoreLabel = label || getScoreLabel(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={`
          inline-flex items-center justify-center
          rounded-full font-mono font-bold
          ${sizeStyles[size]}
          ${colorClass}
        `}
      >
        {score.toFixed(1)}
      </motion.div>
      {showLabel && (
        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
          {scoreLabel}
        </span>
      )}
    </div>
  );
}
