"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Palette,
  AppWindow,
  MessageSquare,
  Receipt,
  RotateCcw,
  ImagePlus,
  Lightbulb,
  X,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AisleInput } from "./AisleInput";
import { PrintAnimation } from "./PrintAnimation";
import type { ReviewFormData, MarketSector, MarketMaturityLevel, EntryBarrierLevel } from "@/types";

const SECTOR_OPTIONS: { value: MarketSector; label: string }[] = [
  { value: "DeFi", label: "DeFi" },
  { value: "NFT/Digital Collectibles", label: "NFT/Digital Collectibles" },
  { value: "Gaming/GameFi", label: "Gaming/GameFi" },
  { value: "Layer 1/Layer 2", label: "Layer 1/Layer 2" },
  { value: "Social/SocialFi", label: "Social/SocialFi" },
  { value: "DAO Tooling", label: "DAO Tooling" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Wallet/Payments", label: "Wallet/Payments" },
  { value: "Data/Analytics", label: "Data/Analytics" },
  { value: "Security/Auditing", label: "Security/Auditing" },
  { value: "Other", label: "Other" },
];

const MATURITY_OPTIONS: { value: MarketMaturityLevel; label: string; description: string }[] = [
  { value: "Emerging", label: "Emerging", description: "New market, few players" },
  { value: "Growing", label: "Growing", description: "Expanding market, increasing competition" },
  { value: "Mature", label: "Mature", description: "Established market, well-defined leaders" },
  { value: "Declining", label: "Declining", description: "Shrinking market, consolidation" },
];

const BARRIER_OPTIONS: { value: EntryBarrierLevel; label: string; description: string }[] = [
  { value: "Low", label: "Low", description: "Easy to enter, low capital" },
  { value: "Medium", label: "Medium", description: "Some technical/capital barriers" },
  { value: "High", label: "High", description: "Significant barriers to entry" },
];

interface POSFormProps {
  onSuccess?: () => void;
}

export function POSForm({ onSuccess }: POSFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    projectName: "",
    brandImage: null,
    aisle1_pmf: "",
    aisle2_uiux: "",
    aisle3_general: "",
    aisle4_sentiment: "",
    my_recommendations: "",
    marketSector: "DeFi",
    marketCompetitors: "",
    marketMaturity: "Growing",
    entryBarrier: "Medium",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintComplete, setIsPrintComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, brandImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, brandImage: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsPrinting(true);
    setIsPrintComplete(false);

    try {
      // Use FormData to handle both JSON and file upload
      const submitData = new FormData();
      submitData.append("projectName", formData.projectName);
      submitData.append("rawNotes", JSON.stringify({
        aisle1_pmf: formData.aisle1_pmf,
        aisle2_uiux: formData.aisle2_uiux,
        aisle3_general: formData.aisle3_general,
        aisle4_sentiment: formData.aisle4_sentiment,
        my_recommendations: formData.my_recommendations,
        marketContext: {
          sector: formData.marketSector,
          competitors: formData.marketCompetitors,
          marketMaturity: formData.marketMaturity,
          entryBarrier: formData.entryBarrier,
        },
      }));
      if (formData.brandImage) {
        submitData.append("brandImage", formData.brandImage);
      }

      const response = await fetch("/api/generate-report", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate report");
      }

      // Show complete animation
      setIsPrintComplete(true);

      // Wait for animation, then reset
      setTimeout(() => {
        setIsPrinting(false);
        setIsPrintComplete(false);
        setFormData({
          projectName: "",
          brandImage: null,
          aisle1_pmf: "",
          aisle2_uiux: "",
          aisle3_general: "",
          aisle4_sentiment: "",
          my_recommendations: "",
          marketSector: "DeFi",
          marketCompetitors: "",
          marketMaturity: "Growing",
          entryBarrier: "Medium",
        });
        setImagePreview(null);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setIsPrinting(false);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      projectName: "",
      brandImage: null,
      aisle1_pmf: "",
      aisle2_uiux: "",
      aisle3_general: "",
      aisle4_sentiment: "",
      my_recommendations: "",
      marketSector: "DeFi",
      marketCompetitors: "",
      marketMaturity: "Growing",
      entryBarrier: "Medium",
    });
    setImagePreview(null);
    setError(null);
  };

  const isFormValid =
    formData.projectName.trim() &&
    formData.aisle1_pmf.trim() &&
    formData.aisle2_uiux.trim() &&
    formData.aisle3_general.trim() &&
    formData.aisle4_sentiment.trim();

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-secondary border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-bodega-gold rounded-full animate-pulse" />
            <span className="font-mono text-sm text-gray-400">
              NEW ITEM ENTRY
            </span>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <Input
                label="Project Name"
                placeholder="Enter the project name..."
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                className="text-xl font-bold"
                required
              />
            </div>

            {/* Brand Image Upload */}
            <div className="lg:w-48">
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Brand Image
              </label>
              {imagePreview ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Brand preview"
                    className="w-full h-full object-contain bg-surface-tertiary"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-bodega-burgundy rounded-full hover:bg-bodega-coral transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-bodega-gold hover:bg-surface-tertiary/50 transition-colors">
                  <ImagePlus className="w-8 h-8 text-gray-500 mb-2" />
                  <span className="text-xs text-gray-500 font-mono">Upload logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </motion.div>

        {/* Aisles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AisleInput
            aisleNumber={1}
            title="Product-Market Fit"
            description="Does the product solve a real problem? Is there demand?"
            icon={Target}
            value={formData.aisle1_pmf}
            onChange={(value) =>
              setFormData({ ...formData, aisle1_pmf: value })
            }
            placeholder="Notes on PMF, target audience, problem-solution fit..."
          />

          <AisleInput
            aisleNumber={2}
            title="UI/UX Quality"
            description="How's the user experience? Design quality? Ease of use?"
            icon={Palette}
            value={formData.aisle2_uiux}
            onChange={(value) =>
              setFormData({ ...formData, aisle2_uiux: value })
            }
            placeholder="Notes on design, usability, user flow..."
          />

          <AisleInput
            aisleNumber={3}
            title="General App Assessment"
            description="Technical quality, features, documentation, team?"
            icon={AppWindow}
            value={formData.aisle3_general}
            onChange={(value) =>
              setFormData({ ...formData, aisle3_general: value })
            }
            placeholder="Notes on tech stack, features, roadmap, team..."
          />

          <AisleInput
            aisleNumber={4}
            title="Social Sentiment"
            description="Community vibes, Twitter sentiment, Discord activity?"
            icon={MessageSquare}
            value={formData.aisle4_sentiment}
            onChange={(value) =>
              setFormData({ ...formData, aisle4_sentiment: value })
            }
            placeholder="Notes on community, social presence, sentiment..."
          />
        </div>

        {/* Market Context Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-surface-secondary border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-bodega-orange/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-bodega-orange" />
            </div>
            <div>
              <span className="font-mono text-xs text-bodega-orange uppercase tracking-wider">
                MARKET INTEL
              </span>
              <h3 className="font-mono font-bold text-foreground">
                Market Context
              </h3>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-mono mb-6 pl-12">
            Provide context about the market/sector this project operates in
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sector Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-mono text-gray-400 uppercase tracking-wider">
                Sector
              </label>
              <div className="relative">
                <select
                  value={formData.marketSector}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketSector: e.target.value as MarketSector,
                    })
                  }
                  className="w-full bg-surface-tertiary border border-border rounded-lg px-4 py-3 font-mono text-foreground appearance-none cursor-pointer hover:border-bodega-gold/50 focus:border-bodega-gold focus:outline-none focus:ring-1 focus:ring-bodega-gold transition-colors"
                >
                  {SECTOR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Market Maturity Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-mono text-gray-400 uppercase tracking-wider">
                Market Maturity
              </label>
              <div className="relative">
                <select
                  value={formData.marketMaturity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      marketMaturity: e.target.value as MarketMaturityLevel,
                    })
                  }
                  className="w-full bg-surface-tertiary border border-border rounded-lg px-4 py-3 font-mono text-foreground appearance-none cursor-pointer hover:border-bodega-gold/50 focus:border-bodega-gold focus:outline-none focus:ring-1 focus:ring-bodega-gold transition-colors"
                >
                  {MATURITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Entry Barrier Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-mono text-gray-400 uppercase tracking-wider">
                Entry Barrier
              </label>
              <div className="relative">
                <select
                  value={formData.entryBarrier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      entryBarrier: e.target.value as EntryBarrierLevel,
                    })
                  }
                  className="w-full bg-surface-tertiary border border-border rounded-lg px-4 py-3 font-mono text-foreground appearance-none cursor-pointer hover:border-bodega-gold/50 focus:border-bodega-gold focus:outline-none focus:ring-1 focus:ring-bodega-gold transition-colors"
                >
                  {BARRIER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Competitors Input */}
            <div className="space-y-2">
              <label className="block text-sm font-mono text-gray-400 uppercase tracking-wider">
                Key Competitors
              </label>
              <input
                type="text"
                value={formData.marketCompetitors}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    marketCompetitors: e.target.value,
                  })
                }
                placeholder="Aave, Compound, MakerDAO..."
                className="w-full bg-surface-tertiary border border-border rounded-lg px-4 py-3 font-mono text-foreground placeholder:text-gray-500 focus:outline-none focus:border-bodega-gold focus:ring-1 focus:ring-bodega-gold transition-colors"
              />
              <p className="text-xs text-gray-500 font-mono">
                Comma-separated list of main competitors
              </p>
            </div>
          </div>
        </motion.div>

        {/* My Recommendations - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-secondary border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-bodega-gold/20 rounded-lg">
              <Lightbulb className="w-5 h-5 text-bodega-gold" />
            </div>
            <div>
              <span className="font-mono text-xs text-bodega-gold uppercase tracking-wider">
                YOUR TAKE
              </span>
              <h3 className="font-mono font-bold text-foreground">
                My Recommendations
              </h3>
            </div>
          </div>
          <p className="text-xs text-gray-500 font-mono mb-4 pl-12">
            Your personal recommendations and insights for the reader
          </p>
          <textarea
            value={formData.my_recommendations}
            onChange={(e) =>
              setFormData({ ...formData, my_recommendations: e.target.value })
            }
            placeholder="Share your specific recommendations, next steps, or personal insights..."
            className="w-full px-4 py-3 bg-surface-tertiary border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:border-bodega-gold focus:shadow-glow-gold transition-all min-h-[120px] resize-y"
          />
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-bodega-burgundy/20 border border-bodega-burgundy rounded-lg"
          >
            <p className="text-sm text-bodega-coral font-mono">{error}</p>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={!isFormValid}
            isLoading={isSubmitting}
            leftIcon={<Receipt className="w-5 h-5" />}
          >
            PRINT RECEIPT
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-5 h-5" />}
          >
            CLEAR
          </Button>
        </div>
      </form>

      {/* Print Animation Overlay */}
      <PrintAnimation
        isVisible={isPrinting}
        isComplete={isPrintComplete}
        projectName={formData.projectName}
      />
    </>
  );
}
