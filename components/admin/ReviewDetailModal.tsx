"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FileText,
  Lock,
  Download,
} from "lucide-react";
import type { Review } from "@/types";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { Button } from "@/components/ui/Button";

interface ReviewDetailModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewDetailModal({
  review,
  isOpen,
  onClose,
}: ReviewDetailModalProps) {
  if (!review) return null;

  const receipt = review.ai_data?.publicReceipt;
  const privateReport = review.ai_data?.privateReport;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-10 bg-surface-secondary border border-border rounded-xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <h2 className="font-mono font-bold text-xl text-foreground">
                  {review.project_name}
                </h2>
                <ScoreBadge score={review.rating_score || 0} size="md" />
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {receipt ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Public Receipt */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-bodega-gold" />
                      <h3 className="font-mono font-bold text-lg text-foreground">
                        Public Receipt
                      </h3>
                    </div>

                    {/* Scores Grid */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-surface-tertiary rounded-lg">
                        <div className="text-xs text-gray-500 font-mono mb-1">
                          PMF
                        </div>
                        <div className="font-mono font-bold text-bodega-gold text-lg">
                          {receipt.scores.pmf}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-surface-tertiary rounded-lg">
                        <div className="text-xs text-gray-500 font-mono mb-1">
                          UI/UX
                        </div>
                        <div className="font-mono font-bold text-bodega-gold text-lg">
                          {receipt.scores.ui}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-surface-tertiary rounded-lg">
                        <div className="text-xs text-gray-500 font-mono mb-1">
                          VIBE
                        </div>
                        <div className="font-mono font-bold text-bodega-gold text-lg">
                          {receipt.scores.sentiment}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-bodega-gold/20 rounded-lg border border-bodega-gold">
                        <div className="text-xs text-bodega-gold font-mono mb-1">
                          OVERALL
                        </div>
                        <div className="font-mono font-bold text-bodega-gold text-lg">
                          {receipt.scores.overall}
                        </div>
                      </div>
                    </div>

                    {/* The Alpha */}
                    <div className="bg-surface-tertiary rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <h4 className="font-mono font-bold text-sm text-green-500">
                          THE ALPHA
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {receipt.theAlpha.map((point, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-300 font-mono flex items-start gap-2"
                          >
                            <span className="text-green-500">+</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* The Friction */}
                    <div className="bg-surface-tertiary rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-bodega-coral" />
                        <h4 className="font-mono font-bold text-sm text-bodega-coral">
                          THE FRICTION
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {receipt.theFriction.map((point, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-300 font-mono flex items-start gap-2"
                          >
                            <span className="text-bodega-coral">!</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-surface-tertiary rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-bodega-gold" />
                        <h4 className="font-mono font-bold text-sm text-bodega-gold">
                          RECOMMENDATIONS
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {receipt.recommendations.map((rec, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-300 font-mono flex items-start gap-2"
                          >
                            <span className="text-bodega-gold">{i + 1}.</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column - Private Report */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="w-5 h-5 text-bodega-gold" />
                      <h3 className="font-mono font-bold text-lg text-foreground">
                        Private Analyst Report
                      </h3>
                    </div>

                    <div className="bg-surface-tertiary rounded-lg p-4 h-[calc(100%-4rem)] overflow-y-auto">
                      <div className="prose prose-invert prose-sm max-w-none">
                        {privateReport?.split("\n").map((paragraph, i) => (
                          <p
                            key={i}
                            className="text-sm text-gray-300 font-mono mb-3 leading-relaxed"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-mono">
                    No AI analysis data available for this review.
                  </p>
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className="border-t border-border p-4 flex justify-between items-center">
              <div className="text-xs text-gray-500 font-mono">
                Created: {new Date(review.created_at).toLocaleString()}
              </div>
              <div className="flex gap-3">
                {review.infographic_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => window.open(review.infographic_url!, "_blank")}
                  >
                    Public Receipt
                  </Button>
                )}
                {review.report_url && (
                  <Button
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => window.open(review.report_url!, "_blank")}
                  >
                    Full Report
                  </Button>
                )}
                {!review.infographic_url && !review.report_url && (
                  <span className="text-xs text-gray-500 font-mono">
                    PDFs not generated yet
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
