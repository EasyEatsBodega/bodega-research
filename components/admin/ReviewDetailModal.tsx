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
  User,
} from "lucide-react";
import type { Review } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  ScoreRadar,
  ScoreRing,
  FreshnessGauge,
  MiniSparkline,
} from "@/components/ui/ScoreCharts";

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
                {/* Brand Image */}
                {review.brand_image_url ? (
                  <img
                    src={review.brand_image_url}
                    alt={review.project_name}
                    className="w-12 h-12 rounded-lg object-contain bg-surface-tertiary border border-border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-surface-tertiary border border-border flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <h2 className="font-mono font-bold text-xl text-foreground">
                    {review.project_name}
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
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
                <div className="space-y-6">
                  {/* Visual Score Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Freshness Gauge - Main Visual */}
                    <div className="bg-surface-tertiary rounded-xl p-6 flex flex-col items-center justify-center">
                      <h4 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4">
                        Freshness Rating
                      </h4>
                      <FreshnessGauge score={receipt.scores.overall} />
                    </div>

                    {/* Radar Chart */}
                    <div className="bg-surface-tertiary rounded-xl p-6">
                      <h4 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2 text-center">
                        Score Breakdown
                      </h4>
                      <ScoreRadar
                        pmf={receipt.scores.pmf}
                        ui={receipt.scores.ui}
                        sentiment={receipt.scores.sentiment}
                        overall={receipt.scores.overall}
                      />
                    </div>

                    {/* Individual Score Rings */}
                    <div className="bg-surface-tertiary rounded-xl p-6">
                      <h4 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-4 text-center">
                        Category Scores
                      </h4>
                      <div className="flex justify-around">
                        <ScoreRing score={receipt.scores.pmf} label="PMF" size="sm" />
                        <ScoreRing score={receipt.scores.ui} label="UI/UX" size="sm" />
                        <ScoreRing score={receipt.scores.sentiment} label="VIBE" size="sm" />
                      </div>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Public Receipt */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-bodega-gold" />
                        <h3 className="font-mono font-bold text-lg text-foreground">
                          Public Receipt
                        </h3>
                      </div>

                      {/* Score Progress Bars */}
                      <div className="bg-surface-tertiary rounded-lg p-4 space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-mono text-gray-400">Product-Market Fit</span>
                            <span className="text-xs font-mono text-bodega-gold">{receipt.scores.pmf}/10</span>
                          </div>
                          <MiniSparkline value={receipt.scores.pmf} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-mono text-gray-400">UI/UX Quality</span>
                            <span className="text-xs font-mono text-bodega-gold">{receipt.scores.ui}/10</span>
                          </div>
                          <MiniSparkline value={receipt.scores.ui} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-mono text-gray-400">Social Sentiment</span>
                            <span className="text-xs font-mono text-bodega-gold">{receipt.scores.sentiment}/10</span>
                          </div>
                          <MiniSparkline value={receipt.scores.sentiment} />
                        </div>
                      </div>

                      {/* The Alpha */}
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
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
                              <span className="text-green-500 mt-0.5">+</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* The Friction */}
                      <div className="bg-bodega-coral/10 border border-bodega-coral/30 rounded-lg p-4">
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
                              <span className="text-bodega-coral mt-0.5">!</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* AI Recommendations */}
                      <div className="bg-surface-tertiary rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-bodega-gold" />
                          <h4 className="font-mono font-bold text-sm text-bodega-gold">
                            AI RECOMMENDATIONS
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {receipt.recommendations.map((rec, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-300 font-mono flex items-start gap-2"
                            >
                              <span className="text-bodega-gold">{i + 1}.</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Admin's Personal Recommendations */}
                      {review.raw_notes?.my_recommendations && (
                        <div className="bg-bodega-gold/10 border border-bodega-gold/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <User className="w-4 h-4 text-bodega-gold" />
                            <h4 className="font-mono font-bold text-sm text-bodega-gold">
                              BODEGA&apos;S TAKE
                            </h4>
                          </div>
                          <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                            {review.raw_notes.my_recommendations}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Private Report */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-bodega-gold" />
                        <h3 className="font-mono font-bold text-lg text-foreground">
                          Private Analyst Report
                        </h3>
                      </div>

                      <div className="bg-surface-tertiary rounded-lg p-4 min-h-[400px] overflow-y-auto">
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
