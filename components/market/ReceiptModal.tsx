"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Download,
  Share2,
  X,
  Receipt,
  FileText,
  Globe,
  Target,
  Users,
  BarChart2,
  Zap,
  TrendingUp,
  Lock,
  User,
  Camera,
  Loader2,
  Check,
} from "lucide-react";
import type { Review } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  ScoreRadar,
  ScoreRing,
  FreshnessGauge,
  MiniSparkline,
} from "@/components/ui/ScoreCharts";

interface ReceiptModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "receipt" | "review";

function getGrowthColor(potential: string) {
  switch (potential) {
    case "Very High":
      return "text-green-400 bg-green-500/20";
    case "High":
      return "text-green-500 bg-green-500/10";
    case "Medium":
      return "text-bodega-gold bg-bodega-gold/10";
    case "Low":
      return "text-bodega-coral bg-bodega-coral/10";
    default:
      return "text-gray-400 bg-gray-500/10";
  }
}

function getMaturityColor(maturity: string) {
  switch (maturity) {
    case "Emerging":
      return "text-purple-400 bg-purple-500/20";
    case "Growing":
      return "text-green-400 bg-green-500/20";
    case "Mature":
      return "text-blue-400 bg-blue-500/20";
    case "Declining":
      return "text-bodega-coral bg-bodega-coral/20";
    default:
      return "text-gray-400 bg-gray-500/10";
  }
}

function getBarrierColor(barrier: string) {
  switch (barrier) {
    case "Low":
      return "text-green-400";
    case "Medium":
      return "text-bodega-gold";
    case "High":
      return "text-bodega-coral";
    default:
      return "text-gray-400";
  }
}

export function ReceiptModal({ review, isOpen, onClose }: ReceiptModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("receipt");
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!review) return null;

  const receipt = review.ai_data?.publicReceipt;
  const market = review.ai_data?.marketIntelligence;
  const privateReport = review.ai_data?.privateReport;
  const score = review.rating_score || 0;

  const handleDownload = () => {
    if (review.infographic_url) {
      window.open(review.infographic_url, "_blank");
    }
  };

  const handleShare = async () => {
    const shareText = `
📊 Bodega Research Review: ${review.project_name}

Overall Score: ${score.toFixed(1)}/10

✅ THE ALPHA:
${receipt?.theAlpha.map((a) => `• ${a}`).join("\n") || "N/A"}

⚠️ THE FRICTION:
${receipt?.theFriction.map((f) => `• ${f}`).join("\n") || "N/A"}

💡 RECOMMENDATIONS:
${receipt?.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n") || "N/A"}

${market ? `📈 Market: ${market.sector} | TAM: ${market.tam} | Growth: ${market.tamGrowthRate}` : ""}

---
Powered by Bodega Research
    `.trim();

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback to native share if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Bodega Research: ${review.project_name}`,
            text: shareText,
            url: window.location.href,
          });
        } catch {
          // User cancelled
        }
      }
    }
  };

  const handleExportImage = async () => {
    if (!contentRef.current) return;

    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#0A0A0A",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `${review.project_name.toLowerCase().replace(/\s+/g, "-")}-bodega-review.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

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
            {/* Header with Tabs */}
            <div className="border-b border-border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  {review.brand_image_url ? (
                    <img
                      src={review.brand_image_url}
                      alt={review.project_name}
                      className="w-10 h-10 rounded-lg object-contain bg-surface-tertiary border border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-surface-tertiary border border-border flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-mono font-bold text-lg text-foreground">
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

              {/* Tabs */}
              <div className="flex px-4 gap-1">
                <button
                  onClick={() => setActiveTab("receipt")}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-sm rounded-t-lg transition-colors ${
                    activeTab === "receipt"
                      ? "bg-surface-tertiary text-bodega-gold border-t border-x border-border"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <Receipt className="w-4 h-4" />
                  Receipt
                </button>
                <button
                  onClick={() => setActiveTab("review")}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-sm rounded-t-lg transition-colors ${
                    activeTab === "review"
                      ? "bg-surface-tertiary text-bodega-gold border-t border-x border-border"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Full Review
                </button>
              </div>
            </div>

            {/* Content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto">
              {activeTab === "receipt" ? (
                /* Receipt Tab */
                <div className="receipt-paper min-h-[600px] m-4 rounded-lg">
                  {/* Receipt Header */}
                  <div className="text-center py-6 border-b-2 border-dashed border-gray-300">
                    <h2 className="text-2xl font-bold tracking-tight">BODEGA RESEARCH</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      *** WEB3 DUE DILIGENCE ***
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Project Name & Score */}
                  <div className="py-6 text-center border-b-2 border-dashed border-gray-300">
                    {review.brand_image_url && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={review.brand_image_url}
                          alt={review.project_name}
                          className="w-16 h-16 rounded-lg object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold uppercase">{review.project_name}</h3>
                    <div className="mt-4 flex justify-center">
                      <div className="bg-black text-white px-6 py-3 rounded-lg">
                        <div className="text-xs text-gray-400">OVERALL SCORE</div>
                        <div className="text-3xl font-bold">{score.toFixed(1)}/10</div>
                      </div>
                    </div>
                  </div>

                  {receipt && (
                    <>
                      {/* The Alpha */}
                      <div className="py-6 border-b-2 border-dashed border-gray-300">
                        <div className="px-6">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-bold text-gray-500">
                              THE ALPHA
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {receipt.theAlpha.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-green-600">+</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* The Friction */}
                      <div className="py-6 border-b-2 border-dashed border-gray-300">
                        <div className="px-6">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-gray-500">
                              THE FRICTION
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {receipt.theFriction.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-amber-600">!</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="py-6 border-b-2 border-dashed border-gray-300">
                        <div className="px-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-gray-500">
                              RECOMMENDATIONS
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {receipt.recommendations.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-blue-600">&gt;</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Item Breakdown at bottom */}
                      <div className="py-6 border-b-2 border-dashed border-gray-300">
                        <div className="px-6">
                          <div className="text-xs text-gray-500 mb-3">ITEM BREAKDOWN</div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Product-Market Fit</span>
                              <span className="font-bold">{receipt.scores.pmf}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span>UI/UX Quality</span>
                              <span className="font-bold">{receipt.scores.ui}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Social Sentiment</span>
                              <span className="font-bold">{receipt.scores.sentiment}/10</span>
                            </div>
                            <div className="h-px bg-gray-300 my-2" />
                            <div className="flex justify-between text-lg font-bold">
                              <span>TOTAL</span>
                              <span>{receipt.scores.overall}/10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Footer */}
                  <div className="py-6 text-center">
                    <p className="text-xs text-gray-400">
                      ********************************
                    </p>
                    <p className="text-xs text-gray-500 mt-2">THANK YOU FOR SHOPPING</p>
                    <p className="text-xs text-gray-500">AT BODEGA RESEARCH</p>
                    <p className="text-xs text-gray-400 mt-2">
                      ********************************
                    </p>

                    {/* Verified Stamp */}
                    {score >= 8 && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: -12 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="mt-4 inline-block border-4 border-green-600 rounded-lg px-4 py-2"
                      >
                        <span className="font-bold text-green-600 text-lg">
                          BODEGA VERIFIED
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                /* Full Review Tab */
                <div className="p-6 space-y-6">
                  {receipt ? (
                    <>
                      {/* Visual Score Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Freshness Gauge */}
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

                      {/* Market Intelligence */}
                      {market && (
                        <div className="bg-surface-tertiary rounded-xl p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-bodega-gold" />
                            <h3 className="font-mono font-bold text-lg text-foreground">
                              Market Intelligence
                            </h3>
                            <span className="ml-auto px-3 py-1 bg-bodega-navy rounded-full text-xs font-mono text-bodega-gold">
                              {market.sector}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-surface-secondary rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-bodega-gold" />
                                <span className="text-xs font-mono text-gray-500 uppercase">TAM</span>
                              </div>
                              <p className="font-mono font-bold text-2xl text-foreground">{market.tam}</p>
                              <p className="text-xs font-mono text-green-400">{market.tamGrowthRate}</p>
                            </div>

                            <div className="bg-surface-secondary rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-bodega-gold" />
                                <span className="text-xs font-mono text-gray-500 uppercase">Growth</span>
                              </div>
                              <span className={`inline-block px-2 py-1 rounded text-sm font-mono font-bold ${getGrowthColor(market.userGrowthPotential)}`}>
                                {market.userGrowthPotential}
                              </span>
                              <p className="text-xs font-mono text-gray-500 mt-1">User Potential</p>
                            </div>

                            <div className="bg-surface-secondary rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <BarChart2 className="w-4 h-4 text-bodega-gold" />
                                <span className="text-xs font-mono text-gray-500 uppercase">Stage</span>
                              </div>
                              <span className={`inline-block px-2 py-1 rounded text-sm font-mono font-bold ${getMaturityColor(market.marketMaturity)}`}>
                                {market.marketMaturity}
                              </span>
                              <p className="text-xs font-mono text-gray-500 mt-1">Market Phase</p>
                            </div>

                            <div className="bg-surface-secondary rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-bodega-gold" />
                                <span className="text-xs font-mono text-gray-500 uppercase">Barrier</span>
                              </div>
                              <p className={`font-mono font-bold text-lg ${getBarrierColor(market.entryBarrier)}`}>
                                {market.entryBarrier}
                              </p>
                              <p className="text-xs font-mono text-gray-500 mt-1">Entry Difficulty</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-surface-secondary rounded-lg p-4">
                              <h4 className="text-xs font-mono text-gray-500 uppercase mb-3">Key Competitors</h4>
                              <div className="flex flex-wrap gap-2">
                                {market.keyCompetitors.map((competitor, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-bodega-navy/50 border border-border rounded-full text-xs font-mono text-gray-300"
                                  >
                                    {competitor}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="bg-surface-secondary rounded-lg p-4">
                              <h4 className="text-xs font-mono text-gray-500 uppercase mb-3">Market Trends</h4>
                              <ul className="space-y-2">
                                {market.marketTrends.map((trend, i) => (
                                  <li key={i} className="text-xs font-mono text-gray-300 flex items-start gap-2">
                                    <span className="text-bodega-gold mt-0.5">→</span>
                                    <span>{trend}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Two Column Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
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
                                <li key={i} className="text-sm text-gray-300 font-mono flex items-start gap-2">
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
                                <li key={i} className="text-sm text-gray-300 font-mono flex items-start gap-2">
                                  <span className="text-bodega-coral mt-0.5">!</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Recommendations TLDR */}
                          <div className="bg-surface-tertiary rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Lightbulb className="w-4 h-4 text-bodega-gold" />
                              <h4 className="font-mono font-bold text-sm text-bodega-gold">
                                RECOMMENDATIONS TLDR
                              </h4>
                            </div>
                            <ul className="space-y-2">
                              {receipt.recommendations.map((rec, i) => (
                                <li key={i} className="text-sm text-gray-300 font-mono flex items-start gap-2">
                                  <span className="text-bodega-gold">{i + 1}.</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Easy's Take */}
                          {review.raw_notes?.my_recommendations && (
                            <div className="bg-bodega-gold/10 border border-bodega-gold/30 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-bodega-gold" />
                                <h4 className="font-mono font-bold text-sm text-bodega-gold">
                                  EASY&apos;S TAKE
                                </h4>
                              </div>
                              <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                                {review.raw_notes.my_recommendations}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Analyst Report */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-bodega-gold" />
                            <h3 className="font-mono font-bold text-lg text-foreground">
                              Analyst Report
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
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 font-mono">
                        No analysis data available for this review.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-secondary">
              <div className="text-xs text-gray-500 font-mono">
                {new Date(review.created_at).toLocaleString()}
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Export Image Button */}
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  onClick={handleExportImage}
                  disabled={isExporting}
                >
                  {isExporting ? "Exporting..." : "Export Image"}
                </Button>

                {/* Share/Copy Button */}
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  onClick={handleShare}
                >
                  {copied ? "Copied!" : "Copy Summary"}
                </Button>

                {/* Download PDF */}
                {review.infographic_url && (
                  <Button
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={handleDownload}
                  >
                    Download PDF
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
